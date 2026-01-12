import React, { useState, useEffect } from 'react';

const MarkUsedModal = ({ isOpen, onClose, onConfirm, user, mode }) => {
    const [comments, setComments] = useState('');

    useEffect(() => {
        if (mode === 'view' && user) {
            setComments(user.adminComments || 'No comments added.');
        } else {
            setComments('');
        }
    }, [mode, user, isOpen]);

    if (!isOpen) return null;

    const isViewMode = mode === 'view';

    // Date to show: Redemption date if viewing, Today if marking
    const displayDate = isViewMode && user.redemptionDate
        ? new Date(user.redemptionDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
        : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    const handleConfirm = () => {
        onConfirm(comments);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: '#1a1a1a',
                padding: '2rem',
                borderRadius: '16px',
                border: '1px solid #333',
                width: '90%',
                maxWidth: '400px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
            }}>
                <h2 className="text-gradient" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                    {isViewMode ? 'Redemption Details' : 'Confirm Redemption'}
                </h2>

                {!isViewMode && (
                    <p style={{ color: '#ccc', marginBottom: '1.5rem', textAlign: 'center' }}>
                        Are you sure you want to mark <strong>{user?.name}'s</strong> coupon as used?
                    </p>
                )}

                <div className="input-group">
                    <label>Redemption Date (Read Only)</label>
                    <input
                        type="text"
                        value={displayDate}
                        readOnly
                        style={{
                            background: '#222',
                            cursor: 'not-allowed',
                            color: '#888',
                            textAlign: 'center'
                        }}
                    />
                </div>

                <div className="input-group">
                    <label>Admin Comments</label>
                    <textarea
                        rows="3"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        readOnly={isViewMode}
                        placeholder={isViewMode ? "" : "Optional: Enter purchase details or notes..."}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: isViewMode ? '#222' : '#1a1a1a',
                            border: '1px solid #333',
                            borderRadius: '8px',
                            color: isViewMode ? '#888' : 'white',
                            outline: 'none',
                            fontFamily: 'inherit',
                            resize: 'none'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button
                        onClick={onClose}
                        className="btn-outline"
                        style={{ flex: 1 }}
                    >
                        {isViewMode ? 'Close' : 'Cancel'}
                    </button>
                    {!isViewMode && (
                        <button
                            onClick={handleConfirm}
                            className="btn"
                            style={{ flex: 1 }}
                        >
                            Confirm
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MarkUsedModal;
