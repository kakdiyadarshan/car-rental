import React, { useState } from 'react';
import { FaEye, FaCheck, FaTimes, FaSearch } from 'react-icons/fa';
import AdminSidebar from './AdminSidebar';
import DeleteModal from '../../components/DeleteModal';
import '../../z_styles.css';

const ManageBookings = () => {
    // Mock Data for Bookings
    const [bookings, setBookings] = useState([
        { id: '#BK-1024', customer: 'John Doeghmfjhkhk', car: 'Toyota Corolla', status: 'Pending', date: 'Mar 25, 2026', total: '150' },
        { id: '#BK-1025', customer: 'Sarah Smith', car: 'Audi A4', status: 'Approved', date: 'Mar 24, 2026', total: '360' },
        { id: '#BK-1026', customer: 'Michael Brown', car: 'Honda Civic', status: 'Completed', date: 'Mar 22, 2026', total: '195' },
        { id: '#BK-1027', customer: 'David Lee', car: 'Toyota Corolla', status: 'Cancelled', date: 'Mar 20, 2026', total: '50' },
    ]);

    // Delete/Cancel Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);

    const handleCancelClick = (id) => {
        setSelectedBookingId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmCancel = () => {
        setBookings(bookings.map(b => b.id === selectedBookingId ? { ...b, status: 'Cancelled' } : b));
        setIsDeleteModalOpen(false);
        setSelectedBookingId(null);
    };

    return (
        <div className="admin_layout_wrapper">
            <AdminSidebar />
            <main className="admin_main_content">
                <div className="admin_header_top">
                    <h2 className="admin_title">Manage <span>Bookings</span></h2>
                </div>

                <div className="admin_table_actions_v2">
                    <div className="admin_search_box_v2">
                        <FaSearch />
                        <input type="text" placeholder="Search bookings..." />
                    </div>
                    <div className="admin_filter_group_v2">
                        <select className="admin_select_v2">
                            <option value="">Status: All</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                        </select>
                    </div>
                </div>

                <div className="admin_table_container_v2">
                    <table className="admin_table_v2">
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Customer Name</th>
                                <th>Car</th>
                                <th>Total Price</th>
                                <th>Status</th>
                                <th>Booking Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td>{booking.id}</td>
                                    <td><strong>{booking.customer}</strong></td>
                                    <td>{booking.car}</td>
                                    <td className="admin_price_td">${booking.total}</td>
                                    <td>
                                        <span className={`status_badge_v2 status_${booking.status.toLowerCase()}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td>{booking.date}</td>
                                    <td>
                                        <div className="admin_action_btns_v2">
                                            <button className="btn_view_v2" title="View"><FaEye /></button>
                                            {booking.status === 'Pending' && (
                                                <>
                                                    <button className="btn_approve_v2" title="Approve"><FaCheck /></button>
                                                    <button className="btn_cancel_v2" title="Cancel" onClick={() => handleCancelClick(booking.id)}><FaTimes /></button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Reusable Cancel Confirmation Modal (using DeleteModal component) */}
                <DeleteModal 
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={confirmCancel}
                    title="Confirm Cancel Booking"
                    message="Are you sure you want to cancel this booking? This action cannot be undone."
                    type="cancel"
                />
            </main>
        </div>
    );
};

export default ManageBookings;
