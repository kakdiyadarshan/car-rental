import React, { useState } from 'react';
import { FaPlus, FaTrash, FaEdit, FaUpload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import DeleteModal from './DeleteModal';
import { useGetOffersQuery, useCreateOfferMutation, useUpdateOfferMutation, useDeleteOfferMutation } from '../slices/offersApiSlice';
import { useGetCarsQuery } from '../slices/carsApiSlice';

const ManageOffers = ({ setSubPage, subPage }) => {
    const { data: offers, isLoading, refetch } = useGetOffersQuery();
    const { data: cars } = useGetCarsQuery();
    const [createOffer] = useCreateOfferMutation();
    const [updateOffer] = useUpdateOfferMutation();
    const [deleteOffer] = useDeleteOfferMutation();

    const [showAddOfferForm, setShowAddOfferForm] = useState(false);
    const [editingOffer, setEditingBrand] = useState(null);

    // Sync with parent breadcrumb
    React.useEffect(() => {
        if (!subPage) {
            setShowAddOfferForm(false);
            setEditingBrand(null);
        }
    }, [subPage]);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [offerFormData, setOfferFormData] = useState({
        title: '',
        discount: '',
        desc: '',
        code: '',
        color: '#dd6f27',
        image: '',
        carId: '',
        validTill: ''
    });

    const handleOfferChange = (e) => {
        const { name, value } = e.target;
        setOfferFormData({
            ...offerFormData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setOfferFormData({
                    ...offerFormData,
                    image: reader.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddOffer = () => {
        setShowAddOfferForm(true);
        setSubPage('Add Offer');
    };

    const handleEditOffer = (offer) => {
        setEditingBrand(offer);
        setOfferFormData({
            title: offer.title,
            discount: offer.discount,
            desc: offer.desc || '',
            code: offer.code || '',
            color: offer.color || '#dd6f27',
            image: offer.image || '',
            carId: offer.carId?._id || offer.carId || '',
            validTill: offer.validTill || ''
        });
        setShowAddOfferForm(true);
        setSubPage('Edit Offer');
    };

    const handleSaveOffer = async (e) => {
        e.preventDefault();
        try {
            if (editingOffer) {
                await updateOffer({ id: editingOffer._id, ...offerFormData }).unwrap();
                toast.success('Offer updated successfully!');
            } else {
                await createOffer(offerFormData).unwrap();
                toast.success('Offer created successfully!');
            }
            setShowAddOfferForm(false);
            setSubPage(null);
            setEditingBrand(null);
            setOfferFormData({
                title: '',
                discount: '',
                desc: '',
                code: '',
                color: '#dd6f27',
                image: '',
                carId: '',
                validTill: ''
            });
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    // ... rest of the component updates ...

    const handleDeleteOffer = (id) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteOffer(deleteId).unwrap();
            toast.success('Offer removed successfully!');
            refetch();
            setIsDeleteModalOpen(false);
            setDeleteId(null);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
            setIsDeleteModalOpen(false);
        }
    };

    return (
        <div className="profile_dark_card">
            {!showAddOfferForm ? (
                <>
                    <div className="admin_header_flex">
                        <div className="card_header_modern">
                            <h3>Manage Offers</h3>
                            <p>View and manage your active promotional offers.</p>
                        </div>
                        <button 
                            className="admin_btn_primary_sm"
                            onClick={handleAddOffer}
                        >
                            <FaPlus /> Add Offer
                        </button>
                    </div>

                    <div className="admin_table_responsive_v3">
                        <table className="admin_table_dark">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Title</th>
                                    <th>Discount (%)</th>
                                    <th>Expiry Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Loading offers...</td></tr>
                                ) : offers && offers.length > 0 ? (
                                    offers.map(offer => (
                                        <tr key={offer._id}>
                                            <td>
                                                <div style={{ width: '60px', height: '40px', background: '#222', borderRadius: '4px', overflow: 'hidden' }}>
                                                    <img src={offer.image} alt={offer.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                            </td>
                                            <td><strong>{offer.title}</strong></td>
                                            <td>{offer.discount}%</td>
                                            <td>{offer.validTill}</td>
                                            <td>
                                                <div className="admin_action_btns_v2">
                                                    <button className="btn-icon edit" onClick={() => handleEditOffer(offer)} title="Edit Offer">
                                                        <FaEdit />
                                                    </button>
                                                    <button 
                                                        className="btn-icon delete" 
                                                        onClick={() => handleDeleteOffer(offer._id)}
                                                        title="Delete Offer"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                            No offers found. Click "Add Offer" to create one.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <>
                    <div className="card_header_modern">
                        <h3>{editingOffer ? 'Edit Offer' : 'Add New Offer'}</h3>
                        <p>{editingOffer ? 'Update promotional offer details.' : 'Create a new promotional offer for your customers.'}</p>
                    </div>
                    <form className="admin_add_car_form_v3" onSubmit={handleSaveOffer}>
                        <div className="profile_v3_info_grid">
                            <div className="profile_dark_field">
                                <label>Offer Title</label>
                                <input 
                                    type="text" 
                                    name="title"
                                    placeholder="e.g. Summer Discount"
                                    value={offerFormData.title}
                                    onChange={handleOfferChange}
                                    required 
                                />
                            </div>
                            <div className="profile_dark_field">
                                <label>Promo Code</label>
                                <input 
                                    type="text" 
                                    name="code"
                                    placeholder="e.g. SUMMER20"
                                    value={offerFormData.code}
                                    onChange={handleOfferChange}
                                    required 
                                />
                            </div>
                            <div className="profile_dark_field">
                                <label>Discount (%)</label>
                                <input 
                                    type="number" 
                                    name="discount"
                                    placeholder="e.g. 15"
                                    value={offerFormData.discount}
                                    onChange={handleOfferChange}
                                    required 
                                />
                            </div>
                            <div className="profile_dark_field">
                                <label>Expiry Date</label>
                                <input 
                                    type="date" 
                                    name="validTill"
                                    value={offerFormData.validTill}
                                    onChange={handleOfferChange}
                                    required 
                                />
                            </div>
                            <div className="profile_dark_field">
                                <label>Theme Color</label>
                                <input 
                                    type="color" 
                                    name="color"
                                    value={offerFormData.color}
                                    onChange={handleOfferChange}
                                    style={{ height: '45px', padding: '5px' }}
                                />
                            </div>
                            <div className="profile_dark_field">
                                <label>Associated Car</label>
                                <select 
                                    className="admin_form_select_v3"
                                    name="carId"
                                    value={offerFormData.carId}
                                    onChange={handleOfferChange}
                                >
                                    <option value="">Select Car (Optional)</option>
                                    {cars?.map(car => (
                                        <option key={car._id} value={car._id}>{car.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="profile_dark_field">
                                <label>Offer Image</label>
                                <div className="brand_logo_upload_section" style={{ 
                                    border: '2px dashed var(--x-border)', 
                                    borderRadius: '12px', 
                                    padding: '20px', 
                                    textAlign: 'center',
                                    background: 'rgba(255,255,255,0.02)',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <div className="offer_preview_container" style={{ 
                                        width: '100%', 
                                        height: '100px', 
                                        background: '#111', 
                                        borderRadius: '8px', 
                                        margin: '0 auto 15px',
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        border: '1px solid var(--x-border)'
                                    }}>
                                        {offerFormData.image ? (
                                            <img src={offerFormData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        ) : (
                                            <FaUpload style={{ fontSize: '30px', color: 'var(--x-grey)' }} />
                                        )}
                                    </div>
                                    <label htmlFor="offer-image-upload" className="admin_btn_primary_sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                        <FaUpload /> {offerFormData.image ? 'Change Offer Image' : 'Upload Offer Image'}
                                        <input 
                                            id="offer-image-upload"
                                            type="file" 
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }} 
                                            required={!editingOffer}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="profile_dark_field" style={{ marginTop: '20px' }}>
                            <label>Offer Description</label>
                            <textarea 
                                className="admin_form_textarea_v3" 
                                name="desc"
                                placeholder="Get 15% off on all bookings this summer..."
                                rows="4"
                                value={offerFormData.desc}
                                onChange={handleOfferChange}
                                required
                            ></textarea>
                        </div>

                        <div className="profile_v3_form_actions">
                            <button 
                                type="button" 
                                className="profile_v3_cancel_btn_dark"
                                onClick={() => { setShowAddOfferForm(false); setEditingBrand(null); }}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="admin_btn_primary_sm">
                                {editingOffer ? 'Update Offer' : 'Save Offer'}
                            </button>
                        </div>
                    </form>
                </>
            )}

            {/* Reusable Delete Confirmation Modal */}
            <DeleteModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Confirm Delete Offer"
                message="Are you sure you want to delete this offer? This action cannot be undone."
            />
        </div>
    );
};

export default ManageOffers;
