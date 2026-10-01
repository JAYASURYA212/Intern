import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Bookmark, Calendar, CheckCircle2, XCircle } from 'lucide-react';

const OwnerReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await API.get('/owner/reservations');
      setReservations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/owner/reservations/${id}/status`, { status });
      fetchReservations();
    } catch (err) {
      alert("Failed to update reservation status.");
    }
  };

  return (
    <div className="container py-4">
      <h3 className="font-heading fw-bold mb-1">Customer Shop Visit Reservations</h3>
      <p className="text-muted small mb-4">Manage reserved phone holds and confirmed customer shop visit appointments</p>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
      ) : reservations.length === 0 ? (
        <div className="bg-white p-5 text-center rounded-4 border">
          <Bookmark size={48} className="text-muted mb-3 opacity-50" />
          <h4 className="font-heading text-dark">No Customer Reservations</h4>
        </div>
      ) : (
        <div className="row g-4">
          {reservations.map(res => (
            <div key={res.id} className="col-12">
              <div className="card border-0 rounded-4 shadow-sm p-4 bg-white">
                <div className="row align-items-center g-3">
                  <div className="col-md-3">
                    <span className="badge bg-warning text-dark mb-1">Status: {res.status}</span>
                    <h5 className="font-heading fw-bold mb-1">{res.product?.brand} {res.product?.modelName}</h5>
                    <p className="text-secondary small mb-0">{res.product?.storage} | ₹{res.product?.sellingPrice?.toLocaleString()}</p>
                  </div>

                  <div className="col-md-3 border-start-md">
                    <div className="text-muted small">Customer Name & Contact:</div>
                    <div className="fw-bold text-dark">{res.customerName}</div>
                    <div className="text-primary small">{res.customerPhone}</div>
                  </div>

                  <div className="col-md-3 border-start-md">
                    <div className="text-muted small">Visit Schedule:</div>
                    <div className="fw-bold text-dark d-flex align-items-center gap-1">
                      <Calendar size={16} className="text-primary" /> {res.visitDate} ({res.visitTime || 'Anytime'})
                    </div>
                  </div>

                  <div className="col-md-3 text-end d-flex flex-column gap-2">
                    <button className="btn btn-success btn-sm font-semibold" onClick={() => handleStatusChange(res.id, 'CONFIRMED')}>
                      Confirm Reservation
                    </button>
                    <button className="btn btn-primary btn-sm font-semibold" onClick={() => handleStatusChange(res.id, 'COMPLETED')}>
                      Mark Purchase Completed (SOLD)
                    </button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleStatusChange(res.id, 'CANCELLED')}>
                      Cancel Reservation
                    </button>
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

export default OwnerReservationsPage;
