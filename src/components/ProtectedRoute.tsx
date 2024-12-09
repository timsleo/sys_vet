import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role: string }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role'); 
    console.log('Token:', token);
    console.log('User Role:', userRole);
    return token && userRole === role ? <>{children}</> : <Navigate to="/login" />;
  };

export default ProtectedRoute;
