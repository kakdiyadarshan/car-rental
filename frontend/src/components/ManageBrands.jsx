import React, { useState } from 'react';
import { FaPlus, FaTrash, FaEdit, FaUpload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import DeleteModal from './DeleteModal';
import { useGetBrandsQuery, useCreateBrandMutation, useUpdateBrandMutation, useDeleteBrandMutation } from '../slices/brandsApiSlice';


const ManageBrands = ({ setSubPage, subPage }) => {
    const { data: brands, isLoading, refetch } = useGetBrandsQuery();
    const [createBrand] = useCreateBrandMutation();
    const [updateBrand] = useUpdateBrandMutation();
    const [deleteBrand] = useDeleteBrandMutation();

    const [showAddBrandForm, setShowAddBrandForm] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);
    const [errors, setErrors] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Sync with parent breadcrumb
    React.useEffect(() => {
        if (!subPage) {
            setShowAddBrandForm(false);
            setEditingBrand(null);
            setErrors({});
        }
    }, [subPage]);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [brandFormData, setBrandFormData] = useState({
        name: '',
        subtitle: '',
        tagline: '',
        tag: '',
        accent: '',
        logo: null // Store actual file or existing URL
    });
    const [logoPreview, setLogoPreview] = useState('');

    const handleAddBrand = () => {
        setShowAddBrandForm(true);
        setSubPage('Add Brand');
        setEditingBrand(null);
        setBrandFormData({ name: '', subtitle: '', tagline: '', tag: '', accent: '', logo: null });
        setLogoPreview('');
        setErrors({});
    };

    const handleBrandChange = (e) => {
        const { name, value } = e.target;
        setBrandFormData({
            ...brandFormData,
            [name]: value
        });
        // Clear error when user types
        if (errors[name]) {
            setErrors({ ...errors, [name]: false });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBrandFormData({
                ...brandFormData,
                logo: file
            });
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);

            if (errors.logo) {
                setErrors({ ...errors, logo: false });
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!brandFormData.name) newErrors.name = true;
        if (!brandFormData.tagline) newErrors.tagline = true;
        if (!brandFormData.tag) newErrors.tag = true;
        if (!brandFormData.accent) newErrors.accent = true;
        if (!brandFormData.logo && !editingBrand) newErrors.logo = true;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveBrand = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fill all required fields');
            return;
        }

        const formData = new FormData();
        formData.append('name', brandFormData.name);
        formData.append('subtitle', brandFormData.subtitle);
        formData.append('tagline', brandFormData.tagline);
        formData.append('tag', brandFormData.tag);
        formData.append('accent', brandFormData.accent);

        // Append logo only if it's a file (new upload)
        if (brandFormData.logo instanceof File) {
            formData.append('logo', brandFormData.logo);
        }

        try {
            if (editingBrand) {
                await updateBrand({ id: editingBrand._id, formData }).unwrap();
                toast.success('Brand updated successfully!');
            } else {
                await createBrand(formData).unwrap();
                toast.success('Brand added successfully!');
            }
            setShowAddBrandForm(false);
            setSubPage(null);
            setEditingBrand(null);
            setBrandFormData({ name: '', subtitle: '', tagline: '', tag: '', accent: '', logo: null });
            setLogoPreview('');
            setErrors({});
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || err.error || 'An error occurred');
        }
    };

    const confirmDelete = async () => {
        try {
            await deleteBrand(deleteId).unwrap();
            toast.success('Brand removed successfully!');
            refetch();
            setIsDeleteModalOpen(false);
            setDeleteId(null);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
            setIsDeleteModalOpen(false);
        }
    };

    const handleEditBrand = (brand) => {
        setEditingBrand(brand);
        setBrandFormData({
            name: brand.name,
            subtitle: brand.subtitle || '',
            tagline: brand.tagline || '',
            tag: brand.tag || '',
            accent: brand.accent || '',
            logo: brand.logo // Keep the URL for existing logo
        });
        setLogoPreview(brand.logo);
        setErrors({});
        setShowAddBrandForm(true);
        setSubPage('Edit Brand');
    };

    const handleDeleteBrand = (id) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const truncateText = (text, limit = 20) => {
        if (!text) return '-';
        return text.length > limit ? text.substring(0, limit) + '...' : text;
    };

    const totalPages = Math.ceil(brands?.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentBrands = brands
        ?.slice()
        .reverse() // latest brand first (optional)
        .slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="profile_dark_card">
            {!showAddBrandForm ? (
                <>
                    <div className="admin_header_flex">
                        <div className="card_header_modern">
                            <h3>Manage Brands</h3>
                            <p>View and manage car brands in your system.</p>
                        </div>
                        <button
                            className="admin_btn_primary_sm"
                            onClick={handleAddBrand}
                        >
                            <FaPlus /> Add Brand
                        </button>
                    </div>

                    <div className="admin_table_responsive_v3">
                        <table className="admin_table_dark">
                            <thead>
                                <tr>
                                    <th>Logo</th>
                                    <th>Brand Name</th>
                                    <th>Subtitle</th>
                                    <th>Tagline</th>
                                    <th>Tag</th>
                                    <th>Accent</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Loading brands...</td></tr>
                                ) : currentBrands && currentBrands.length > 0 ? (
                                    currentBrands.map(brand => (
                                        <tr key={brand._id}>
                                            <td>
                                                <div style={{ width: '40px', height: '40px', background: '#fff', borderRadius: '4px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <img src={brand.logo} alt={brand.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                                </div>
                                            </td>
                                            <td><strong>{brand.name}</strong></td>
                                            <td title={brand.subtitle}>{truncateText(brand.subtitle)}</td>
                                            <td title={brand.tagline}>{truncateText(brand.tagline)}</td>
                                            <td><span className="d_brand_tag" style={{ color: brand.accent, borderColor: brand.accent + '44', padding: '2px 8px', borderRadius: '4px', border: '1px solid', fontSize: '0.7rem' }}>{brand.tag}</span></td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div style={{ width: '20px', height: '20px', background: brand.accent, borderRadius: '4px', border: '1px solid var(--x-border)' }}></div>
                                                    <span>{brand.accent}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="admin_action_btns_v2">
                                                    <button className="btn-icon edit" onClick={() => handleEditBrand(brand)} title="Edit Brand">
                                                        <FaEdit />
                                                    </button>
                                                    <button className="btn-icon delete" onClick={() => handleDeleteBrand(brand._id)} title="Delete Brand">
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                                            No brands found. Click "Add Brand" to create one.
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
                        <h3>{editingBrand ? 'Edit Brand' : 'Add New Brand'}</h3>
                        <p>{editingBrand ? 'Update brand details.' : 'Enter details for a new car brand.'}</p>
                    </div>
                    <form className="admin_add_car_form_v3" onSubmit={handleSaveBrand}>
                        <div className="profile_v3_info_grid">
                            <div className="profile_dark_field">
                                <label>Brand Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="e.g. Mercedes-Benz"
                                    value={brandFormData.name}
                                    onChange={handleBrandChange}
                                    className={errors.name ? 'error-input' : ''}
                                    style={errors.name ? { borderColor: '#ff4d4d' } : {}}
                                />
                            </div>
                            <div className="profile_dark_field">
                                <label>Subtitle (Optional)</label>
                                <input
                                    type="text"
                                    name="subtitle"
                                    placeholder="e.g. Luxury Car Brand"
                                    value={brandFormData.subtitle}
                                    onChange={handleBrandChange}
                                />
                            </div>
                            <div className="profile_dark_field">
                                <label>Tagline</label>
                                <input
                                    type="text"
                                    name="tagline"
                                    placeholder="e.g. The Best or Nothing"
                                    value={brandFormData.tagline}
                                    onChange={handleBrandChange}
                                    className={errors.tagline ? 'error-input' : ''}
                                    style={errors.tagline ? { borderColor: '#ff4d4d' } : {}}
                                />
                            </div>
                            <div className="profile_dark_field">
                                <label>Tag</label>
                                <input
                                    type="text"
                                    name="tag"
                                    placeholder="e.g. Luxury"
                                    value={brandFormData.tag}
                                    onChange={handleBrandChange}
                                    className={errors.tag ? 'error-input' : ''}
                                    style={errors.tag ? { borderColor: '#ff4d4d' } : {}}
                                />
                            </div>
                            <div className="profile_dark_field">
                                <label>Accent Color</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        type="color"
                                        name="accent"
                                        value={brandFormData.accent || '#dd6f27'}
                                        onChange={handleBrandChange}
                                        style={{ width: '50px', height: '45px', padding: '2px' }}
                                    />
                                    <input
                                        type="text"
                                        name="accent"
                                        placeholder="#HEXCODE"
                                        value={brandFormData.accent}
                                        onChange={handleBrandChange}
                                        className={errors.accent ? 'error-input' : ''}
                                        style={errors.accent ? { borderColor: '#ff4d4d', flex: 1 } : { flex: 1 }}
                                    />
                                </div>
                            </div>
                            <div className="profile_dark_field">
                                <label>Brand Logo</label>
                                <div className="brand_logo_upload_section" style={{
                                    border: errors.logo ? '2px dashed #ff4d4d' : '2px dashed var(--x-border)',
                                    borderRadius: '12px',
                                    padding: '30px',
                                    textAlign: 'center',
                                    background: 'rgba(255,255,255,0.02)',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <div className="brand_logo_preview_container" style={{
                                        width: '120px',
                                        height: '120px',
                                        background: '#fff',
                                        borderRadius: '50%',
                                        margin: '0 auto 20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                                        overflow: 'hidden',
                                        border: '4px solid var(--x-primary)'
                                    }}>
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Preview" style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }} />
                                        ) : (
                                            <FaUpload style={{ fontSize: '40px', color: 'var(--x-grey)' }} />
                                        )}
                                    </div>
                                    <div className="upload_actions">
                                        <p style={{ color: errors.logo ? '#ff4d4d' : 'var(--x-grey)', fontSize: '0.9rem', marginBottom: '15px' }}>
                                            {logoPreview ? 'Click button below to change logo' : 'Upload your brand logo (PNG, JPG)'}
                                        </p>
                                        <label htmlFor="brand-logo-upload" className="admin_btn_primary_sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                            <FaUpload /> {logoPreview ? 'Change Logo' : 'Select Logo'}
                                            <input
                                                id="brand-logo-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                style={{ display: 'none' }}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="profile_v3_form_actions">
                            <button
                                type="button"
                                className="profile_v3_cancel_btn_dark"
                                onClick={() => { setShowAddBrandForm(false); setSubPage(null); setEditingBrand(null); setErrors({}); }}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="admin_btn_primary_sm">
                                {editingBrand ? 'Update Brand' : 'Save Brand'}
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
                title="Confirm Delete Brand"
                message="Are you sure you want to delete this brand? This action cannot be undone."
            />
        </div>
    );
};

export default ManageBrands;
