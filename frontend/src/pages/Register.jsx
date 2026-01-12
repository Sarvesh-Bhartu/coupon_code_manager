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
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const validDiscounts = ['10', '20', '30'];

    if (!validDiscounts.includes(discount)) {
        return <div className="container text-center text-white mt-10"><h1>Invalid Offer Link</h1></div>;
    }

    const { name, email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', {
                name,
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
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="card">
                <h2 className="text-gradient" style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2rem' }}>
                    Claim Your {discount}% Off!
                </h2>
                <p style={{ textAlign: 'center', color: '#888', marginBottom: '2rem' }}>
                    Register now to generate your unique coupon.
                </p>

                {error && <div style={{ color: 'var(--color-pink)', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

                <form onSubmit={onSubmit}>
                    <div className="input-group">
                        <label>Full Name</label>
                        <input type="text" name="name" value={name} onChange={onChange} required placeholder="Ex: Sarvesh" />
                    </div>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input type="email" name="email" value={email} onChange={onChange} required placeholder="Ex: user@example.com" />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" name="password" value={password} onChange={onChange} required placeholder="********" />
                    </div>

                    <button type="submit" className="btn" style={{ marginTop: '1rem' }}>
                        Get My Coupon
                    </button>

                    <p style={{ textAlign: 'center', marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
                        Already registered? <span style={{ color: 'var(--color-blue)', cursor: 'pointer' }} onClick={() => navigate('/login')}>Login here</span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
