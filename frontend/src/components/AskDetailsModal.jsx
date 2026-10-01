import React, { useState } from 'react';
import API from '../services/api';
import { HelpCircle, Send } from 'lucide-react';

const AskDetailsModal = ({ sellRequest, show, onClose, onSuccess }) => {
  const [message, setMessage] = useState('Please upload a screenshot of battery health, clear photo of the screen, or purchase bill.');
  const [submitting, setSubmitting] = useState(false);

  if (!show || !sellRequest) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post(`/owner/sell-requests/${sellRequest.id}/ask-details`, { message });
      setSubmitting(false);
      onSuccess("Request for additional details sent to customer.");
      onClose();
    } catch (err) {
      alert("Failed to send request.");
      setSubmitting(false);
    }
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1" style={{ zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 shadow-lg border-0">
          <div className="modal-header border-bottom bg-light rounded-top-4">
            <h5 className="modal-title font-heading d-flex align-items-center gap-2 text-warning">
              <HelpCircle size={20} /> Request Additional Details from Customer
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <p className="text-muted small">
                Ask the customer to upload battery health screenshot, back camera photo, original bill copy, etc.
              </p>
              <div className="mb-3">
                <label className="form-label font-semibold text-sm">Message to Customer</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>
            </div>
            <div className="modal-footer bg-light border-top rounded-bottom-4">
              <button type="button" className="btn btn-outline-secondary rounded-3" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-warning font-semibold text-dark rounded-3" disabled={submitting}>
                <Send size={16} /> {submitting ? "Sending..." : "Send Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AskDetailsModal;
