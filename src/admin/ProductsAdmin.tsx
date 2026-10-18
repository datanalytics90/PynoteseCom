import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Package, Plus, Edit, RefreshCw, AlertTriangle, Layers,
  CheckCircle, ArrowUpRight, ArrowDownRight, Search, BookOpen, History
} from 'lucide-react';

export const ProductsAdmin: React.FC = () => {
  const { getIdToken } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [ledger, setLedger] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [tab, setTab] = useState<'books' | 'bundles' | 'ledger'>('books');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Stock adjust modal state
  const [stockModal, setStockModal] = useState<{ open: boolean; product: any; delta: number; reason: string; note: string }>({
    open: false,
    product: null,
    delta: 10,
    reason: 'restock',
    note: ''
  });

  // Edit / Add product modal state
  const [editModal, setEditModal] = useState<{ open: boolean; product: any }>({
    open: false,
    product: null
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const token = await getIdToken();
      const headers = { Authorization: `Bearer ${token}` };

      const [pRes, lRes, sRes] = await Promise.all([
        fetch('/api/admin/products', { headers }),
        fetch('/api/admin/ledger', { headers }),
        fetch('/api/admin/subjects', { headers })
      ]);

      if (pRes.ok) {
        const pData = await pRes.json();
        setProducts(Array.isArray(pData) ? pData : []);
      }
      if (lRes.ok) {
        const lData = await lRes.json();
        setLedger(Array.isArray(lData) ? lData : []);
      }
      if (sRes.ok) {
        const sData = await sRes.json();
        setSubjects(Array.isArray(sData) ? sData : []);
      }
    } catch (err) {
      console.error('Failed to load admin products data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStockAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockModal.product) return;
    try {
      const token = await getIdToken();
      const res = await fetch(`/api/admin/products/${stockModal.product.slug}/stock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          delta: stockModal.delta,
          reason: stockModal.reason,
          note: stockModal.note
        })
      });

      if (res.ok) {
        setStockModal({ open: false, product: null, delta: 10, reason: 'restock', note: '' });
        loadData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to adjust stock');
      }
    } catch (err) {
      console.error(err);
      alert('Stock adjustment error');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const p = editModal.product;
    if (!p) return;

    try {
      const token = await getIdToken();
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...p,
          price_paise: Math.round(Number(p.price_inr || (p.price_paise ? p.price_paise / 100 : 0)) * 100),
          mrp_paise: Math.round(Number(p.mrp_inr || (p.mrp_paise ? p.mrp_paise / 100 : 0)) * 100),
          stock_qty: Number(p.stock_qty || 0),
          pages: Number(p.pages || 0),
          weight_grams: Number(p.weight_grams || 250)
        })
      });

      if (res.ok) {
        setEditModal({ open: false, product: null });
        loadData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save product');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving product');
    }
  };

  const books = products.filter(p => p.type === 'book');
  const bundles = products.filter(p => p.type === 'bundle');

  const filteredBooks = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.slug.toLowerCase().includes(search.toLowerCase())
  );

  const filteredBundles = bundles.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#092f55] font-nunito">Products & Stock</h1>
          <p className="text-xs text-[#526d81] mt-1">Manage individual handwritten books, combo bundles, and live inventory ledger.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditModal({
                open: true,
                product: {
                  type: 'book',
                  title: '',
                  subtitle: 'Complete Handwritten Notes for College & Placement Prep',
                  slug: '',
                  subject_slug: subjects[0]?.slug || 'python',
                  price_inr: 499,
                  mrp_inr: 799,
                  stock_qty: 50,
                  low_stock_threshold: 5,
                  pages: 180,
                  weight_grams: 280,
                  badge: 'New Edition',
                  color: '#13a5bd',
                  description: 'Comprehensive handwritten guide covering foundational syntax, real-world examples, and interview questions.',
                  status: 'active'
                }
              });
            }}
            className="px-4 py-2.5 bg-[#12A5B0] text-white rounded-xl font-bold text-xs hover:bg-[#0f8fa5] transition-colors flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" /> Add New Book
          </button>
          <button
            onClick={() => {
              setEditModal({
                open: true,
                product: {
                  type: 'bundle',
                  title: '',
                  slug: '',
                  price_inr: 899,
                  mrp_inr: 1598,
                  badge: 'Combo Saver',
                  description: 'High-value bundle package combining complete printed handwritten study guides.',
                  bundle_items: [
                    { book_slug: 'c', qty: 1 },
                    { book_slug: 'c-plus-plus', qty: 1 }
                  ],
                  status: 'active'
                }
              });
            }}
            className="px-4 py-2.5 bg-[#092f55] text-white rounded-xl font-bold text-xs hover:bg-[#071E38] transition-colors flex items-center gap-2 shadow-xs"
          >
            <Layers className="w-4 h-4" /> Add Bundle
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#e7edf2]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab('books')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              tab === 'books' ? 'bg-[#092f55] text-white shadow-xs' : 'text-[#526d81] hover:bg-slate-100'
            }`}
          >
            Books ({books.length})
          </button>
          <button
            onClick={() => setTab('bundles')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              tab === 'bundles' ? 'bg-[#092f55] text-white shadow-xs' : 'text-[#526d81] hover:bg-slate-100'
            }`}
          >
            Bundles ({bundles.length})
          </button>
          <button
            onClick={() => setTab('ledger')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              tab === 'ledger' ? 'bg-[#092f55] text-white shadow-xs' : 'text-[#526d81] hover:bg-slate-100'
            }`}
          >
            Stock Audit Ledger ({ledger.length})
          </button>
        </div>

        {tab !== 'ledger' && (
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs focus:outline-none focus:border-[#12A5B0]"
            />
          </div>
        )}
      </div>

      {/* Books Table */}
      {tab === 'books' && (
        <div className="bg-white rounded-3xl border border-[#e7edf2] overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f6f9fc] border-b border-[#e7edf2] text-[#092f55]">
                <th className="py-4 px-6 font-bold">Book / Subject</th>
                <th className="py-4 px-6 font-bold">Price / MRP</th>
                <th className="py-4 px-6 font-bold">Stock</th>
                <th className="py-4 px-6 font-bold">Pages</th>
                <th className="py-4 px-6 font-bold">Status</th>
                <th className="py-4 px-6 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e7edf2]">
              {filteredBooks.map(b => {
                const stock = b.stock_qty || 0;
                const isLow = stock <= (b.low_stock_threshold || 5) && stock > 0;
                const isOut = stock === 0;

                return (
                  <tr key={b.slug} className="hover:bg-[#f6f9fc]/50">
                    <td className="py-4 px-6">
                      <div className="font-extrabold text-[#092f55] flex items-center gap-2">
                        <div
                          className="w-3.5 h-3.5 rounded-full"
                          style={{ backgroundColor: b.color || '#13a5bd' }}
                        />
                        {b.title}
                      </div>
                      <div className="text-[11px] text-[#526d81] mt-0.5">slug: /{b.slug}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-black text-[#092f55]">₹{b.price_paise ? b.price_paise / 100 : 0}</span>
                      <span className="text-slate-400 line-through ml-2 text-[11px]">₹{b.mrp_paise ? b.mrp_paise / 100 : 0}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-[11px] ${
                        isOut ? 'bg-red-100 text-red-700' : isLow ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {stock} copies
                        {isLow && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-600">{b.pages || 180} pp</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        b.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => setStockModal({ open: true, product: b, delta: 10, reason: 'restock', note: '' })}
                        className="px-3 py-1.5 bg-[#f6f9fc] hover:bg-slate-200 text-[#092f55] border border-[#e7edf2] font-bold rounded-xl text-[11px] transition-colors"
                      >
                        Adjust Stock
                      </button>
                      <button
                        onClick={() => setEditModal({
                          open: true,
                          product: {
                            ...b,
                            price_inr: b.price_paise ? b.price_paise / 100 : 0,
                            mrp_inr: b.mrp_paise ? b.mrp_paise / 100 : 0
                          }
                        })}
                        className="px-3 py-1.5 bg-[#12A5B0] hover:bg-[#0f8fa5] text-white font-bold rounded-xl text-[11px] transition-colors"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Bundles Table */}
      {tab === 'bundles' && (
        <div className="bg-white rounded-3xl border border-[#e7edf2] overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f6f9fc] border-b border-[#e7edf2] text-[#092f55]">
                <th className="py-4 px-6 font-bold">Bundle Package</th>
                <th className="py-4 px-6 font-bold">Included Books</th>
                <th className="py-4 px-6 font-bold">Bundle Price / MRP</th>
                <th className="py-4 px-6 font-bold">Availability</th>
                <th className="py-4 px-6 font-bold">Status</th>
                <th className="py-4 px-6 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e7edf2]">
              {filteredBundles.map(bundle => (
                <tr key={bundle.slug} className="hover:bg-[#f6f9fc]/50">
                  <td className="py-4 px-6">
                    <div className="font-extrabold text-[#092f55]">{bundle.title}</div>
                    <div className="text-[11px] text-[#526d81] mt-0.5">slug: /{bundle.slug}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1">
                      {bundle.bundle_items?.map((item: any, idx: number) => (
                        <span key={idx} className="bg-slate-100 text-[#092f55] px-2 py-0.5 rounded-md text-[10px] font-bold">
                          {item.book_slug} (×{item.qty})
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-black text-[#092f55]">₹{bundle.price_paise ? bundle.price_paise / 100 : 0}</span>
                    <span className="text-slate-400 line-through ml-2 text-[11px]">₹{bundle.mrp_paise ? bundle.mrp_paise / 100 : 0}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-[11px] text-[#526d81] italic">Derived dynamically from component books</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                      bundle.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {bundle.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setEditModal({
                        open: true,
                        product: {
                          ...bundle,
                          price_inr: bundle.price_paise ? bundle.price_paise / 100 : 0,
                          mrp_inr: bundle.mrp_paise ? bundle.mrp_paise / 100 : 0
                        }
                      })}
                      className="px-3 py-1.5 bg-[#12A5B0] hover:bg-[#0f8fa5] text-white font-bold rounded-xl text-[11px] transition-colors"
                    >
                      Edit Bundle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Stock Audit Ledger */}
      {tab === 'ledger' && (
        <div className="bg-white rounded-3xl border border-[#e7edf2] overflow-hidden shadow-xs space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#092f55] flex items-center gap-2">
              <History className="w-4 h-4 text-[#12A5B0]" /> Complete Real-Time Inventory Ledger
            </h3>
            <button
              onClick={loadData}
              className="text-xs text-[#12A5B0] hover:underline font-bold flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f6f9fc] border-b border-[#e7edf2] text-[#092f55]">
                  <th className="py-3 px-4 font-bold">Date & Time</th>
                  <th className="py-3 px-4 font-bold">Book Slug</th>
                  <th className="py-3 px-4 font-bold">Change</th>
                  <th className="py-3 px-4 font-bold">Reason</th>
                  <th className="py-3 px-4 font-bold">Actor</th>
                  <th className="py-3 px-4 font-bold">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7edf2]">
                {ledger.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">No stock movements recorded yet.</td>
                  </tr>
                ) : (
                  ledger.map((entry, idx) => (
                    <tr key={idx} className="hover:bg-[#f6f9fc]/50">
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {new Date(entry.at).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#092f55]">{entry.book_id}</td>
                      <td className="py-3 px-4 font-black">
                        <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] ${
                          entry.delta > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {entry.delta > 0 ? `+${entry.delta}` : entry.delta}
                        </span>
                      </td>
                      <td className="py-3 px-4 uppercase text-[10px] font-bold tracking-wider text-slate-600">
                        {entry.reason}
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-[11px]">{entry.actor || 'system'}</td>
                      <td className="py-3 px-4 text-slate-500 text-[11px] italic">{entry.note || entry.order_id || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {stockModal.open && stockModal.product && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#e7edf2] shadow-2xl space-y-6">
            <h3 className="font-nunito font-black text-xl text-[#092f55]">
              Adjust Stock: {stockModal.product.title}
            </h3>

            <div className="p-3 bg-[#f6f9fc] rounded-xl text-xs text-[#526d81] flex justify-between">
              <span>Current In-Stock:</span>
              <span className="font-extrabold text-[#092f55]">{stockModal.product.stock_qty || 0} copies</span>
            </div>

            <form onSubmit={handleStockAdjustment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#092f55] mb-1">Stock Change Amount</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    required
                    value={stockModal.delta}
                    onChange={e => setStockModal({ ...stockModal, delta: parseInt(e.target.value, 10) || 0 })}
                    placeholder="e.g. 20 (or -5 for damage)"
                    className="w-full px-4 py-2.5 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs focus:outline-none focus:border-[#12A5B0]"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Use positive numbers to add stock, negative to subtract.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#092f55] mb-1">Reason for Adjustment</label>
                <select
                  value={stockModal.reason}
                  onChange={e => setStockModal({ ...stockModal, reason: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs font-bold text-[#092f55]"
                >
                  <option value="restock">New Print Run / Supplier Restock</option>
                  <option value="correction">Inventory Physical Count Correction</option>
                  <option value="damage">Damaged in Storage / Discarded</option>
                  <option value="promotional">Promotional Copy / Sampling</option>
                  <option value="return_restock">Customer Return Restock</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#092f55] mb-1">Note (Optional)</label>
                <input
                  type="text"
                  value={stockModal.note}
                  onChange={e => setStockModal({ ...stockModal, note: e.target.value })}
                  placeholder="e.g. Batch #4 arrived from printer"
                  className="w-full px-4 py-2.5 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStockModal({ open: false, product: null, delta: 10, reason: 'restock', note: '' })}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#092f55] font-bold text-xs rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-[#12A5B0] hover:bg-[#0f8fa5] text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
                >
                  Save Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit / Add Product Modal */}
      {editModal.open && editModal.product && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-[#e7edf2] shadow-2xl space-y-6 my-8">
            <h3 className="font-nunito font-black text-xl text-[#092f55]">
              {editModal.product.slug ? `Edit: ${editModal.product.title}` : `Create New ${editModal.product.type === 'bundle' ? 'Bundle' : 'Book'}`}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#092f55] mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={editModal.product.title || ''}
                    onChange={e => setEditModal({
                      ...editModal,
                      product: {
                        ...editModal.product,
                        title: e.target.value,
                        slug: editModal.product.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                      }
                    })}
                    placeholder="e.g. Python Handwritten Notes"
                    className="w-full px-4 py-2.5 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#092f55] mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    required
                    value={editModal.product.slug || ''}
                    onChange={e => setEditModal({
                      ...editModal,
                      product: { ...editModal.product, slug: e.target.value.toLowerCase() }
                    })}
                    placeholder="e.g. python"
                    className="w-full px-4 py-2.5 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#092f55] mb-1">Sale Price (INR)</label>
                  <input
                    type="number"
                    required
                    value={editModal.product.price_inr ?? 499}
                    onChange={e => setEditModal({
                      ...editModal,
                      product: { ...editModal.product, price_inr: e.target.value }
                    })}
                    className="w-full px-4 py-2.5 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs font-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#092f55] mb-1">MRP (INR)</label>
                  <input
                    type="number"
                    required
                    value={editModal.product.mrp_inr ?? 799}
                    onChange={e => setEditModal({
                      ...editModal,
                      product: { ...editModal.product, mrp_inr: e.target.value }
                    })}
                    className="w-full px-4 py-2.5 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs"
                  />
                </div>

                {editModal.product.type === 'book' ? (
                  <div>
                    <label className="block text-xs font-bold text-[#092f55] mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      required
                      value={editModal.product.stock_qty ?? 50}
                      onChange={e => setEditModal({
                        ...editModal,
                        product: { ...editModal.product, stock_qty: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs font-bold"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-[#092f55] mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={editModal.product.badge || 'Combo Saver'}
                      onChange={e => setEditModal({
                        ...editModal,
                        product: { ...editModal.product, badge: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs"
                    />
                  </div>
                )}
              </div>

              {editModal.product.type === 'book' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#092f55] mb-1">Subject</label>
                    <select
                      value={editModal.product.subject_slug || ''}
                      onChange={e => setEditModal({
                        ...editModal,
                        product: { ...editModal.product, subject_slug: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs font-bold"
                    >
                      {subjects.map(s => (
                        <option key={s.slug} value={s.slug}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#092f55] mb-1">Page Count</label>
                    <input
                      type="number"
                      value={editModal.product.pages || 180}
                      onChange={e => setEditModal({
                        ...editModal,
                        product: { ...editModal.product, pages: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#092f55] mb-1">Theme Color</label>
                    <input
                      type="color"
                      value={editModal.product.color || '#13a5bd'}
                      onChange={e => setEditModal({
                        ...editModal,
                        product: { ...editModal.product, color: e.target.value }
                      })}
                      className="w-full h-10 p-1 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl cursor-pointer"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#092f55] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editModal.product.description || ''}
                  onChange={e => setEditModal({
                    ...editModal,
                    product: { ...editModal.product, description: e.target.value }
                  })}
                  className="w-full px-4 py-2 bg-[#f6f9fc] border border-[#e7edf2] rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editModal.product.status === 'active'}
                    onChange={e => setEditModal({
                      ...editModal,
                      product: { ...editModal.product, status: e.target.checked ? 'active' : 'draft' }
                    })}
                    className="rounded text-[#12A5B0] focus:ring-0"
                  />
                  <span className="text-xs font-bold text-[#092f55]">Active in Storefront</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#e7edf2]">
                <button
                  type="button"
                  onClick={() => setEditModal({ open: false, product: null })}
                  className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-[#092f55] font-bold text-xs rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-[#12A5B0] hover:bg-[#0f8fa5] text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
