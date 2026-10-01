import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { Search, Heart, ShoppingBag, User, LogOut, ShieldAlert, Sparkles, Bell, RefreshCw, Smartphone, Layers, LayoutDashboard } from 'lucide-react';
import API from '../services/api';

const Navbar = () => {
  const { user, logout, isOwner } = useAuth();
  const { wishlistProducts } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, location.pathname]);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <nav className="navbar navbar-expand-lg main-navbar py-2 shadow-sm">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2 me-4" to="/">
          <div className="bg-primary text-white p-2 rounded-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
            <Smartphone size={24} />
          </div>
          <div>
            <span className="brand-logo d-block lh-1">MobileMart</span>
            <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>Certified Used Mobile Shop</small>
          </div>
        </Link>

        {/* Global Search Bar */}
        <form className="d-none d-md-flex flex-grow-1 mx-4" style={{ maxWidth: '400px' }} onSubmit={handleSearchSubmit}>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0 rounded-start-pill ps-3">
              <Search size={18} className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control bg-light border-start-0 rounded-end-pill py-2 text-sm"
              placeholder="Search iPhone, Samsung S23, 128GB..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Navigation Items */}
        <div className="d-flex align-items-center gap-3 ms-auto">
          <Link to="/catalog" className="btn btn-sm btn-outline-secondary border-0 text-dark fw-semibold d-none d-lg-inline-flex align-items-center gap-1">
            <Layers size={18} /> Stock Catalog
          </Link>

          <Link to="/sell-your-mobile" className="btn btn-sm btn-primary-custom text-nowrap d-flex align-items-center gap-1 shadow-sm">
            <Sparkles size={16} /> Sell Your Mobile
          </Link>

          <Link to="/compare" className="btn btn-sm btn-outline-secondary border-0 text-dark fw-semibold d-none d-lg-inline-flex align-items-center gap-1" title="Compare Mobiles">
            <RefreshCw size={18} /> Compare
          </Link>

          <Link to="/wishlist" className="btn btn-sm btn-outline-secondary border-0 position-relative p-2" title="Saved Wishlist">
            <Heart size={20} className="text-dark" />
            {wishlistProducts.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                {wishlistProducts.length}
              </span>
            )}
          </Link>

          {/* Notifications Dropdown */}
          {user && (
            <div className="position-relative">
              <button
                className="btn btn-sm btn-outline-secondary border-0 position-relative p-2"
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                title="Notifications"
              >
                <Bell size={20} className="text-dark" />
                {unreadCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary" style={{ fontSize: '0.65rem' }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifDropdown && (
                <div className="position-absolute end-0 mt-2 bg-white shadow-lg rounded-4 p-3 border" style={{ width: '320px', zIndex: 1050 }}>
                  <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                    <span className="fw-bold text-dark">Notifications</span>
                    <span className="badge bg-light text-dark">{unreadCount} new</span>
                  </div>
                  <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <p className="text-muted text-center text-sm my-3">No notifications</p>
                    ) : (
                      notifications.slice(0, 5).map(n => (
                        <div key={n.id} className={`p-2 rounded mb-1 text-sm ${n.isRead ? 'bg-white' : 'bg-light fw-medium'}`}>
                          <div className="fw-semibold text-primary">{n.title}</div>
                          <div className="text-secondary small">{n.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Owner Dashboard Shortcut */}
          {isOwner && (
            <Link to="/owner/dashboard" className="btn btn-sm btn-dark text-nowrap d-none d-md-inline-flex align-items-center gap-1 ms-2">
              <LayoutDashboard size={16} /> Owner Portal
            </Link>
          )}

          {/* User Account / Login */}
          {user ? (
            <div className="dropdown">
              <button className="btn btn-sm btn-outline-light text-dark border-0 dropdown-toggle d-flex align-items-center gap-2" data-bs-toggle="dropdown">
                <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px' }}>
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="d-none d-sm-inline font-semibold">{user.fullName}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3 mt-2">
                <li className="px-3 py-2 border-bottom">
                  <div className="fw-bold">{user.fullName}</div>
                  <div className="small text-muted">{user.email}</div>
                  <span className="badge bg-primary-subtle text-primary mt-1" style={{ fontSize: '0.65rem' }}>
                    {user.role === 'ROLE_SHOP_OWNER' ? 'SHOP OWNER' : user.role === 'ROLE_ADMIN' ? 'ADMIN' : 'CUSTOMER'}
                  </span>
                </li>
                <li><Link className="dropdown-item py-2" to="/customer/sell-requests">My Sell Requests</Link></li>
                <li><Link className="dropdown-item py-2" to="/customer/reservations">My Reservations</Link></li>
                <li><Link className="dropdown-item py-2" to="/customer/orders">My Invoices & Warranty</Link></li>
                {isOwner && <li><hr className="dropdown-divider" /></li>}
                {isOwner && <li><Link className="dropdown-item py-2 text-primary fw-bold" to="/owner/dashboard">Owner Dashboard</Link></li>}
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item py-2 text-danger d-flex align-items-center gap-2" onClick={logout}><LogOut size={16} /> Logout</button></li>
              </ul>
            </div>
          ) : (
            <Link to="/login" className="btn btn-sm btn-outline-primary fw-semibold px-3 rounded-pill">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
