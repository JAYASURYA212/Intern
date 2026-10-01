import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { MapPin, Phone, MessageSquare, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

const ShopProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get('/shop/profile');
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>;

  return (
    <div className="container py-4">
      <div className="bg-white p-4 p-md-5 rounded-4 border shadow-sm mb-4">
        <div className="row align-items-center g-4">
          <div className="col-md-3 text-center">
            <img
              src={profile?.logoUrl || 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=200'}
              alt={profile?.name}
              className="rounded-circle shadow border p-2"
              style={{ width: '140px', height: '140px', objectFit: 'cover' }}
            />
          </div>
          <div className="col-md-9">
            <h2 className="font-heading fw-bold text-dark mb-2">{profile?.name}</h2>
            <p className="text-secondary mb-3">{profile?.description}</p>
            
            <div className="d-flex flex-wrap gap-3">
              <a href={`tel:${profile?.phone}`} className="btn btn-call btn-sm px-3 py-2 d-inline-flex align-items-center gap-1">
                <Phone size={16} /> Call Shop: {profile?.phone}
              </a>
              <a
                href={`https://wa.me/${profile?.whatsappNumber?.replace('+', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-sm px-3 py-2 d-inline-flex align-items-center gap-1"
              >
                <MessageSquare size={16} /> WhatsApp Shop
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="bg-white p-4 rounded-4 border shadow-sm h-100">
            <h5 className="font-heading fw-bold mb-3 d-flex align-items-center gap-2">
              <MapPin className="text-primary" size={20} /> Shop Location & Hours
            </h5>
            <div className="mb-3">
              <div className="fw-semibold text-dark">Address:</div>
              <div className="text-secondary">{profile?.address}</div>
            </div>
            <div className="mb-3">
              <div className="fw-semibold text-dark">Opening Hours:</div>
              <div className="text-secondary d-flex align-items-center gap-1">
                <Clock size={16} className="text-warning" /> {profile?.openingHours}
              </div>
            </div>
            {profile?.googleMapUrl && (
              <a href={profile.googleMapUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm rounded-pill">
                Open in Google Maps ↗
              </a>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="bg-white p-4 rounded-4 border shadow-sm h-100">
            <h5 className="font-heading fw-bold mb-3 d-flex align-items-center gap-2">
              <ShieldCheck className="text-success" size={20} /> Shop Guarantee & Warranty Policy
            </h5>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2 mb-0">
              <li className="d-flex align-items-start gap-2">
                <CheckCircle2 size={16} className="text-success mt-0.5 flex-shrink-0" />
                <span>Every pre-owned device undergoes a 40-point hardware check before listing.</span>
              </li>
              <li className="d-flex align-items-start gap-2">
                <CheckCircle2 size={16} className="text-success mt-0.5 flex-shrink-0" />
                <span>3 to 6 months shop warranty provided on all eligible models.</span>
              </li>
              <li className="d-flex align-items-start gap-2">
                <CheckCircle2 size={16} className="text-success mt-0.5 flex-shrink-0" />
                <span>In-person physical inspection & testing allowed before purchase.</span>
              </li>
              <li className="d-flex align-items-start gap-2">
                <CheckCircle2 size={16} className="text-success mt-0.5 flex-shrink-0" />
                <span>Instant evaluation & purchase offers for customer trade-ins.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopProfilePage;
