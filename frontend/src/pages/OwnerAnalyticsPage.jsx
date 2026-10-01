import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { TrendingUp, AlertTriangle, Sparkles, Clock } from 'lucide-react';

const OwnerAnalyticsPage = () => {
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
      <h3 className="font-heading fw-bold mb-1 d-flex align-items-center gap-2">
        <TrendingUp className="text-primary" size={26} /> Shop Demand & Inventory Analytics
      </h3>
      <p className="text-muted small mb-4">Track high-demand customer search models & identify slow-moving stock</p>

      <div className="row g-4 mb-4">
        {/* Slow Moving Stock (> 30 days old) */}
        <div className="col-12">
          <div className="bg-white p-4 rounded-4 border shadow-sm">
            <h5 className="font-heading fw-bold mb-3 text-warning d-flex align-items-center gap-2">
              <AlertTriangle size={20} /> Slow-Moving Stock Alerts (Listed &gt; 30 Days)
            </h5>
            {analytics?.slowMovingStock?.length === 0 ? (
              <p className="text-muted small mb-0">No slow moving stock! All phones are selling quickly.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle small mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Phone Model</th>
                      <th>Storage</th>
                      <th>Current Price</th>
                      <th>Days Listed</th>
                      <th>Suggested Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics?.slowMovingStock?.map(p => (
                      <tr key={p.id}>
                        <td className="fw-bold">{p.brand} {p.modelName}</td>
                        <td>{p.storage}</td>
                        <td>₹{p.sellingPrice?.toLocaleString()}</td>
                        <td><span className="badge bg-warning text-dark">{p.daysListed} days</span></td>
                        <td>
                          <span className="text-danger fw-semibold">⚠ Reduce price or mark as Today's Deal</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Search Demand */}
        <div className="col-md-6">
          <div className="bg-white p-4 rounded-4 border shadow-sm h-100">
            <h5 className="font-heading fw-bold mb-3 d-flex align-items-center gap-2 text-success">
              <Sparkles size={20} /> Most Searched Models by Customers
            </h5>
            <div className="table-responsive">
              <table className="table align-middle small mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Keyword</th>
                    <th>Total Customer Searches</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics?.highDemandSearches?.map((s, idx) => (
                    <tr key={idx}>
                      <td className="fw-bold">"{s.queryKeyword}"</td>
                      <td><span className="badge bg-success-subtle text-success">{s.searchCount} searches</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Most Viewed Stock */}
        <div className="col-md-6">
          <div className="bg-white p-4 rounded-4 border shadow-sm h-100">
            <h5 className="font-heading fw-bold mb-3 d-flex align-items-center gap-2 text-primary">
              <Clock size={20} /> Most Popular Listings
            </h5>
            <div className="table-responsive">
              <table className="table align-middle small mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Model</th>
                    <th>Price</th>
                    <th>Page Views</th>
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
      </div>
    </div>
  );
};

export default OwnerAnalyticsPage;
