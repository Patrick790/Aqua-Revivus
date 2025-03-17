import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import LoginForm from './components/login/Login';
import Dashboard from './components/client/UserDashboard';
import Account from './components/utils/Account';
import waterBackground from './components/utils/apa5.jpg';
import HouseholdDetails from "./components/client/HouseholdDetails";
import Ranking from "./components/client/Ranking";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminAccount from "./components/utils/AdminAccount";

function App() {
    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userId");
        localStorage.removeItem("userType");
        window.location.href = "/login";
    }


    return (
        <Router>
            <div className="app" style={{ backgroundImage: `url(${waterBackground})` }}>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/dashboard" element={<Navigate to="/user-dashboard" />} />
                    <Route path="/user-dashboard" element={<Dashboard />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/admin-account" element={<AdminAccount />} />
                    <Route path="/householdDetails" element={<HouseholdDetails />} />
                    <Route path="/ranking" element={<Ranking />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;