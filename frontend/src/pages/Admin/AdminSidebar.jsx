import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaChartPie, FaCar, FaCalendarCheck, FaUsers, FaCog, FaSignOutAlt, FaBars, FaTimes, FaEnvelope } from 'react-icons/fa';
import DeleteModal from '../../components/DeleteModal';
import '../../z_styles.css';

const AdminSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => setIsOpen(!isOpen);

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
    };

    const confirmLogout = () => {
        // Perform logout logic here (e.g., clear localStorage, etc.)
        localStorage.removeItem('userInfo');
        navigate('/');
    };

    return (
        <>
            <button className="admin_sidebar_toggle" onClick={toggleSidebar}>
                {isOpen ? <FaTimes /> : <FaBars />}
            </button>
            <div className={`admin_sidebar ${isOpen ? 'open' : ''}`}>
                <div className="admin_sidebar_logo">
                    <FaCar className="logo_icon" />
                    <span>Rent<span>Admin</span></span>
                </div>
                <nav className="admin_sidebar_nav">
                    <NavLink to="/admin" end className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setIsOpen(false)}>
                        <FaChartPie /> <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/admin/cars" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setIsOpen(false)}>
                        <FaCar /> <span>Manage Cars</span>
                    </NavLink>
                    <NavLink to="/admin/bookings" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setIsOpen(false)}>
                        <FaCalendarCheck /> <span>Manage Bookings</span>
                    </NavLink>
                    <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setIsOpen(false)}>
                        <FaUsers /> <span>Manage Users</span>
                    </NavLink>
                    <NavLink to="/admin/contacts" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setIsOpen(false)}>
                        <FaEnvelope /> <span>Manage Contacts</span>
                    </NavLink>
                    <NavLink to="/admin/settings" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setIsOpen(false)}>
                        <FaCog /> <span>Settings</span>
                    </NavLink>
                </nav>
                <div className="admin_sidebar_footer">
                    <button className="admin_logout_btn" onClick={handleLogoutClick}>
                        <FaSignOutAlt /> <span>Logout</span>
                    </button>
                </div>
            </div>
            {isOpen && <div className="admin_sidebar_overlay" onClick={toggleSidebar}></div>}

            {/* Reusable Logout Confirmation Modal (using DeleteModal component) */}
            <DeleteModal 
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={confirmLogout}
                title="Confirm Logout"
                message="Are you sure you want to log out from the Admin panel?"
                type="confirm"
            />
        </>
    );
};

export default AdminSidebar;
