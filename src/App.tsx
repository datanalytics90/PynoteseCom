import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CookieBanner } from './components/CookieBanner';
import { AnnouncementBar } from './components/AnnouncementBar';

import { Home } from './pages/Home';
import { Subjects } from './pages/Subjects';
import { SubjectDetail } from './pages/SubjectDetail';
import { ProductDetail } from './pages/ProductDetail';
import { Bundles } from './pages/Bundles';
import { CartPage } from './pages/CartPage';
import { Checkout } from './pages/Checkout';
import { ThankYou } from './pages/ThankYou';
import { Invoice } from './pages/Invoice';
import { TrackOrder } from './pages/TrackOrder';
import { Account } from './pages/Account';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Faq } from './pages/Faq';
import { PolicyPage } from './pages/PolicyPage';
import { NotFound } from './pages/NotFound';

import { AdminLayout } from './admin/AdminLayout';
import { DashboardAdmin } from './admin/DashboardAdmin';
import { OrdersAdmin } from './admin/OrdersAdmin';
import { ProductsAdmin } from './admin/ProductsAdmin';
import { ContentAdmin } from './admin/ContentAdmin';
import { SystemCheckAdmin } from './admin/SystemCheckAdmin';
import { AdminSetup } from './admin/AdminSetup';

export default function App() {
  const [catalog, setCatalog] = useState<any>({ subjects: [], products: [], settings: {}, faqs: [], reviews: [] });
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  useEffect(() => {
    fetch('/api/catalog')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data && typeof data === 'object') {
          setCatalog(data);
        }
        setLoadingCatalog(false);
      })
      .catch(err => {
        console.error('Failed to load catalog:', err);
        setLoadingCatalog(false);
      });
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-[#f6f9fc] text-[#102943]">
            <AnnouncementBar messages={catalog.settings?.announcement_messages} />
            <Header subjects={catalog.subjects} products={catalog.products} settings={catalog.settings} />
            
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home catalog={catalog} />} />
                <Route path="/subjects" element={<Subjects catalog={catalog} />} />
                <Route path="/subjects/:slug" element={<SubjectDetail catalog={catalog} />} />
                <Route path="/product/:slug" element={<ProductDetail catalog={catalog} />} />
                <Route path="/bundles" element={<Bundles catalog={catalog} />} />
                <Route path="/cart" element={<CartPage catalog={catalog} />} />
                <Route path="/checkout" element={<Checkout catalog={catalog} />} />
                <Route path="/order/:no/thank-you" element={<ThankYou />} />
                <Route path="/invoice/:no" element={<Invoice />} />
                <Route path="/track" element={<TrackOrder />} />
                <Route path="/account" element={<Account />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<Faq catalog={catalog} />} />
                <Route path="/policies/:slug" element={<PolicyPage />} />

                {/* Admin Setup */}
                <Route path="/admin/setup" element={<AdminSetup />} />

                {/* Admin Area */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<DashboardAdmin />} />
                  <Route path="dashboard" element={<DashboardAdmin />} />
                  <Route path="orders" element={<OrdersAdmin />} />
                  <Route path="products" element={<ProductsAdmin />} />
                  <Route path="settings" element={<ContentAdmin />} />
                  <Route path="system-check" element={<SystemCheckAdmin />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            <Footer settings={catalog.settings} />
            <CartDrawer products={catalog.products} />
            <CookieBanner settings={catalog.settings} />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
