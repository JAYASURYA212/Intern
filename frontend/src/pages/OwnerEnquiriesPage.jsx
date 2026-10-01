import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { MessageSquare, Send } from 'lucide-react';

const OwnerEnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await API.get('/owner/enquiries');
      setEnquiries(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (id) => {
    const text = replyText[id];
    if (!text || !text.trim()) return;
    try {
      await API.put(`/owner/enquiries/${id}/reply`, { replyMessage: text });
      alert("Reply sent to customer!");
      fetchEnquiries();
    } catch (err) {
      alert("Failed to send reply.");
    }
  };

  return (
    <div className="container py-4">
      <h3 className="font-heading fw-bold mb-1">Customer Enquiries</h3>
      <p className="text-muted small mb-4">Respond to customer availability & price questions</p>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
      ) : enquiries.length === 0 ? (
        <div className="bg-white p-5 text-center rounded-4 border">
          <MessageSquare size={48} className="text-muted mb-3 opacity-50" />
          <h4 className="font-heading text-dark">No Enquiries Received</h4>
        </div>
      ) : (
        <div className="row g-4">
          {enquiries.map(enq => (
            <div key={enq.id} className="col-12">
              <div className="card border-0 rounded-4 shadow-sm p-4 bg-white">
                <div className="row align-items-center g-3">
                  <div className="col-md-4">
                    <span className="badge bg-light text-dark mb-1">Status: {enq.status}</span>
                    <h5 className="font-heading fw-bold mb-1">{enq.product?.brand} {enq.product?.modelName}</h5>
                    <p className="text-secondary small mb-1">Customer: {enq.customerName} ({enq.customerPhone})</p>
                  </div>

                  <div className="col-md-4 border-start-md">
                    <div className="text-muted small font-semibold">Customer Question:</div>
                    <div className="p-2 bg-light rounded text-dark small mt-1">"{enq.message}"</div>
                  </div>

                  <div className="col-md-4 border-start-md">
                    {enq.replyMessage ? (
                      <div>
                        <div className="text-muted small font-semibold">Your Reply:</div>
                        <div className="p-2 bg-success-subtle text-success rounded small mt-1">{enq.replyMessage}</div>
                      </div>
                    ) : (
                      <div className="d-flex gap-2">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Type reply..."
                          value={replyText[enq.id] || ''}
                          onChange={(e) => setReplyText({ ...replyText, [enq.id]: e.target.value })}
                        />
                        <button className="btn btn-primary-custom btn-sm text-nowrap" onClick={() => handleReplySubmit(enq.id)}>
                          <Send size={14} /> Reply
                        </button>
                      </div>
                    )}
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

export default OwnerEnquiriesPage;
