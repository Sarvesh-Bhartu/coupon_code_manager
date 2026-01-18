import { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Register = () => {
    const { discount } = useParams();
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const offerDetails = {
        'service-10': '10% Off on Service Charges',
        'service-20': '20% Off on Service Charges',
        'basic-30': '30% Off on Basic Servicing',
        'basic-40': '40% Off on Basic Servicing',
        'basic-50': '50% Off on Basic Servicing',
        'bill-10': '10% Off on Overall Bill',
        'voucher-1000': '₹1000 Voucher',
        'full-free': 'Full Servicing Free',
        'half-free': 'Half Servicing Free'
    };

    const validDiscounts = Object.keys(offerDetails);

    if (!validDiscounts.includes(discount)) {
        return <div className="container text-center text-white mt-10"><h1>Invalid Offer Link</h1></div>;
    }

    const { name, phoneNumber, email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            const API_URL = import.meta.env.VITE_API_URL;
            const res = await axios.post(`${API_URL}/api/auth/register`, {
                name,
                phoneNumber,
                email,
                password,
                discount
            });
            login(res.data); // Login context
            navigate('/coupon');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{
                        fontSize: '2rem',
                        margin: 0,
                        background: 'linear-gradient(to right, #fff, #aaa)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: '800'
                    }}>
                        Claim Your Offer
                    </h2>
                    <h3 style={{ textAlign: 'center', color: 'var(--color-purple)', marginTop: '0.5rem', marginBottom: '1rem' }}>
                        {offerDetails[discount]}
                    </h3>
                    <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
                        Register to generate your unique coupon
                    </p>
                </div>

                {error && <div style={{ color: 'var(--color-pink)', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

                <form onSubmit={onSubmit}>
                    <div className="input-group">
                        <label>Full Name</label>
                        <input type="text" name="name" value={name} onChange={onChange} required placeholder="Ex: Sarvesh" />
                    </div>
                    <div className="input-group">
                        <label>Phone Number</label>
                        <input type="tel" name="phoneNumber" value={phoneNumber} onChange={onChange} required placeholder="Ex: 9876543210" pattern="[0-9]{10}" title="Ten digits code" />
                    </div>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input type="email" name="email" value={email} onChange={onChange} required placeholder="Ex: user@example.com" />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" name="password" value={password} onChange={onChange} required placeholder="********" />
                    </div>

                    <button type="submit" className="btn" style={{ marginTop: '2rem', marginBottom: '1rem' }}>
                        Get My Coupon
                    </button>

                    <p style={{ textAlign: 'center', marginTop: '2rem', color: '#666', fontSize: '0.9rem' }}>
                        Already registered? <span style={{ color: 'var(--color-blue)', cursor: 'pointer', transition: 'color 0.3s' }} className="login-footer-link" onClick={() => navigate('/login')}>Login here</span>
                    </p>
                </form>
                <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #eee', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>Need Help? Contact Admin</p>
                    <p style={{ margin: '0.2rem 0 0 0', fontWeight: '800', color: '#fff', fontSize: '1rem' }}>Aniket Dabholkar - +91 7718820048</p>
                </div>
            </div>
        </div>
    );
};

export default Register;
