import { Product, Coupon, SiteSettings, CartItem } from '../types';

export interface PricingResult {
  lines: { product_slug: string; title: string; type: 'book' | 'bundle'; qty: number; unit_price_paise: number; line_total_paise: number; hsn: string; gst_rate_bp: number }[];
  subtotal_paise: number;
  coupon_code?: string;
  coupon_discount_paise: number;
  prepaid_discount_paise: number;
  shipping_paise: number;
  cod_fee_paise: number;
  tax_paise: number;
  total_paise: number;
  error?: string;
}

export function calculateCartPricing(
  items: CartItem[],
  productsMap: Map<string, Product>,
  settings: SiteSettings,
  coupon?: Coupon | null,
  paymentMethod: 'prepaid' | 'cod' = 'prepaid'
): PricingResult {
  let subtotal_paise = 0;
  const lines: PricingResult['lines'] = [];

  for (const item of items) {
    const product = productsMap.get(item.slug);
    if (!product || product.status !== 'active') {
      return { lines: [], subtotal_paise: 0, coupon_discount_paise: 0, prepaid_discount_paise: 0, shipping_paise: 0, cod_fee_paise: 0, tax_paise: 0, total_paise: 0, error: `Product not found or inactive: ${item.slug}` };
    }
    const qty = Math.max(1, Math.min(10, item.qty));

    // Check bundle stock availability if bundle
    if (product.type === 'bundle' && product.bundle_items) {
      for (const bi of product.bundle_items) {
        const book = productsMap.get(bi.book_slug);
        const requiredQty = bi.qty * qty;
        if (!book || book.stock_qty < requiredQty) {
          return { lines: [], subtotal_paise: 0, coupon_discount_paise: 0, prepaid_discount_paise: 0, shipping_paise: 0, cod_fee_paise: 0, tax_paise: 0, total_paise: 0, error: `Bundle ${product.title} is sold out or has insufficient stock for ${book?.title || bi.book_slug}` };
        }
      }
    } else if (product.type === 'book') {
      if (product.stock_qty < qty) {
        return { lines: [], subtotal_paise: 0, coupon_discount_paise: 0, prepaid_discount_paise: 0, shipping_paise: 0, cod_fee_paise: 0, tax_paise: 0, total_paise: 0, error: `Insufficient stock for ${product.title}. Only ${product.stock_qty} left.` };
      }
    }

    const unit_price_paise = product.price_paise;
    const line_total_paise = unit_price_paise * qty;
    subtotal_paise += line_total_paise;

    lines.push({
      product_slug: product.slug,
      title: product.title,
      type: product.type,
      qty,
      unit_price_paise,
      line_total_paise,
      hsn: product.hsn_code,
      gst_rate_bp: product.gst_rate_bp,
    });
  }

  // 3. Coupon
  let coupon_discount_paise = 0;
  let appliedCouponCode: string | undefined = undefined;
  if (coupon && coupon.is_active) {
    // Check min subtotal
    if (subtotal_paise >= coupon.min_subtotal_paise) {
      // Check applies_to
      const matchesMethod = coupon.applies_to === 'any' || coupon.applies_to === paymentMethod;
      if (matchesMethod) {
        if (coupon.kind === 'percent') {
          coupon_discount_paise = Math.round((subtotal_paise * coupon.value) / 100);
        } else {
          coupon_discount_paise = coupon.value;
        }
        if (coupon.max_discount_paise && coupon_discount_paise > coupon.max_discount_paise) {
          coupon_discount_paise = coupon.max_discount_paise;
        }
        if (coupon_discount_paise > subtotal_paise) {
          coupon_discount_paise = subtotal_paise;
        }
        appliedCouponCode = coupon.code;
      }
    }
  }

  const afterCouponSubtotal = subtotal_paise - coupon_discount_paise;

  // 4. Prepaid discount
  let prepaid_discount_paise = 0;
  if (paymentMethod === 'prepaid') {
    const canStack = settings.stack_prepaid_with_coupon || !appliedCouponCode;
    if (canStack) {
      prepaid_discount_paise = Math.round((afterCouponSubtotal * settings.prepaid_discount_percent) / 100);
    }
  }

  const afterDiscounts = afterCouponSubtotal - prepaid_discount_paise;

  // 5. Shipping
  let shipping_paise = settings.flat_shipping_paise;
  if (settings.free_shipping_threshold_paise === 0 || afterDiscounts >= settings.free_shipping_threshold_paise) {
    shipping_paise = 0;
  }

  // 6. COD fee
  let cod_fee_paise = 0;
  if (paymentMethod === 'cod') {
    if (!settings.cod_enabled) {
      return { lines: [], subtotal_paise: 0, coupon_discount_paise: 0, prepaid_discount_paise: 0, shipping_paise: 0, cod_fee_paise: 0, tax_paise: 0, total_paise: 0, error: 'Cash on Delivery is currently disabled.' };
    }
    const tentativeTotal = afterDiscounts + shipping_paise + settings.cod_fee_paise;
    if (settings.cod_max_total_paise > 0 && tentativeTotal > settings.cod_max_total_paise) {
      return { lines: [], subtotal_paise: 0, coupon_discount_paise: 0, prepaid_discount_paise: 0, shipping_paise: 0, cod_fee_paise: 0, tax_paise: 0, total_paise: 0, error: `COD not available for orders above Rs. ${settings.cod_max_total_paise / 100}` };
    }
    cod_fee_paise = settings.cod_fee_paise;
  }

  // 7. Tax (prices include tax: tax_paise = line_total * rate_pct / (100 + rate_pct))
  let tax_paise = 0;
  for (const line of lines) {
    const ratePct = line.gst_rate_bp / 100; // e.g. 0 bp = 0%, or 500 bp = 5%
    if (ratePct > 0) {
      const lineTax = Math.round((line.line_total_paise * ratePct) / (100 + ratePct));
      tax_paise += lineTax;
    }
  }

  // 8. Total
  const total_paise = subtotal_paise - coupon_discount_paise - prepaid_discount_paise + shipping_paise + cod_fee_paise;

  return {
    lines,
    subtotal_paise,
    coupon_code: appliedCouponCode,
    coupon_discount_paise,
    prepaid_discount_paise,
    shipping_paise,
    cod_fee_paise,
    tax_paise,
    total_paise: Math.max(0, total_paise),
  };
}
