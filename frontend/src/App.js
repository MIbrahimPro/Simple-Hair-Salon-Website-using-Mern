// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Customer imports
import AppNavbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Booking from './pages/Booking';

// Admin
import AdminApp from './admin/AdminApp';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminApp />} />

        {/* Public/customer routes */}
        <Route
          path="/*"
          element={
            <>
              <AppNavbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/booking" element={<Booking />} />
              </Routes>
              <Footer />
            </>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
