import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

export const Invoice: React.FC = () => {
  const { no } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('t');
  const [invoiceData, setInvoiceData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/invoice/${no}?t=${token || ''}`)
      .then(res => res.json())
      .then(data => setInvoiceData(data))
      .catch(err => console.error(err));
  }, [no, token]);

  if (!invoiceData) return <div className="text-center py-20 font-bold">Loading invoice...</div>;

  const { order, settings } = invoiceData;

  return (
    <div className="max-w-3xl mx-auto px-8 py-12 bg-white my-10 rounded-3xl border border-[#e7edf2] shadow-xl space-y-8 font-sans">
      <div className="flex justify-between items-start border-b border-[#e7edf2] pb-6">
        <div>
          <h1 className="text-2xl font-black text-[#092f55] font-nunito">{settings.legal_name || 'PyNotes'}</h1>
          <p className="text-xs text-[#526d81] mt-1">{settings.store_address}</p>
          <p className="text-xs text-[#526d81]">GSTIN: {settings.gstin || '29AABCP1234F1Z5'}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-extrabold text-[#12A5B0]">TAX INVOICE</h2>
          <p className="text-xs font-bold text-[#092f55] mt-1">Invoice No: {order.invoice_no || 'PENDING'}</p>
          <p className="text-xs text-[#526d81]">Order ID: #{order.order_no}</p>
          <p className="text-xs text-[#526d81]">Date: {new Date(order.placed_at).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 text-xs bg-[#f6f9fc] p-6 rounded-2xl">
        <div>
          <h4 className="font-bold text-[#092f55] mb-1">Billed To:</h4>
          <p className="font-bold">{order.ship_name}</p>
          <p>{order.ship_line1}, {order.ship_line2}</p>
          <p>{order.ship_city}, {order.ship_state} - {order.ship_pincode}</p>
          <p>Phone: {order.ship_phone}</p>
        </div>
      </div>

      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-[#092f55] text-[#092f55]">
            <th className="py-3">Item Description</th>
            <th className="py-3">HSN</th>
            <th className="py-3 text-center">Qty</th>
            <th className="py-3 text-right">Price</th>
            <th className="py-3 text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e7edf2]">
          {order.items.map((i: any, idx: number) => (
            <tr key={idx}>
              <td className="py-3 font-bold">{i.title}</td>
              <td className="py-3">{i.hsn_code || '4901'}</td>
              <td className="py-3 text-center">{i.qty}</td>
              <td className="py-3 text-right">₹{i.unit_price_paise / 100}</td>
              <td className="py-3 text-right font-bold">₹{i.line_total_paise / 100}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end pt-4 border-t border-[#e7edf2]">
        <div className="w-64 space-y-2 text-xs">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{order.subtotal_paise / 100}</span>
          </div>
          {order.coupon_discount_paise > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Coupon Discount</span>
              <span>-₹{order.coupon_discount_paise / 100}</span>
            </div>
          )}
          {order.prepaid_discount_paise > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Prepaid Discount</span>
              <span>-₹{order.prepaid_discount_paise / 100}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>₹{order.shipping_paise / 100}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-[#092f55] font-black text-sm text-[#092f55]">
            <span>Grand Total</span>
            <span>₹{order.total_paise / 100}</span>
          </div>
        </div>
      </div>

      <div className="text-center pt-8 border-t border-[#e7edf2] text-xs text-[#708596]">
        This is a computer-generated invoice. Thank you for learning with PyNotes!
      </div>
    </div>
  );
};
