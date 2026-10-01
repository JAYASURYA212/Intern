import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { LayoutDashboard, Layers, Sparkles, MessageSquare, Bookmark, ShieldCheck, DollarSign, TrendingUp, PlusCircle, UploadCloud, AlertCircle } from 'lucide-react';

const OwnerDashboardPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await API.get('/owner/analytics');
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>;

  return (
    <div className="container py-4">
      {/* Header & Quick Action Buttons */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h3 className="font-heading fw-bold mb-1">Shop Owner Portal & Analytics</h3>
          <p className="text-muted small mb-0">Overview of inventory, customer sell requests, enquiries, reservations & sales</p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <Link to="/owner/products/new" className="btn btn-primary-custom btn-sm font-semibold d-flex align-items-center gap-1 shadow-sm">
            <PlusCircle size={16} /> Add Single Mobile
          </Link>
          <Link to="/owner/inventory/import" className="btn btn-outline-primary btn-sm font-semibold d-flex align-items-center gap-1">
            <UploadCloud size={16} /> Bulk Stock Import (CSV)
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card border-0 rounded-4 p-3 bg-white shadow-sm border-start border-primary border-4">
            <div className="text-muted small font-semibold">Available Stock</div>
            <div className="display-6 font-heading fw-bold text-primary">{analytics?.availableStockCount || 0}</div>
            <Link to="/owner/inventory" className="text-primary small fw-semibold text-decoration-none mt-1 d-block">Manage Stock →</Link>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card border-0 rounded-4 p-3 bg-white shadow-sm border-start border-warning border-4">
            <div className="text-muted small font-semibold">Customer Sell Requests</div>
            <div className="display-6 font-heading fw-bold text-warning">{analytics?.sellRequestsCount || 0}</div>
            <Link to="/owner/sell-requests" className="text-warning small fw-semibold text-decoration-none mt-1 d-block">Review Requests →</Link>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card border-0 rounded-4 p-3 bg-white shadow-sm border-start border-info border-4">
            <div className="text-muted small font-semibold">Pending Reservations</div>
            <div className="display-6 font-heading fw-bold text-info">{analytics?.pendingReservationsCount || 0}</div>
            <Link to="/owner/reservations" className="text-info small fw-semibold text-decoration-none mt-1 d-block">View Schedule →</Link>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card border-0 rounded-4 p-3 bg-white shadow-sm border-start border-success border-4">
            <div className="text-muted small font-semibold">Total Sales Volume</div>
            <div className="fs-3 font-heading fw-bold text-success">₹{analytics?.totalSalesVolume?.toLocaleString() || 0}</div>
            <Link to="/owner/orders" className="text-success small fw-semibold text-decoration-none mt-1 d-block">Invoices & Sales →</Link>
          </div>
        </div>
      </div>

      {/* Dashboard Sub-nav tabs */}
      <div className="bg-white p-2 rounded-4 border shadow-sm mb-4 d-flex flex-wrap gap-2">
        <Link to="/owner/inventory" className="btn btn-sm btn-light border font-semibold">📦 Complete Stock</Link>
        <Link to="/owner/sell-requests" className="btn btn-sm btn-light border font-semibold text-warning">✨ Customer Sell Requests</Link>
        <Link to="/owner/enquiries" className="btn btn-sm btn-light border font-semibold">💬 Enquiries</Link>
        <Link to="/owner/reservations" className="btn btn-sm btn-light border font-semibold">📅 Visit Reservations</Link>
        <Link to="/owner/orders" className="btn btn-sm btn-light border font-semibold">🧾 Sales & Invoices</Link>
        <Link to="/owner/warranty" className="btn btn-sm btn-light border font-semibold">🛡️ Warranty Claims</Link>
        <Link to="/owner/analytics" className="btn btn-sm btn-light border font-semibold text-primary">📊 Analytics & Demand</Link>
      </div>

      {/* Analytics Insights Grid */}
      <div className="row g-4">
        {/* Most Viewed Products */}
        <div className="col-md-6">
          <div className="bg-white p-4 rounded-4 border shadow-sm h-100">
            <h5 className="font-heading fw-bold mb-3 d-flex align-items-center gap-2 text-primary">
              <TrendingUp size={20} /> Most Viewed Phones Online
            </h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle small mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Model</th>
                    <th>Price</th>
                    <th>Views</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics?.mostViewedProducts?.map(p => (
                    <tr key={p.id}>
                      <td className="fw-bold">{p.brand} {p.modelName}</td>
                      <td>₹{p.sellingPrice?.toLocaleString()}</td>
                      <td><span className="badge bg-primary-subtle text-primary">{p.viewsCount} views</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* High Customer Demand Search Keywords */}
        <div className="col-md-6">
          <div className="bg-white p-4 rounded-4 border shadow-sm h-100">
            <h5 className="font-heading fw-bold mb-3 d-flex align-items-center gap-2 text-success">
              <Sparkles size={20} /> High Customer Search Demand
            </h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle small mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Search Term</th>
                    <th>Search Count</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics?.highDemandSearches?.map((s, idx) => (
                    <tr key={idx}>
                      <td className="fw-bold text-dark">"{s.queryKeyword}"</td>
                      <td><span className="badge bg-success-subtle text-success">{s.searchCount} searches</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboardPage;
