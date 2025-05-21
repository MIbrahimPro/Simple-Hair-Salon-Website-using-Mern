// src/admin/AdminApp.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';

import ProtectedRoute from './ProtectedRoute';
import AdminNavbar from './components/AdminNavbar';
import AdminLogin from './pages/AdminLogin';
import Bookings from './pages/Bookings';
import Services from './pages/Services';
import General from './pages/General';

// set auth header if token present
const token = localStorage.getItem('token');
if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

export default function AdminApp() {
  return (
    <Routes>
      {/* Login route is public */}
      <Route path="/login" element={<AdminLogin />} />

      {/* All other /admin/* routes are protected */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AdminNavbar />
            <Routes>
              <Route path="bookings" element={<Bookings />} />
              <Route path="services" element={<Services />} />
              <Route path="general" element={<General />} />
            </Routes>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
