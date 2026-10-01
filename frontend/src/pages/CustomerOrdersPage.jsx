import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { ShoppingBag, FileText, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h3 className="font-heading fw-bold mb-1">My Purchase Invoices & Warranties</h3>
      <p className="text-muted small mb-4">View your purchase history, shop invoices, and active warranty terms</p>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-5 text-center rounded-4 border">
          <ShoppingBag size={48} className="text-muted mb-3 opacity-50" />
          <h4 className="font-heading text-dark mb-2">No Purchase History Found</h4>
          <p className="text-secondary small mb-4">Phones purchased at our shop will display their digital receipt and warranty here!</p>
          <Link to="/catalog" className="btn btn-primary-custom px-4 rounded-pill">Browse Available Stock</Link>
        </div>
      ) : (
        <div className="row g-4">
          {orders.map((order) => (
            <div key={order.id} className="col-12">
              <div className="card border-0 rounded-4 shadow-sm p-4 bg-white">
                <div className="row align-items-center g-3">
                  <div className="col-md-3">
                    <span className="badge bg-light text-dark font-semibold border mb-1">Invoice #{order.orderNumber}</span>
                    <h5 className="font-heading fw-bold mb-0">{order.product?.brand} {order.product?.modelName}</h5>
                    <p className="text-secondary small mb-0">{order.product?.storage} | {order.product?.color}</p>
                  </div>

                  <div className="col-md-3 border-start-md">
                    <span className="text-muted small">Purchase Amount Paid:</span>
                    <div className="fw-bold text-primary fs-5">₹{order.salePrice?.toLocaleString()}</div>
                    <span className="badge bg-success-subtle text-success mt-1">{order.paymentMethod}</span>
                  </div>

                  <div className="col-md-3 border-start-md">
                    <span className="text-muted small">Shop Warranty Coverage:</span>
                    {order.warrantyEndDate ? (
                      <div className="text-success fw-bold small d-flex align-items-center gap-1 mt-1">
                        <ShieldCheck size={16} /> Valid until {order.warrantyEndDate}
                      </div>
                    ) : (
                      <div className="text-muted small">No Active Warranty</div>
                    )}
                  </div>

                  <div className="col-md-3 text-end">
                    <Link to="/customer/warranty" className="btn btn-outline-warning btn-sm font-semibold">
                      Claim Warranty Support
                    </Link>
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

export default CustomerOrdersPage;
