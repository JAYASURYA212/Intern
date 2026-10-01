import React, { useState } from 'react';
import API from '../services/api';
import { ClipboardCheck, Check, X, AlertTriangle } from 'lucide-react';

const checklistItems = [
  'Display & Touch',
  'Front & Back Camera',
  'Speaker & Earpiece',
  'Microphone',
  'Charging Port & Battery Health',
  'Face ID / Fingerprint Scanner',
  'SIM Network & 5G',
  'Wi-Fi & Bluetooth',
  'IMEI 1 & 2 Verification',
  'Physical Body & Frame Condition',
  'Buttons (Power, Volume)',
  'Original Box & Accessories',
  'Liquid Damage Check',
  'Account / iCloud / FRP Unlocked'
];

const InspectionChecklistModal = ({ sellRequest, show, onClose, onSuccess }) => {
  const [checklist, setChecklist] = useState(() => {
    const init = {};
    checklistItems.forEach(item => { init[item] = 'PASS'; });
    return init;
  });
  const [finalPrice, setFinalPrice] = useState(sellRequest?.ownerOfferPrice || sellRequest?.expectedPrice || '');
  const [ownerNotes, setOwnerNotes] = useState('Physical inspection completed successfully at shop.');
  const [submitting, setSubmitting] = useState(false);

  if (!show || !sellRequest) return null;

  const handleStatusChange = (item, status) => {
    setChecklist(prev => ({ ...prev, [item]: status }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post(`/owner/sell-requests/${sellRequest.id}/inspection`, {
        inspectionReportJson: JSON.stringify(checklist),
        finalPrice: Number(finalPrice),
        ownerNotes
      });
      setSubmitting(false);
      onSuccess("Physical inspection checklist saved!");
      onClose();
    } catch (err) {
      alert("Failed to submit inspection report.");
      setSubmitting(false);
    }
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1" style={{ zIndex: 1060 }}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content rounded-4 shadow-lg border-0">
          <div className="modal-header border-bottom bg-light rounded-top-4">
            <h5 className="modal-title font-heading d-flex align-items-center gap-2 text-dark">
              <ClipboardCheck className="text-success" size={22} /> Shop Physical Inspection Checklist (14 Points)
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="alert alert-info py-2 small mb-3">
                Inspect device components in person before completing the purchase from customer.
              </div>

              <div className="row g-2 mb-4">
                {checklistItems.map(item => (
                  <div key={item} className="col-md-6">
                    <div className="p-2 border rounded-3 d-flex justify-content-between align-items-center bg-light">
                      <span className="small font-semibold text-dark">{item}</span>
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className={`btn ${checklist[item] === 'PASS' ? 'btn-success' : 'btn-outline-secondary'}`}
                          onClick={() => handleStatusChange(item, 'PASS')}
                        >
                          PASS
                        </button>
                        <button
                          type="button"
                          className={`btn ${checklist[item] === 'FAIL' ? 'btn-danger' : 'btn-outline-secondary'}`}
                          onClick={() => handleStatusChange(item, 'FAIL')}
                        >
                          FAIL
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="row g-3 border-top pt-3">
                <div className="col-md-6">
                  <label className="form-label font-semibold text-sm">Final Confirmed Purchase Price (₹) *</label>
                  <input
                    type="number"
                    className="form-control form-control-lg fw-bold text-success"
                    value={finalPrice}
                    onChange={(e) => setFinalPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label font-semibold text-sm">Inspection Notes</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={ownerNotes}
                    onChange={(e) => setOwnerNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="modal-footer bg-light border-top rounded-bottom-4">
              <button type="button" className="btn btn-outline-secondary rounded-3" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-success font-semibold text-white rounded-3 px-4" disabled={submitting}>
                {submitting ? "Saving..." : "Save Inspection Checklist"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InspectionChecklistModal;
