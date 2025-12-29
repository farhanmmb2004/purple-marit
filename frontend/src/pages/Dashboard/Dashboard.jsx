import { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import Spinner from '../../components/Spinner/Spinner';
import { toast } from 'react-toastify';
import './Dashboard.css';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 10,
  });
  const [search, setSearch] = useState('');
  const [filterActive, setFilterActive] = useState('');
  const [modal, setModal] = useState({
    isOpen: false,
    type: '',
    user: null,
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.currentPage, search, filterActive]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.currentPage,
        limit: pagination.limit,
      };

      if (search) params.search = search;
      if (filterActive !== '') params.isActive = filterActive;

      const response = await adminService.getAllUsers(params);
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!modal.user) return;

    setActionLoading(true);
    try {
      if (modal.type === 'activate') {
        await adminService.activateUser(modal.user._id);
        toast.success(`${modal.user.fullName} activated successfully`);
      } else {
        await adminService.deactivateUser(modal.user._id);
        toast.success(`${modal.user.fullName} deactivated successfully`);
      }
      fetchUsers();
      setModal({ isOpen: false, type: '', user: null });
    } catch (error) {
      const message = error.response?.data?.message || 'Action failed';
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  const openModal = (type, user) => {
    setModal({ isOpen: true, type, user });
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: '', user: null });
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleFilterChange = (e) => {
    setFilterActive(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  if (loading && users.length === 0) {
    return <Spinner fullPage />;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>User Management</h1>
        <p>Manage all users and their access</p>
      </div>

      <div className="dashboard-controls">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={handleSearchChange}
          className="search-input"
        />
        <select value={filterActive} onChange={handleFilterChange} className="filter-select">
          <option value="">All Users</option>
          <option value="true">Active Only</option>
          <option value="false">Inactive Only</option>
        </select>
      </div>

      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Full Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.email}</td>
                  <td>{user.fullName}</td>
                  <td>
                    <span className={`badge badge-${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${user.isActive ? 'active' : 'inactive'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      {user.isActive ? (
                        <Button
                          variant="danger"
                          onClick={() => openModal('deactivate', user)}
                          className="btn-sm"
                        >
                          Deactivate
                        </Button>
                      ) : (
                        <Button
                          variant="success"
                          onClick={() => openModal('activate', user)}
                          className="btn-sm"
                        >
                          Activate
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="pagination">
          <Button
            variant="secondary"
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="btn-sm"
          >
            Previous
          </Button>
          <span className="page-info">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <Button
            variant="secondary"
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="btn-sm"
          >
            Next
          </Button>
        </div>
      )}

      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={`${modal.type === 'activate' ? 'Activate' : 'Deactivate'} User`}
        onConfirm={handleAction}
        confirmText={actionLoading ? 'Processing...' : 'Confirm'}
        variant={modal.type === 'activate' ? 'success' : 'danger'}
      >
        <p>
          Are you sure you want to {modal.type} <strong>{modal.user?.fullName}</strong>?
        </p>
        {modal.type === 'deactivate' && (
          <p className="warning-text">
            This user will not be able to log in after deactivation.
          </p>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
