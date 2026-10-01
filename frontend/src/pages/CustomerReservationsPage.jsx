import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Bookmark, Calendar, Clock, MapPin } from 'lucide-react';

const CustomerReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await API.get('/reservations');
      setReservations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h3 className="font-heading fw-bold mb-1">My Shop Reservations</h3>
      <p className="text-muted small mb-4">Mobiles you have held for in-person shop inspection</p>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
      ) : reservations.length === 0 ? (
        <div className="bg-white p-5 text-center rounded-4 border">
          <Bookmark size={48} className="text-muted mb-3 opacity-50" />
          <h4 className="font-heading text-dark mb-2">No Active Reservations</h4>
          <p className="text-secondary small mb-4">When you reserve a phone from our catalog, your visit schedule will show here!</p>
        </div>
      ) : (
        <div className="row g-4">
          {reservations.map(res => (
            <div key={res.id} className="col-12">
              <div className="card border-0 rounded-4 shadow-sm p-4 bg-white">
                <div className="row align-items-center g-3">
                  <div className="col-md-4">
                    <h5 className="font-heading fw-bold mb-1">{res.product?.brand} {res.product?.modelName}</h5>
                    <p className="text-secondary small mb-1">{res.product?.storage} | ₹{res.product?.sellingPrice?.toLocaleString()}</p>
                    <span className="badge bg-warning text-dark font-semibold">Status: {res.status}</span>
                  </div>

                  <div className="col-md-4 border-start-md">
                    <div className="d-flex align-items-center gap-2 text-dark font-semibold small mb-1">
                      <Calendar size={16} className="text-primary" /> Reserved Visit Date: {res.visitDate}
                    </div>
                    <div className="d-flex align-items-center gap-2 text-muted small">
                      <Clock size={16} className="text-warning" /> Time Slot: {res.visitTime || 'Anytime'}
                    </div>
                  </div>

                  <div className="col-md-4 border-start-md">
                    <div className="small text-secondary mb-1">📍 Shop Location:</div>
                    <div className="fw-semibold text-dark small">Shop #12, Tech Bazaar Main Road</div>
                    <div className="text-muted small mt-1">Contact: +91 98765 43210</div>
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

export default CustomerReservationsPage;
