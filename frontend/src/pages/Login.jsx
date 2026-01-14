import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import logo from '../assets/logo.png';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });
            login(res.data);

            if (res.data.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/coupon');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    {/* Glowing Logo Container */}
                    <div style={{
                        position: 'relative',
                        display: 'inline-block',
                        padding: '1rem',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '20px',
                        marginBottom: '1.5rem',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <img src={logo} alt="Flowgenix Logo" style={{ height: '50px', display: 'block' }} />
                    </div>

                    <h2 style={{
                        fontSize: '2.5rem',
                        margin: 0,
                        background: 'linear-gradient(to right, #fff, #aaa)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: '800',
                        letterSpacing: '-1px'
                    }}>
                        Welcome Back
                    </h2>
                    <p style={{ color: '#666', marginTop: '0.75rem', fontSize: '1.1rem' }}>Sign in to continue to Coupon Manager</p>
                </div>

                {error && <div style={{ color: 'var(--color-pink)', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

                <form onSubmit={onSubmit}>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input type="email" name="email" value={email} onChange={onChange} required placeholder="Enter your email" />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" name="password" value={password} onChange={onChange} required placeholder="Enter your password" />
                    </div>

                    <button type="submit" className="btn" style={{ marginTop: '1rem' }}>
                        Login
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                        <p className="login-footer-link" style={{ fontSize: '0.9rem', cursor: 'default' }}>
                            Don't have a coupon? <span style={{ color: 'var(--color-purple)', fontWeight: 'bold' }}>Scan our QR code at the expo!</span>
                        </p>
                    </div>
                </form>
            </div>

        </div>
    );
};

export default Login;
