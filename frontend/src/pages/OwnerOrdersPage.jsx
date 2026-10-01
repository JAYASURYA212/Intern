import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { ShoppingBag, Plus, FileText, CheckCircle2 } from 'lucide-react';

const OwnerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // New sale modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const [oRes, pRes] = await Promise.all([
        API.get('/owner/orders'),
        API.get('/products?status=AVAILABLE&size=100')
      ]);
      setOrders(oRes.data);
      setProducts(pRes.data.content);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!selectedProductId || !customerName || !customerPhone) {
      alert("Please select product and customer name/phone.");
      return;
    }
    try {
      await API.post('/owner/orders', {
        productId: Number(selectedProductId),
        customerName,
        customerPhone,
        customerEmail,
        salePrice: salePrice ? Number(salePrice) : null,
        paymentMethod
      });
      alert("Invoice created and phone marked as SOLD!");
      setShowModal(false);
      fetchOrders();
    } catch (err) {
      alert("Failed to record sale.");
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="font-heading fw-bold mb-1">Sales & Invoice Management</h3>
          <p className="text-muted small mb-0">Record sold phones, generate invoices & issue shop warranty terms</p>
        </div>

        <button className="btn btn-primary-custom btn-sm font-semibold d-flex align-items-center gap-1 shadow-sm" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Record New Phone Sale
        </button>
      </div>

      <div className="bg-white rounded-4 border shadow-sm p-3">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle small mb-0">
              <thead className="table-light">
                <tr>
                  <th>Invoice #</th>
                  <th>Customer</th>
                  <th>Phone Sold</th>
                  <th>Sale Price (₹)</th>
                  <th>Payment</th>
                  <th>Warranty Valid Until</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td className="fw-bold text-primary">{o.orderNumber}</td>
                    <td>
                      <div className="fw-bold text-dark">{o.customerName}</div>
                      <small className="text-muted">{o.customerPhone}</small>
                    </td>
                    <td>{o.product?.brand} {o.product?.modelName} ({o.product?.storage})</td>
                    <td className="fw-bold text-success">₹{o.salePrice?.toLocaleString()}</td>
                    <td><span className="badge bg-light text-dark border">{o.paymentMethod}</span></td>
                    <td className="text-success font-semibold">{o.warrantyEndDate || 'No Warranty'}</td>
                    <td className="text-muted">{o.createdAt?.substring(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Sale Modal */}
      {showModal && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 shadow-lg border-0">
              <div className="modal-header border-bottom bg-light rounded-top-4">
                <h5 className="modal-title font-heading fw-bold text-primary">Record In-Store Phone Sale</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreateOrder}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label font-semibold text-sm">Select Available Stock Item *</label>
                    <select className="form-select" value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} required>
                      <option value="">-- Choose Stock Phone --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.brand} {p.modelName} ({p.storage}) - ₹{p.sellingPrice?.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label font-semibold text-sm">Customer Name *</label>
                    <input type="text" className="form-control" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
                  </div>

                  <div className="mb-3">
                    <label className="form-label font-semibold text-sm">Customer Phone *</label>
                    <input type="tel" className="form-control" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required />
                  </div>

                  <div className="mb-3">
                    <label className="form-label font-semibold text-sm">Customer Email (Optional)</label>
                    <input type="email" className="form-control" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
                  </div>

                  <div className="row g-2">
                    <div className="col-md-6">
                      <label className="form-label font-semibold text-sm">Actual Sale Price (₹)</label>
                      <input type="number" className="form-control" placeholder="Selling price" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label font-semibold text-sm">Payment Method</label>
                      <select className="form-select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                        <option value="CASH">CASH</option>
                        <option value="UPI / QR">UPI / QR</option>
                        <option value="CREDIT_CARD">Credit / Debit Card</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light border-top rounded-bottom-4">
                  <button type="button" className="btn btn-outline-secondary rounded-3" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary-custom rounded-3 font-semibold">Generate Invoice & Mark SOLD</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerOrdersPage;
