import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div className="text-white text-center mt-10">Loading...</div>;

    if (user && user.role === 'admin') {
        return children;
    }

    return <Navigate to="/login" replace />;
};

export default AdminRoute;
