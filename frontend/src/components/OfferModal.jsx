import React, { useState } from 'react';
import API from '../services/api';
import { DollarSign, Tag, CheckCircle } from 'lucide-react';

const OfferModal = ({ sellRequest, show, onClose, onSuccess }) => {
  const [offerPrice, setOfferPrice] = useState(sellRequest?.ownerOfferPrice || sellRequest?.expectedPrice || '');
  const [ownerNotes, setOwnerNotes] = useState('Offer estimated based on provided specs and condition photos.');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!show || !sellRequest) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!offerPrice || Number(offerPrice) <= 0) {
      setError("Please enter a valid offer price.");
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await API.post(`/owner/sell-requests/${sellRequest.id}/offer`, {
        offerPrice: Number(offerPrice),
        ownerNotes,
      });
      setSubmitting(false);
      onSuccess(`Estimated offer of ₹${offerPrice} submitted to customer.`);
      onClose();
    } catch (err) {
      setError("Failed to send offer. " + (err.response?.data?.message || ""));
      setSubmitting(false);
    }
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1" style={{ zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 shadow-lg border-0">
          <div className="modal-header border-bottom bg-light rounded-top-4">
            <h5 className="modal-title font-heading d-flex align-items-center gap-2 text-primary">
              <Tag size={20} /> Submit Estimated Offer to Customer
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {error && <div className="alert alert-danger py-2">{error}</div>}

              <div className="bg-light p-3 rounded-3 mb-3">
                <div className="text-muted small">Customer Expected Price:</div>
                <div className="fs-5 font-heading text-dark fw-bold">₹{sellRequest.expectedPrice?.toLocaleString()}</div>
                <div className="small text-secondary mt-1">{sellRequest.brand} {sellRequest.modelName} ({sellRequest.storage}) • {sellRequest.overallCondition}</div>
              </div>

              <div className="mb-3">
                <label className="form-label font-semibold text-sm">Shop Offer Price (₹) *</label>
                <input
                  type="number"
                  className="form-control form-control-lg fw-bold text-primary"
                  placeholder="Enter offer price"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label font-semibold text-sm">Note / Message to Customer</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={ownerNotes}
                  onChange={(e) => setOwnerNotes(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="modal-footer bg-light border-top rounded-bottom-4">
              <button type="button" className="btn btn-outline-secondary rounded-3" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary-custom d-flex align-items-center gap-2" disabled={submitting}>
                <CheckCircle size={16} /> {submitting ? "Sending..." : "Send Offer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OfferModal;
