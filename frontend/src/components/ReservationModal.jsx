import React, { useState } from 'react';
import API from '../services/api';
import { Calendar, Clock, Bookmark, X } from 'lucide-react';

const ReservationModal = ({ product, show, onClose, onSuccess }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [visitTime, setVisitTime] = useState('05:00 PM');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!show || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !visitDate) {
      setError("Please fill in your name, phone number, and visit date.");
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await API.post('/reservations', {
        productId: product.id,
        customerName,
        customerPhone,
        visitDate,
        visitTime,
        message,
      });
      setSubmitting(false);
      onSuccess(`Success! ${product.brand} ${product.modelName} has been reserved for your shop visit on ${visitDate}.`);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reserve product. It might be already reserved.");
      setSubmitting(false);
    }
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1" style={{ zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 shadow-lg border-0">
          <div className="modal-header border-bottom bg-light rounded-top-4">
            <h5 className="modal-title font-heading d-flex align-items-center gap-2">
              <Bookmark className="text-warning" size={20} /> Reserve {product.brand} {product.modelName}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {error && <div className="alert alert-danger py-2">{error}</div>}

              <div className="alert alert-info py-2 small mb-3">
                🛡️ Reserving holds this device exclusively for you so you can inspect it in-person at our shop!
              </div>

              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label font-semibold text-sm">Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label font-semibold text-sm">Mobile Phone Number *</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="e.g. 9876543210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label font-semibold text-sm">Preferred Visit Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={visitDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setVisitDate(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label font-semibold text-sm">Preferred Time</label>
                  <select className="form-select" value={visitTime} onChange={(e) => setVisitTime(e.target.value)}>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                    <option value="07:00 PM">07:00 PM</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label font-semibold text-sm">Notes / Special Requests (Optional)</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="Any message for the shop owner"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="modal-footer bg-light border-top rounded-bottom-4">
              <button type="button" className="btn btn-outline-secondary rounded-3" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-warning font-semibold text-dark rounded-3 px-4" disabled={submitting}>
                {submitting ? "Reserving..." : "Confirm Reservation"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;
