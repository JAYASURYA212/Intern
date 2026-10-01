import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Users, Shield, Trash2 } from 'lucide-react';

const AdminPanelPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert("Failed to delete user.");
    }
  };

  return (
    <div className="container py-4">
      <h3 className="font-heading fw-bold mb-1 d-flex align-items-center gap-2">
        <Shield className="text-danger" size={26} /> Admin Platform Moderation
      </h3>
      <p className="text-muted small mb-4">Manage registered accounts & platform settings</p>

      <div className="bg-white rounded-4 border shadow-sm p-3">
        <h5 className="font-heading fw-bold p-2 mb-0">Registered Platform Users ({users.length})</h5>
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle small mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td className="fw-bold">{u.fullName}</td>
                    <td>{u.email}</td>
                    <td>{u.phone}</td>
                    <td><span className="badge bg-primary-subtle text-primary">{u.role}</span></td>
                    <td>
                      <button className="btn btn-outline-danger btn-sm p-1" onClick={() => handleDeleteUser(u.id)} title="Delete User">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanelPage;
