// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const token = localStorage.getItem('adminToken');
const backend_url = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.get(`${backend_url}/api/auth/verify-token`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
        localStorage.removeItem('adminToken');
      }
    };

    token ? verifyToken() : setIsAuthenticated(false);
  }, [token]);

  if (isAuthenticated === null) return <div>Loading...</div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;