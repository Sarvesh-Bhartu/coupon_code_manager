import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MarkUsedModal from '../components/MarkUsedModal';

const AdminDashboard = () => {
    const { adminId } = useParams();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalMode, setModalMode] = useState('edit'); // 'edit' or 'view'

    useEffect(() => {
        fetchUsers();
    }, [adminId]);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/admin/${adminId}/users`);
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            setError('Access Denied or Server Error');
            setLoading(false);
        }
    };

    const openModal = (user, mode = 'edit') => {
        setSelectedUser(user);
        setModalMode(mode);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const confirmMarkUsed = async (comments) => {
        if (!selectedUser) return;

        try {
            await axios.put(`http://localhost:5000/api/admin/${adminId}/mark/${selectedUser._id}`, { comments });
            // Update local state
            setUsers(users.map(user =>
                user._id === selectedUser._id ? {
                    ...user,
                    status: 'used',
                    redemptionDate: new Date(),
                    adminComments: comments
                } : user
            ));
            closeModal();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    if (loading) return <div className="text-center mt-10 text-white">Loading...</div>;
    if (error) return <div className="text-center mt-10" style={{ color: 'red' }}><h1>{error}</h1></div>;

    return (
        <div className="container admin-container">
            {/* Admin Header */}
            <div className="admin-header">
                <div className="admin-header-left">
                    <img src="/src/assets/logo.png" alt="Logo" style={{ height: '40px' }} />
                    <div>
                        <h1 className="text-gradient" style={{ margin: 0, fontSize: '1.5rem' }}>Drone E Care Admin</h1>
                        <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>Coupon Redemption Portal</p>
                    </div>
                </div>
                <div className="admin-header-right">
                    <span style={{ color: '#444', fontSize: '0.8rem' }}>ADMIN ID: {adminId}</span>
                </div>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>USER</th>
                            <th>EMAIL</th>
                            <th>COUPON CODE</th>
                            <th>EXPIRES ON</th>
                            <th>DISCOUNT</th>
                            <th>STATUS</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td style={{ fontFamily: 'monospace', fontSize: '1.1rem', color: 'var(--color-purple)' }}>{user.couponCode}</td>
                                <td style={{ color: '#aaa', fontSize: '0.9rem' }}>
                                    {new Date(user.expiresAt).toLocaleDateString()}
                                </td>
                                <td>{user.discount}%</td>
                                <td>
                                    <span style={{
                                        color: user.status === 'used' ? 'red' : 'lime',
                                        fontWeight: 'bold'
                                    }}>
                                        {user.status.toUpperCase()}
                                    </span>
                                </td>
                                <td>
                                    {user.status === 'unused' ? (
                                        <button
                                            onClick={() => openModal(user, 'edit')}
                                            className="btn-admin-mark"
                                        >
                                            Mark Used
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => openModal(user, 'view')}
                                            className="btn-admin-view"
                                        >
                                            View Details
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <MarkUsedModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={confirmMarkUsed}
                user={selectedUser}
                mode={modalMode}
            />
        </div>
    );
};

export default AdminDashboard;
