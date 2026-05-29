import React from 'react';
import { FaCar, FaCalendarCheck, FaUsers, FaMoneyBillWave } from 'react-icons/fa';
import AdminSidebar from './AdminSidebar';
import '../../z_styles.css';

const AdminDashboard = () => {
    return (
        <div className="admin_layout_wrapper">
            <AdminSidebar />
            <main className="admin_main_content">
                <div className="admin_header_top">
                    <h2 className="admin_title">Dashboard <span>Overview</span></h2>
                    <div className="admin_user_profile">
                        <p>Welcome, Admin</p>
                        <div className="admin_avatar">A</div>
                    </div>
                </div>
                
                <div className="admin_stats_v3_grid">
                    <div className="admin_stat_card_v3">
                        <div className="admin_stat_main">
                            <div className="admin_stat_icon_v3"><FaCar /></div>
                            <div className="admin_stat_data">
                                <h3>120</h3>
                                <p>Total Cars</p>
                            </div>
                        </div>
                        <div className="admin_stat_footer">
                            <span className="trend_up">↑ 12%</span>
                            <span>Since last month</span>
                        </div>
                    </div>
                    <div className="admin_stat_card_v3">
                        <div className="admin_stat_main">
                            <div className="admin_stat_icon_v3"><FaCalendarCheck /></div>
                            <div className="admin_stat_data">
                                <h3>45</h3>
                                <p>Active Bookings</p>
                            </div>
                        </div>
                        <div className="admin_stat_footer">
                            <span className="trend_up">↑ 8%</span>
                            <span>Since last month</span>
                        </div>
                    </div>
                    <div className="admin_stat_card_v3">
                        <div className="admin_stat_main">
                            <div className="admin_stat_icon_v3"><FaUsers /></div>
                            <div className="admin_stat_data">
                                <h3>1,250</h3>
                                <p>Total Users</p>
                            </div>
                        </div>
                        <div className="admin_stat_footer">
                            <span className="trend_up">↑ 15%</span>
                            <span>Since last month</span>
                        </div>
                    </div>
                    <div className="admin_stat_card_v3">
                        <div className="admin_stat_main">
                            <div className="admin_stat_icon_v3"><FaMoneyBillWave /></div>
                            <div className="admin_stat_data">
                                <h3>$25,400</h3>
                                <p>Total Revenue</p>
                            </div>
                        </div>
                        <div className="admin_stat_footer">
                            <span className="trend_up">↑ 20%</span>
                            <span>Since last month</span>
                        </div>
                    </div>
                </div>

                <div className="admin_content_row">
                    <div className="admin_recent_bookings_v2">
                        <div className="admin_card_header">
                            <h3>Recent Bookings</h3>
                            <button className="admin_view_all">View All</button>
                        </div>
                        <div className="admin_table_responsive">
                            <table className="admin_table_v2">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Customer</th>
                                        <th>Car</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>#BK-1024</td>
                                        <td>John Doe</td>
                                        <td>Toyota Corolla</td>
                                        <td><span className="status_badge_v2 status_pending">Pending</span></td>
                                        <td>Mar 25, 2026</td>
                                    </tr>
                                    <tr>
                                        <td>#BK-1025</td>
                                        <td>Sarah Smith</td>
                                        <td>Audi A4</td>
                                        <td><span className="status_badge_v2 status_approved">Approved</span></td>
                                        <td>Mar 24, 2026</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
