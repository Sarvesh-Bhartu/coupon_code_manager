import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
//import logo from '../assets/logo.png';

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

    const offerText = offerDetails[user.discount] || `${user.discount}% OFF`;

    return (
        <div className="login-container">
            <div className="coupon-content-wrapper" style={{ zIndex: 10 }}>

                {/* Left Side: Branding */}
                {/* Left Side: Branding */}
                <div className="coupon-left-section">
                    <div style={{ marginBottom: '2rem' }}>
                        {/* Glass container */}
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            display: 'inline-block',
                            padding: '1rem 2rem',
                            borderRadius: '16px',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <img src="/logo.png" alt="Drone E Care Expert" style={{ height: '50px', display: 'block' }} />
                        </div>
                    </div>

                    <h1 className="text-gradient coupon-headline" style={{ paddingBottom: '1rem' }}>
                        Repair, Fly, Create.
                    </h1>
                    <p className="coupon-subtext">
                        Experience premium drone care with <strong>DroneECareExpert</strong>.
                        We ensure your gear is always ready for your next masterpiece.
                    </p>

                    {/* Desktop Buttons (Hidden on Mobile) */}
                    <div className="action-buttons desktop-only-buttons" style={{ display: 'flex', gap: '1rem' }}>
                        <a href="https://www.droneecareexpert.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', flex: 1 }}>
                            <button className="btn">Visit Website</button>
                        </a>
                        <button onClick={logout} className="btn-outline" style={{ flex: 1, borderColor: 'rgba(255,255,255,0.2)' }}>
                            Logout
                        </button>
                    </div>
                </div>

                {/* Right Side: Coupon Card */}
                <div className="coupon-card-section" style={{
                    background: 'rgba(18, 18, 18, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                }}>
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                        background: 'var(--gradient-main)'
                    }}></div>

                    <div style={{ marginBottom: '1rem' }}>
                        <span style={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            color: '#60a5fa',
                            padding: '0.4rem 1rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            letterSpacing: '1px',
                            border: '1px solid rgba(59, 130, 246, 0.2)'
                        }}>
                            EXCLUSIVE EXPO OFFER
                        </span>
                    </div>

                    <h2 className="coupon-discount-text" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'white' }}>
                        {offerText}
                    </h2>

                    <div style={{
                        background: 'rgba(0,0,0,0.4)',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: '1px dashed rgba(255,255,255,0.1)',
                        marginBottom: '1.5rem',
                        marginTop: '1rem'
                    }}>
                        <p style={{ color: '#888', marginBottom: '0.5rem', fontSize: '0.75rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Your Coupon Code</p>
                        <h2 style={{ fontSize: '2.5rem', letterSpacing: '3px', color: 'var(--color-light-purple)', margin: 0, fontFamily: 'monospace' }}>
                            {user.couponCode}
                        </h2>
                        <div style={{ marginTop: '0.5rem' }}>
                            {user.status === 'used' ?
                                <small style={{ color: '#ef4444', fontWeight: 'bold' }}>• REDEEMED •</small> :
                                <small style={{ color: '#4ade80', fontWeight: 'bold' }}>• VALID •</small>
                            }
                        </div>
                    </div>

                    <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                        <div style={{ display: 'flex', alignItems: 'start', marginBottom: '0.75rem', color: '#888' }}>
                            <span style={{ minWidth: '24px', color: 'var(--color-purple)' }}>📅</span>
                            <span>Coupon Code Valid for 3 months only. Expires on: {new Date(user.expiresAt).toLocaleDateString()}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'start', marginBottom: '0.75rem', color: '#888' }}>
                            <span style={{ minWidth: '24px', color: 'var(--color-purple)' }}>💳</span>
                            <span>Physical Card Submission required for availing the given discount.</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'start', color: '#888' }}>
                            <span style={{ minWidth: '24px', color: 'var(--color-purple)' }}>⚠️</span>
                            <span>Lack of Physical card but presence of Coupon code will lead to standard 10% discount.</span>
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>Need Help? Contact Admin</p>
                        <p style={{ margin: '0.2rem 0 0 0', fontWeight: '800', color: '#fff', fontSize: '1rem' }}>Aniket Dabholkar - +91 7718820048</p>
                    </div>

                    {/* Mobile Buttons (Visible ONLY on Mobile via CSS) */}
                    <div className="action-buttons mobile-only-buttons" style={{ display: 'none', gap: '1rem', marginTop: '2rem' }}>
                        <a href="https://www.droneecareexpert.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', width: '100%' }}>
                            <button className="btn">Visit Website</button>
                        </a>
                        <button onClick={logout} className="btn-outline" style={{ width: '100%', borderColor: 'rgba(255,255,255,0.2)' }}>
                            Logout
                        </button>
                    </div>
                </div>

            </div>

            {/* Mobile Scroll Indicator (Removed) */}
            <div className="scroll-indicator" style={{ display: 'none' }}></div>
        </div>
    );
};

export default Coupon;
