import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Sparkles, Clock, CheckCircle2, XCircle, Tag, ArrowRight, ShieldCheck } from 'lucide-react';

const SellRequestStatusPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await API.get('/sell-requests');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOfferResponse = async (id, accept) => {
    try {
      await API.put(`/sell-requests/${id}/offer-response`, { accept });
      fetchRequests();
    } catch (err) {
      alert("Failed to update offer response.");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUBMITTED':
        return <span className="badge bg-secondary">Submitted & Pending Review</span>;
      case 'UNDER_REVIEW':
        return <span className="badge bg-info text-dark">Under Shop Review</span>;
      case 'MORE_DETAILS_REQUIRED':
        return <span className="badge bg-warning text-dark">Shop Requested More Details</span>;
      case 'OFFER_MADE':
        return <span className="badge bg-primary fs-6">🔥 Offer Received from Shop!</span>;
      case 'CUSTOMER_ACCEPTED':
        return <span className="badge bg-success">Offer Accepted - Bring to Shop for Inspection</span>;
      case 'CUSTOMER_REJECTED':
        return <span className="badge bg-danger">Offer Declined</span>;
      case 'PURCHASED':
        return <span className="badge bg-success font-bold">✓ Phone Purchased by Shop</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="font-heading fw-bold mb-1">My Sell Requests</h3>
          <p className="text-muted small mb-0">Track private evaluations & offers for phones submitted to the shop</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white p-5 text-center rounded-4 border">
          <Sparkles className="text-muted mb-3 opacity-50" size={48} />
          <h4 className="font-heading text-dark mb-2">No Sell Requests Yet</h4>
          <p className="text-secondary small mb-4">Submit your old mobile phone to get an instant evaluation & purchase offer!</p>
        </div>
      ) : (
        <div className="row g-4">
          {requests.map((req) => (
            <div key={req.id} className="col-12">
              <div className="card border-0 rounded-4 shadow-sm p-4 bg-white">
                <div className="row align-items-center g-3">
                  <div className="col-md-3 text-center text-md-start">
                    <span className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>
                      Request #{req.requestNumber}
                    </span>
                    <h5 className="font-heading fw-bold text-dark mb-1">{req.brand} {req.modelName}</h5>
                    <p className="text-secondary small mb-2">{req.storage} | {req.color || 'Standard'} | {req.overallCondition}</p>
                    {getStatusBadge(req.status)}
                  </div>

                  <div className="col-md-3 border-start-md">
                    <div className="text-muted small">Your Expected Price:</div>
                    <div className="fw-bold text-dark fs-5">₹{req.expectedPrice?.toLocaleString()}</div>
                    {req.batteryHealth && <div className="small text-success mt-1">🔋 Battery Health: {req.batteryHealth}</div>}
                  </div>

                  <div className="col-md-3 border-start-md">
                    <div className="text-muted small">Shop Estimated Offer:</div>
                    {req.ownerOfferPrice ? (
                      <div className="fw-bold text-primary display-6">₹{req.ownerOfferPrice?.toLocaleString()}</div>
                    ) : (
                      <span className="text-muted italic small">Awaiting shop review...</span>
                    )}
                    {req.ownerNotes && (
                      <div className="alert alert-light border py-1 px-2 small mt-2 text-dark">
                        💬 <strong>Shop Note:</strong> {req.ownerNotes}
                      </div>
                    )}
                  </div>

                  <div className="col-md-3 text-end">
                    {req.status === 'OFFER_MADE' && (
                      <div className="d-flex flex-column gap-2">
                        <button className="btn btn-success font-semibold py-2 d-flex align-items-center justify-content-center gap-1" onClick={() => handleOfferResponse(req.id, true)}>
                          <CheckCircle2 size={16} /> Accept Offer (₹{req.ownerOfferPrice})
                        </button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleOfferResponse(req.id, false)}>
                          Decline Offer
                        </button>
                      </div>
                    )}

                    {req.status === 'CUSTOMER_ACCEPTED' && (
                      <div className="alert alert-success py-2 px-3 small text-center mb-0">
                        📍 Visit shop with your phone for physical inspection & payment!
                      </div>
                    )}

                    {req.status === 'PURCHASED' && (
                      <div className="alert alert-success py-2 px-3 small text-center mb-0 fw-bold">
                        ✓ Phone Purchased & Added to Shop Inventory!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellRequestStatusPage;
