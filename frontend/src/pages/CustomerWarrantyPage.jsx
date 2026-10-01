import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { ShieldCheck, AlertTriangle, Send } from 'lucide-react';

const CustomerWarrantyPage = () => {
  const [claims, setClaims] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [issueTitle, setIssueTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cRes, oRes] = await Promise.all([
        API.get('/warranty/claims'),
        API.get('/orders')
      ]);
      setClaims(cRes.data);
      setOrders(oRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProductId || !issueTitle || !description) {
      alert("Please select a phone and describe the issue.");
      return;
    }
    setSubmitting(true);
    try {
      await API.post('/warranty/claims', {
        productId: Number(selectedProductId),
        issueTitle,
        description
      });
      setSubmitting(false);
      setMsg("Warranty claim submitted successfully! Shop owner has been notified.");
      setIssueTitle('');
      setDescription('');
      fetchData();
    } catch (err) {
      alert("Failed to submit claim.");
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <h3 className="font-heading fw-bold mb-1 d-flex align-items-center gap-2">
        <ShieldCheck className="text-success" size={26} /> Shop Warranty Support & Claims
      </h3>
      <p className="text-muted small mb-4">Submit a warranty claim for any mobile purchased from MobileMart</p>

      {msg && <div className="alert alert-success">{msg}</div>}

      <div className="row g-4">
        {/* Submit Claim Form */}
        <div className="col-lg-5">
          <div className="bg-white p-4 rounded-4 border shadow-sm">
            <h5 className="font-heading fw-bold mb-3">Raise a Warranty Claim</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label font-semibold text-sm">Select Purchased Phone *</label>
                <select className="form-select" value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} required>
                  <option value="">-- Choose Phone --</option>
                  {orders.map(o => (
                    <option key={o.id} value={o.product?.id}>
                      {o.product?.brand} {o.product?.modelName} (Invoice #{o.orderNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label font-semibold text-sm">Issue Title *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Battery drain, Speaker noise, Display flicker"
                  value={issueTitle}
                  onChange={(e) => setIssueTitle(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label font-semibold text-sm">Detailed Problem Description *</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Explain when the issue started and what is happening..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary-custom w-100 py-2.5 font-semibold" disabled={submitting}>
                <Send size={16} className="me-1" /> {submitting ? "Submitting..." : "Submit Warranty Claim"}
              </button>
            </form>
          </div>
        </div>

        {/* Existing Claims View */}
        <div className="col-lg-7">
          <div className="bg-white p-4 rounded-4 border shadow-sm">
            <h5 className="font-heading fw-bold mb-3">My Submitted Claims</h5>
            {claims.length === 0 ? (
              <p className="text-muted text-center py-4">No warranty claims submitted.</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {claims.map(claim => (
                  <div key={claim.id} className="p-3 border rounded-3 bg-light">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <h6 className="font-heading fw-bold text-dark mb-0">{claim.issueTitle}</h6>
                      <span className="badge bg-primary">{claim.status}</span>
                    </div>
                    <div className="small text-secondary mb-2">Device: {claim.product?.brand} {claim.product?.modelName}</div>
                    <p className="small text-dark mb-2">{claim.description}</p>
                    {claim.adminNotes && (
                      <div className="alert alert-info py-1 px-2 small mb-0">
                        💬 <strong>Shop Response:</strong> {claim.adminNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerWarrantyPage;
