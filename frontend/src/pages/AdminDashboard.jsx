import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MarkUsedModal from '../components/MarkUsedModal';
import AuthContext from '../context/AuthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AdminDashboard = () => {
    const { adminId } = useParams();
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterDate, setFilterDate] = useState(null); // Changed to null object for DatePicker

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalMode, setModalMode] = useState('edit'); // 'edit' or 'view'

    useEffect(() => {
        fetchUsers();
    }, [adminId]);

    const fetchUsers = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL;
            let url = `${API_URL}/api/admin/users`;
            if (adminId) {
                url = `${API_URL}/api/admin/${adminId}/users`;
            }
            const res = await axios.get(url);
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            setError('Access Denied or Server Error');
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
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
            const API_URL = import.meta.env.VITE_API_URL;
            let url = `${API_URL}/api/admin/mark/${selectedUser._id}`;
            if (adminId) {
                url = `${API_URL}/api/admin/${adminId}/mark/${selectedUser._id}`;
            }
            await axios.put(url, { comments });
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

    // Filter Logic
    const filteredUsers = filterDate
        ? users.filter(user => {
            const userDate = new Date(user.createdAt).toISOString().split('T')[0];
            // Format filterDate to YYYY-MM-DD manually to match local time if needed, 
            // but simplified ISO string comparison usually works if timezones aren't a huge factor.
            // Better approach for local date comparison:
            const filterDateString = filterDate.toLocaleDateString('en-CA'); // YYYY-MM-DD
            return userDate === filterDateString;
        })
        : users;

    return (
        <div className="login-container" style={{ justifyContent: 'flex-start', paddingTop: '4rem' }}>
            <div className="container" style={{ maxWidth: '1400px', width: '100%', zIndex: 10 }}>
                {/* Admin Header */}
                <div className="admin-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div className="admin-header-left">
                        <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', backdropFilter: 'blur(5px)' }}>
                            <img src="/logo.png" alt="Logo" style={{ height: '32px' }} />
                        </div>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', color: 'white' }}>Drone E Care Admin</h1>
                            <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>Coupon Redemption Portal</p>
                        </div>
                    </div>
                    <div className="admin-header-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ color: '#666', fontSize: '0.8rem', background: 'rgba(0,0,0,0.3)', padding: '0.3rem 0.8rem', borderRadius: '20px' }}>
                            ID: {adminId || 'Logged In'}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="btn-outline"
                            style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', borderColor: 'rgba(255,255,255,0.2)', color: '#ccc', width: 'auto' }}
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Filter Section */}
                {/* Filter Section */}
                <div className="admin-filter-bar">
                    <div className="admin-filter-left">
                        <span style={{ color: '#aaa' }}>Filter by Date:</span>
                        <div style={{ position: 'relative', zIndex: 105 }}> {/* zIndex wrapper */}
                            <DatePicker
                                selected={filterDate}
                                onChange={(date) => setFilterDate(date)}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Select Date"
                                className="custom-datepicker-input"
                                isClearable
                            />
                        </div>
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                        Total Entries: <span style={{ color: 'var(--color-light-purple)' }}>{filteredUsers.length}</span>
                    </div>
                </div>

                <div className="admin-table-wrapper" style={{
                    background: 'rgba(18, 18, 18, 0.4)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                }}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#aaa' }}>USER</th>
                                <th style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#aaa' }}>PHONE</th>
                                <th style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#aaa' }}>CITY</th>
                                <th style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#aaa' }}>EMAIL</th>
                                <th style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#aaa' }}>COUPON CODE</th>
                                <th style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#aaa' }}>EXPIRES ON</th>
                                <th style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#aaa' }}>DISCOUNT</th>
                                <th style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#aaa' }}>STATUS</th>
                                <th style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#aaa' }}>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user._id} style={{ transition: 'background 0.2s' }} className="hover:bg-white/5">
                                    <td style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{user.name}</td>
                                    <td style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#aaa' }}>{user.phoneNumber || '-'}</td>
                                    <td style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#aaa' }}>{user.city || '-'}</td>
                                    <td style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#888' }}>{user.email}</td>
                                    <td style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: 'monospace', fontSize: '1.1rem', color: 'var(--color-light-purple)' }}>{user.couponCode}</td>
                                    <td style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#666', fontSize: '0.9rem' }}>
                                        {new Date(user.expiresAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        {
                                            {
                                                'service-10': '10% Off on Service Charges',
                                                'service-20': '20% Off on Service Charges',
                                                'basic-30': '30% Off on Basic Servicing',
                                                'basic-40': '40% Off on Basic Servicing',
                                                'basic-50': '50% Off on Basic Servicing',
                                                'bill-10': '10% Off on Overall Bill',
                                                'voucher-1000': '₹1000 Voucher',
                                                'full-free': 'Full Servicing Free',
                                                'half-free': 'Half Servicing Free'
                                            }[user.discount] || user.discount
                                        }
                                    </td>
                                    <td style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <span style={{
                                            color: user.status === 'used' ? '#f87171' : '#4ade80',
                                            fontWeight: 'bold',
                                            background: user.status === 'used' ? 'rgba(220, 38, 38, 0.1)' : 'rgba(22, 163, 74, 0.1)',
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '4px',
                                            fontSize: '0.8rem'
                                        }}>
                                            {user.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        {user.status === 'unused' ? (
                                            <button
                                                onClick={() => openModal(user, 'edit')}
                                                className="btn-admin-mark"
                                                style={{ boxShadow: 'none' }}
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
        </div>
    );
};

export default AdminDashboard;
