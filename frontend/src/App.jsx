import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';

import HomePage from './pages/HomePage';
import ProductCatalogPage from './pages/ProductCatalogPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ComparePage from './pages/ComparePage';
import WishlistPage from './pages/WishlistPage';
import SellYourMobilePage from './pages/SellYourMobilePage';
import SellRequestStatusPage from './pages/SellRequestStatusPage';
import CustomerOrdersPage from './pages/CustomerOrdersPage';
import CustomerReservationsPage from './pages/CustomerReservationsPage';
import CustomerWarrantyPage from './pages/CustomerWarrantyPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ShopProfilePage from './pages/ShopProfilePage';

import OwnerDashboardPage from './pages/OwnerDashboardPage';
import OwnerInventoryPage from './pages/OwnerInventoryPage';
import OwnerAddEditProductPage from './pages/OwnerAddEditProductPage';
import OwnerBulkImportPage from './pages/OwnerBulkImportPage';
import OwnerSellRequestsPage from './pages/OwnerSellRequestsPage';
import OwnerEnquiriesPage from './pages/OwnerEnquiriesPage';
import OwnerReservationsPage from './pages/OwnerReservationsPage';
import OwnerOrdersPage from './pages/OwnerOrdersPage';
import OwnerWarrantyPage from './pages/OwnerWarrantyPage';
import OwnerAnalyticsPage from './pages/OwnerAnalyticsPage';
import AdminPanelPage from './pages/AdminPanelPage';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          {/* Customer Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<ProductCatalogPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/sell-your-mobile" element={<SellYourMobilePage />} />
          <Route path="/customer/sell-requests" element={<SellRequestStatusPage />} />
          <Route path="/customer/orders" element={<CustomerOrdersPage />} />
          <Route path="/customer/reservations" element={<CustomerReservationsPage />} />
          <Route path="/customer/warranty" element={<CustomerWarrantyPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/shop-profile" element={<ShopProfilePage />} />

          {/* Shop Owner Portal Routes */}
          <Route path="/owner/dashboard" element={<OwnerDashboardPage />} />
          <Route path="/owner/inventory" element={<OwnerInventoryPage />} />
          <Route path="/owner/products/new" element={<OwnerAddEditProductPage />} />
          <Route path="/owner/products/:id/edit" element={<OwnerAddEditProductPage />} />
          <Route path="/owner/inventory/import" element={<OwnerBulkImportPage />} />
          <Route path="/owner/sell-requests" element={<OwnerSellRequestsPage />} />
          <Route path="/owner/enquiries" element={<OwnerEnquiriesPage />} />
          <Route path="/owner/reservations" element={<OwnerReservationsPage />} />
          <Route path="/owner/orders" element={<OwnerOrdersPage />} />
          <Route path="/owner/warranty" element={<OwnerWarrantyPage />} />
          <Route path="/owner/analytics" element={<OwnerAnalyticsPage />} />
          <Route path="/admin" element={<AdminPanelPage />} />
        </Routes>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

export default App;
