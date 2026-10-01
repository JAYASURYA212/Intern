import React, { useState } from 'react';
import API from '../services/api';
import { MessageSquare, Send, X } from 'lucide-react';

const EnquiryModal = ({ product, show, onClose, onSuccess }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [message, setMessage] = useState('Is this phone available? Is the price negotiable? Can I visit the shop today?');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!show || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Please enter your message/question.");
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await API.post('/enquiries', {
        productId: product.id,
        customerName,
        customerPhone,
        message,
      });
      setSubmitting(false);
      onSuccess("Your enquiry has been sent to the shop owner! We will respond shortly.");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send enquiry. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1" style={{ zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 shadow-lg border-0">
          <div className="modal-header border-bottom bg-light rounded-top-4">
            <h5 className="modal-title font-heading d-flex align-items-center gap-2">
              <MessageSquare className="text-primary" size={20} /> Enquiry for {product.brand} {product.modelName}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {error && <div className="alert alert-danger py-2">{error}</div>}

              <div className="p-3 bg-light rounded-3 mb-3 d-flex align-items-center justify-content-between">
                <div>
                  <div className="fw-bold">{product.brand} {product.modelName} ({product.storage})</div>
                  <div className="text-primary fw-bold">₹{product.sellingPrice?.toLocaleString()}</div>
                </div>
                <span className="badge bg-success-subtle text-success">{product.overallCondition?.replace('_', ' ')}</span>
              </div>

              <div className="mb-3">
                <label className="form-label font-semibold text-sm">Your Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label font-semibold text-sm">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Enter phone number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label font-semibold text-sm">Your Question / Message</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>
            </div>

            <div className="modal-footer bg-light border-top rounded-bottom-4">
              <button type="button" className="btn btn-outline-secondary rounded-3" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary-custom d-flex align-items-center gap-2" disabled={submitting}>
                <Send size={16} /> {submitting ? "Sending..." : "Send Enquiry"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnquiryModal;
