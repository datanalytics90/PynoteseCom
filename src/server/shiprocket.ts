import dotenv from 'dotenv';
dotenv.config();

const EMAIL = process.env.SHIPROCKET_EMAIL;
const PASSWORD = process.env.SHIPROCKET_PASSWORD;
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

export async function getShiprocketToken(): Promise<string | null> {
  if (!EMAIL || !PASSWORD) return null;
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  try {
    const res = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: EMAIL, password: PASSWORD })
    });
    if (!res.ok) return null;
    const data = await res.json() as { token?: string };
    if (data.token) {
      cachedToken = data.token;
      tokenExpiresAt = Date.now() + 24 * 3600 * 1000; // 24 hours
      return cachedToken;
    }
  } catch (err) {
    console.error('Shiprocket login error:', err);
  }
  return null;
}

export async function createShiprocketOrder(order: any, settings: any): Promise<{ shiprocket_order_id?: string; shipment_id?: string; error?: string }> {
  const token = await getShiprocketToken();
  if (!token) {
    return { error: 'Shiprocket not configured or login failed' };
  }

  try {
    const payload = {
      order_id: order.order_no,
      order_date: new Date(order.placed_at).toISOString().slice(0, 19).replace('T', ' '),
      pickup_location: settings.shiprocket_pickup_location || 'Primary',
      channel_id: '',
      comment: 'PyNotes Order',
      billing_customer_name: order.ship_name,
      billing_last_name: '',
      billing_address: order.ship_line1,
      billing_address_2: order.ship_line2 || '',
      billing_city: order.ship_city,
      billing_pincode: order.ship_pincode,
      billing_state: order.ship_state,
      billing_country: 'India',
      billing_email: order.email,
      billing_phone: order.ship_phone,
      shipping_is_billing: true,
      shipping_customer_name: order.ship_name,
      shipping_last_name: '',
      shipping_address: order.ship_line1,
      shipping_address_2: order.ship_line2 || '',
      shipping_city: order.ship_city,
      shipping_pincode: order.ship_pincode,
      shipping_state: order.ship_state,
      shipping_country: 'India',
      shipping_email: order.email,
      shipping_phone: order.ship_phone,
      order_items: order.items.map((i: any) => ({
        name: i.title,
        sku: i.sku,
        units: i.qty,
        selling_price: i.unit_price_paise / 100,
        discount: 0,
        tax: 0,
        hsn: i.hsn_code || '4901'
      })),
      payment_method: order.payment_method === 'cod' ? 'COD' : 'Prepaid',
      sub_total: order.subtotal_paise / 100,
      length: 25,
      breadth: 19,
      height: 3,
      weight: (settings.default_weight_g || 450) / 1000
    };

    const res = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json() as any;
    if (res.ok && data.order_id) {
      return {
        shiprocket_order_id: String(data.order_id),
        shipment_id: String(data.shipment_id || '')
      };
    } else {
      return { error: data.message || JSON.stringify(data) };
    }
  } catch (err: any) {
    return { error: err.message || 'Shiprocket API request failed' };
  }
}
