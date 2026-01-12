import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import logo from '../assets/logo.png';

const Coupon = () => {
    const { user, logout } = useContext(AuthContext);
    const [showScroll, setShowScroll] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setShowScroll(false);
            } else {
                setShowScroll(true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!user) return null;

    return (
        <div className="coupon-page-container">
            <div className="coupon-content-wrapper">

                {/* Left Side: Branding */}
                <div className="coupon-left-section">
                    <div style={{ marginBottom: '2rem' }}>
                        {/* White BG container */}
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            display: 'inline-block',
                            padding: '1rem 2rem',
                            borderRadius: '12px',
                            boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)'
                        }}>
                            <img src={logo} alt="Drone E Care Expert" style={{ height: '50px', display: 'block' }} />
                        </div>
                    </div>

                    <h1 className="text-gradient coupon-headline">
                        Repair. Fly.<br />Create.
                    </h1>
                    <p className="coupon-subtext">
                        Experience premium drone care with <strong>DroneECareExpert</strong>.
                        We ensure your gear is always ready for your next masterpiece.
                    </p>

                    <div className="action-buttons" style={{ display: 'flex', gap: '1rem' }}>
                        <a href="https://www.droneecareexpert.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', flex: 1 }}>
                            <button className="btn">Visit Website</button>
                        </a>
                        <button onClick={logout} className="btn-outline" style={{ flex: 1 }}>
                            Logout
                        </button>
                    </div>
                </div>

                {/* Right Side: Coupon Card */}
                <div className="coupon-card-section">
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                        background: 'var(--gradient-main)'
                    }}></div>

                    <div style={{ marginBottom: '1rem' }}>
                        <span style={{ background: 'rgba(37, 99, 235, 0.15)', color: 'var(--color-blue)', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                            EXCLUSIVE EXPO OFFER
                        </span>
                    </div>

                    <h2 className="coupon-discount-text">
                        {user.discount}%
                        <span style={{ fontSize: '1.5rem', fontWeight: '400', color: '#888', marginLeft: '0.5rem' }}>OFF</span>
                    </h2>

                    <div style={{
                        background: '#111',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: '1px dashed #444',
                        marginBottom: '1.5rem',
                        marginTop: '1rem'
                    }}>
                        <p style={{ color: '#666', marginBottom: '0.5rem', fontSize: '0.75rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Your Coupon Code</p>
                        <h2 style={{ fontSize: '2.5rem', letterSpacing: '3px', color: 'white', margin: 0, fontFamily: 'monospace' }}>
                            {user.couponCode}
                        </h2>
                        <div style={{ marginTop: '0.5rem' }}>
                            {user.status === 'used' ?
                                <small style={{ color: '#ef4444', fontWeight: 'bold' }}>• REDEEMED •</small> :
                                <small style={{ color: '#22c55e', fontWeight: 'bold' }}>• VALID •</small>
                            }
                        </div>
                    </div>

                    <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                        <div style={{ display: 'flex', alignItems: 'start', marginBottom: '0.75rem', color: '#bbb' }}>
                            <span style={{ minWidth: '24px', color: 'var(--color-purple)' }}>📅</span>
                            <span>Expires: {new Date(user.expiresAt).toLocaleDateString()}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'start', marginBottom: '0.75rem', color: '#bbb' }}>
                            <span style={{ minWidth: '24px', color: 'var(--color-purple)' }}>💳</span>
                            <span>Physical Card Submission required for availing the given discount.</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'start', color: '#bbb' }}>
                            <span style={{ minWidth: '24px', color: 'var(--color-purple)' }}>⚠️</span>
                            <span>Lack of Physical card but presence of Coupon code will lead to standard 10% discount.</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Mobile Scroll Indicator */}
            <div className="scroll-indicator" style={{ opacity: showScroll ? 1 : 0 }}>
                <span className="scroll-arrow">↓</span>
                <p>Scroll down to view discount code</p>
            </div>
        </div>
    );
};

export default Coupon;
