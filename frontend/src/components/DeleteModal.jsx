import React from 'react';
import { FaTrash, FaTimes } from 'react-icons/fa';
import '../z_styles.css';

const DeleteModal = ({ isOpen, onClose, onConfirm, title, message, type = 'delete' }) => {
    if (!isOpen) return null;

    return (
        <div className="x_modal_overlay" onClick={onClose}>
            <div className="x_modal_content" onClick={(e) => e.stopPropagation()}>
                <div className="modal_header_v3" style={{ border: 'none', padding: '0', justifyContent: 'flex-end' }}>
                    <button className="modal_close_btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>
                <div className="x_icon_box" style={{ 
                    background: type === 'delete' ? 'rgba(255, 59, 48, 0.1)' : 'rgba(221, 111, 39, 0.1)',
                    color: type === 'delete' ? '#ff3b30' : '#dd6f27'
                }}>
                    <FaTrash />
                </div>
                <h3>{title || 'Confirm Delete'}</h3>
                <p>
                    {message || 'Are you sure you want to delete this item? This action cannot be undone.'}
                </p>
                <div className="x_modal_actions">
                    <button 
                        className="x_btn_cancel" 
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button 
                        className="x_btn_delete" 
                        style={{ 
                            background: type === 'delete' ? '#ff3b30' : '#dd6f27'
                        }}
                        onClick={onConfirm}
                    >
                        {type === 'delete' ? 'Delete Now' : 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
