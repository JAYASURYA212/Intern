import React, { useState, useEffect } from 'react';
import API from '../services/api';
import OfferModal from '../components/OfferModal';
import AskDetailsModal from '../components/AskDetailsModal';
import InspectionChecklistModal from '../components/InspectionChecklistModal';
import { Sparkles, HelpCircle, Tag, ClipboardCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OwnerSellRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedOfferReq, setSelectedOfferReq] = useState(null);
  const [selectedAskReq, setSelectedAskReq] = useState(null);
  const [selectedInspectionReq, setSelectedInspectionReq] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await API.get('/owner/sell-requests');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConvertToInventory = async (reqId) => {
    if (!window.confirm("Convert this purchased phone into a new inventory stock draft?")) return;
    try {
      const res = await API.post(`/owner/sell-requests/${reqId}/convert-to-inventory`);
      alert("Successfully converted to inventory draft! Redirecting to complete product details...");
      navigate(`/owner/products/${res.data.id}/edit`);
    } catch (err) {
      alert("Failed to convert to inventory.");
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="font-heading fw-bold mb-1">Customer Sell Requests</h3>
          <p className="text-muted small mb-0">Evaluate customer submitted phones, make offers, perform inspection & purchase</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
      ) : requests.length === 0 ? (
        <div className="bg-white p-5 text-center rounded-4 border">
          <Sparkles className="text-muted mb-3 opacity-50" size={48} />
          <h4 className="font-heading text-dark mb-2">No Sell Requests Submitted</h4>
          <p className="text-secondary small">Customer trade-in requests will appear here privately for shop evaluation.</p>
        </div>
      ) : (
        <div className="row g-4">
          {requests.map((req) => (
            <div key={req.id} className="col-12">
              <div className="card border-0 rounded-4 shadow-sm p-4 bg-white">
                <div className="row align-items-center g-3">
                  <div className="col-md-3">
                    <span className="badge bg-light text-dark border mb-1">Request #{req.requestNumber}</span>
                    <h5 className="font-heading fw-bold mb-1">{req.brand} {req.modelName}</h5>
                    <p className="text-secondary small mb-1">{req.storage} | {req.color} | {req.overallCondition}</p>
                    <span className="badge bg-primary-subtle text-primary fw-bold">{req.status}</span>
                  </div>

                  <div className="col-md-3 border-start-md">
                    <div className="text-muted small">Customer Expected Price:</div>
                    <div className="fw-bold text-dark fs-5">₹{req.expectedPrice?.toLocaleString()}</div>
                    <div className="small text-success mt-1">🔋 Battery Health: {req.batteryHealth || 'N/A'}</div>
                    <div className="small text-muted mt-1">Submitted by: {req.user?.fullName} ({req.user?.phone})</div>
                  </div>

                  <div className="col-md-3 border-start-md">
                    <div className="text-muted small">Shop Offer / Final Price:</div>
                    {req.finalPrice ? (
                      <div className="fw-bold text-success display-6">₹{req.finalPrice?.toLocaleString()}</div>
                    ) : req.ownerOfferPrice ? (
                      <div className="fw-bold text-primary fs-5">₹{req.ownerOfferPrice?.toLocaleString()}</div>
                    ) : (
                      <span className="text-muted italic small">No offer made yet</span>
                    )}
                    {req.ownerNotes && <div className="small text-muted mt-1">Note: {req.ownerNotes}</div>}
                  </div>

                  <div className="col-md-3 text-end d-flex flex-column gap-2">
                    <button className="btn btn-outline-warning btn-sm font-semibold d-flex align-items-center justify-content-center gap-1" onClick={() => setSelectedAskReq(req)}>
                      <HelpCircle size={14} /> Ask Details
                    </button>

                    <button className="btn btn-primary-custom btn-sm font-semibold d-flex align-items-center justify-content-center gap-1" onClick={() => setSelectedOfferReq(req)}>
                      <Tag size={14} /> Make Offer
                    </button>

                    <button className="btn btn-outline-success btn-sm font-semibold d-flex align-items-center justify-content-center gap-1" onClick={() => setSelectedInspectionReq(req)}>
                      <ClipboardCheck size={14} /> 14-Point Inspection
                    </button>

                    <button
                      className="btn btn-success btn-sm font-bold d-flex align-items-center justify-content-center gap-1 shadow-sm mt-1"
                      onClick={() => handleConvertToInventory(req.id)}
                    >
                      <CheckCircle2 size={14} /> Convert To Inventory Draft
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <OfferModal
        sellRequest={selectedOfferReq}
        show={Boolean(selectedOfferReq)}
        onClose={() => setSelectedOfferReq(null)}
        onSuccess={() => fetchRequests()}
      />

      <AskDetailsModal
        sellRequest={selectedAskReq}
        show={Boolean(selectedAskReq)}
        onClose={() => setSelectedAskReq(null)}
        onSuccess={() => fetchRequests()}
      />

      <InspectionChecklistModal
        sellRequest={selectedInspectionReq}
        show={Boolean(selectedInspectionReq)}
        onClose={() => setSelectedInspectionReq(null)}
        onSuccess={() => fetchRequests()}
      />
    </div>
  );
};

export default OwnerSellRequestsPage;
