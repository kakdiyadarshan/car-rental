import React, { useState } from 'react';
import { FaTrash, FaEye, FaEnvelope, FaUser, FaTag, FaTimes, FaCalendarAlt, FaSearch, FaUserTie } from 'react-icons/fa';
import { toast } from 'react-toastify';
import DeleteModal from '../../components/DeleteModal';
import { useGetContactsQuery, useDeleteContactMutation } from '../../slices/contactApiSlice';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

const ManageContacts = () => {
    const { data: contacts, isLoading, refetch } = useGetContactsQuery();
    const [deleteContact] = useDeleteContactMutation();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedContact, setSelectedContact] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteContact(deleteId).unwrap();
            toast.success('Message deleted successfully');
            setIsDeleteModalOpen(false);
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const handleView = (contact) => {
        setSelectedContact(contact);
        setShowViewModal(true);
    };

    const filteredContacts = contacts?.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const totalPages = Math.ceil(filteredContacts?.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentContacts = filteredContacts
        ?.slice()
        .reverse() // latest first (optional)
        .slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="manage_contacts_container">
            <style>
                {`
                    .manage_contacts_container .admin_header_flex {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        gap: 20px;
                        margin-bottom: 25px;
                    }
                    .manage_contacts_container .admin_search_v3 {
                        flex: 1;
                        max-width: 350px;
                    }
                    .manage_contacts_container .admin_form_input_v3 {
                        background: var(--x-surface) !important;
                        border: 1px solid var(--x-border) !important;
                        color: var(--x-text) !important;
                        transition: all 0.3s ease;
                    }
                    .manage_contacts_container .admin_form_input_v3:focus {
                        border-color: var(--x-primary) !important;
                        background: rgba(255, 255, 255, 0.05) !important;
                        box-shadow: 0 0 0 2px var(--x-primary-glow) !important;
                    }
                    @media (max-width: 768px) {
                        .manage_contacts_container .admin_header_flex {
                            flex-direction: row;
                            align-items: stretch;
                            gap: 15px;
                        }
                        .manage_contacts_container .admin_search_v3 {
                            max-width: 100%;
                        }
                        .manage_contacts_container .card_header_modern h3 {
                            font-size: 1.5rem;
                        }
                        .manage_contacts_container .card_header_modern p {
                            font-size: 0.85rem;
                        }
                        .manage_contacts_container .admin_table_dark th, 
                        .manage_contacts_container .admin_table_dark td {
                            padding: 10px 8px;
                            font-size: 0.85rem;
                        }
                        .manage_contacts_container .cell_avatar {
                            width: 30px;
                            height: 30px;
                            font-size: 0.8rem;
                        }
                        .manage_contacts_container .admin_action_btns_v2 button {
                            width: 32px;
                            height: 32px;
                        }
                    }
                    @media (max-width: 576px) {
                     .manage_contacts_container .admin_header_flex {
                            flex-direction: column;
                            align-items: stretch;
                            gap: 15px;
                        }
                        .manage_contacts_container .admin_table_dark th:nth-child(2),
                        .manage_contacts_container .admin_table_dark td:nth-child(2),
                        .manage_contacts_container .admin_table_dark th:nth-child(4),
                        .manage_contacts_container .admin_table_dark td:nth-child(4) {
                            display: none;
                        }
                    }
                `}
            </style>

            <div className="admin_header_flex">
                <div className="card_header_modern" style={{ margin: 0 }}>
                    <h3 style={{ marginBottom: '5px' }}>Manage Contacts</h3>
                    <p style={{ margin: 0 }}>Review user messages and inquiries.</p>
                </div>
                <div className="admin_search_v3" style={{ position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="Search messages..."
                        className="admin_form_input_v3"
                        style={{ paddingLeft: '45px', height: '44px', fontSize: '0.9rem', borderRadius: '12px', width: '100%' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--x-primary)', fontSize: '1.1rem' }} />
                </div>
            </div>

            <div className="admin_table_responsive_v3">
                <table className="admin_table_dark">
                    <thead>
                        <tr>
                            <th>Sender</th>
                            <th>Email</th>
                            <th>Subject</th>
                            <th>Date</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="5" className="text-center py-4">Loading messages...</td></tr>
                        ) : currentContacts?.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-4">No messages found.</td></tr>
                        ) : (
                            currentContacts?.map((contact) => (
                                <tr key={contact._id}>
                                    <td>
                                        <div className="customer_cell">
                                            <div className="cell_avatar" style={{ background: 'var(--x-primary-glow)', color: 'var(--x-primary)' }}>
                                                {contact.name.charAt(0).toUpperCase()}
                                            </div>
                                            <strong style={{ fontSize: '0.9rem' }}>{contact.name}</strong>
                                        </div>
                                    </td>
                                    <td>{contact.email}</td>
                                    <td>
                                        <span className="text-truncate" style={{ maxWidth: '180px', display: 'inline-block', fontSize: '0.9rem' }}>
                                            {contact.subject}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '0.85rem'}}>{new Date(contact.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="admin_action_btns_v2" style={{ justifyContent: 'center', gap: '8px' }}>
                                            <button
                                                className="btn_view_dark"
                                                title="View Message"
                                                style={{ width: '35px', height: '35px' }}
                                                onClick={() => handleView(contact)}
                                            >
                                                <FaEye size={14} />
                                            </button>
                                            <button
                                                className="btn-icon delete"
                                                title="Delete"
                                                style={{ width: '35px', height: '35px', borderRadius: '10px' }}
                                                onClick={() => handleDeleteClick(contact._id)}
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {totalPages > 1 && (
                    <div className="d_fleet_pagination">
                        <div className="d_pagination_pills">
                            <button
                                className="d_pag_btn d_pag_btn--prev"
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                <RiArrowLeftSLine size={24} />
                            </button>

                            <div className="d_pag_info">
                                {currentPage} of {totalPages}
                            </div>

                            <button
                                className="d_pag_btn d_pag_btn--next"
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                <RiArrowRightSLine size={24} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* View Message Modal - Refined Compact Design */}
            {showViewModal && selectedContact && (
                <div className="profile_modal_overlay" onClick={() => setShowViewModal(false)}>
                    <div className="profile_modal_content" style={{ maxWidth: '550px', padding: '0', borderRadius: '20px' }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal_header_v3" style={{ padding: '20px 25px', borderBottom: '1px solid var(--x-border)' }}>
                            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Message Inquiry</h3>
                            <button className="modal_close_btn" style={{ width: '32px', height: '32px' }} onClick={() => setShowViewModal(false)}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className="modal_body_v3" style={{ padding: '25px' }}>
                            <div className="modal_car_info" style={{ marginBottom: '25px', gap: '15px' }}>
                                <div className="mini_avatar" style={{ width: "65px", height: "65px", fontSize: "1.5rem", background: 'var(--x-primary-glow)', color: 'var(--x-primary)' }}>
                                    {selectedContact.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="modal_car_meta">
                                    <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{selectedContact.name}</h4>
                                    <span className="status_badge_v2 status_pending" style={{ fontSize: '0.65rem' }}>
                                        <FaUserTie className="me-1" /> New Inquiry
                                    </span>
                                </div>
                            </div>
                            <div className="modal_details_grid" style={{ gap: '15px' }}>
                                <div className="modal_detail_item">
                                    <label style={{ fontSize: '0.75rem', marginBottom: '4px', color: 'var(--x-primary)' }}><FaEnvelope className="me-2" /> Email Address</label>
                                    <p style={{ fontSize: '0.9rem' }}>{selectedContact.email}</p>
                                </div>
                                <div className="modal_detail_item">
                                    <label style={{ fontSize: '0.75rem', marginBottom: '4px', color: 'var(--x-primary)' }}><FaCalendarAlt className="me-2" /> Received Date</label>
                                    <p style={{ fontSize: '0.9rem' }}>{new Date(selectedContact.createdAt).toLocaleString()}</p>
                                </div>
                                <div className="modal_detail_item" style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ fontSize: '0.75rem', marginBottom: '4px', color: 'var(--x-primary)' }}><FaTag className="me-2" /> Subject</label>
                                    <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>{selectedContact.subject}</p>
                                </div>
                                <div className="modal_detail_item" style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ fontSize: '0.75rem', marginBottom: '8px', color: 'var(--x-primary)' }}>Message Content</label>
                                    <div style={{
                                        background: 'var(--x-bg)',
                                        padding: '18px 22px',
                                        borderRadius: '15px',
                                        border: '1px solid var(--x-border)',
                                        color: 'var(--x-text)',
                                        lineHeight: '1.6',
                                        whiteSpace: 'pre-wrap',
                                        fontSize: '0.95rem',
                                        maxHeight: '250px',
                                        overflowY: 'auto',
                                        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)'
                                    }}>
                                        {selectedContact.message}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal_footer_v3" style={{ padding: '15px 25px', borderTop: '1px solid var(--x-border)' }}>
                            <button className="profile_dark_save_btn" style={{ padding: '10px 25px', fontSize: '0.9rem' }} onClick={() => setShowViewModal(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Message"
                message="Are you sure you want to delete this message? This action cannot be undone."
            />
        </div>
    );
};

export default ManageContacts;
