import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUpload, FaTimes } from 'react-icons/fa';
import AdminSidebar from './AdminSidebar';
import DeleteModal from '../../components/DeleteModal';
import { useGetCarsQuery, useCreateCarMutation, useUpdateCarMutation, useDeleteCarMutation } from '../../slices/carsApiSlice';
import { useGetBrandsQuery } from '../../slices/brandsApiSlice';
import { toast } from 'react-toastify';
import '../../z_styles.css';

const ManageCars = () => {
    const { data: cars, isLoading, refetch } = useGetCarsQuery();
    const { data: brands } = useGetBrandsQuery();
    const [createCar] = useCreateCarMutation();
    const [updateCar] = useUpdateCarMutation();
    const [deleteCar] = useDeleteCarMutation();

    const [showForm, setShowForm] = useState(false);
    const [editingCar, setEditingCar] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        category: 'Luxury',
        description: '',
        pricePerHour: '',
        pricePerDay: '',
        acceleration: '',
        transmission: 'Automatic',
        seating: '4',
        fuel: 'Petrol',
        features: '',
    });

    const [mainImage, setMainImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    // Split thumbnails into existing (URLs) and new (File objects)
    const [existingThumbs, setExistingThumbs] = useState([]);
    const [newThumbFiles, setNewThumbFiles] = useState([]);
    const [newThumbPreviews, setNewThumbPreviews] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMainImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleThumbChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setNewThumbFiles([...newThumbFiles, ...files]);

            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setNewThumbPreviews(prev => [...prev, reader.result]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeExistingThumb = (index) => {
        setExistingThumbs(existingThumbs.filter((_, i) => i !== index));
    };

    const removeNewThumb = (index) => {
        setNewThumbFiles(newThumbFiles.filter((_, i) => i !== index));
        setNewThumbPreviews(newThumbPreviews.filter((_, i) => i !== index));
    };

    const resetForm = () => {
        setFormData({
            name: '',
            brand: '',
            category: 'Luxury',
            description: '',
            pricePerHour: '',
            pricePerDay: '',
            acceleration: '',
            transmission: 'Automatic',
            seating: '4',
            fuel: 'Petrol',
            features: '',
        });
        setMainImage(null);
        setImagePreview('');
        setExistingThumbs([]);
        setNewThumbFiles([]);
        setNewThumbPreviews([]);
        setEditingCar(null);
        setShowForm(false);
    };

    const handleEdit = (car) => {
        setEditingCar(car);
        setFormData({
            name: car.name,
            brand: car.brand?._id || car.brand,
            category: car.category,
            description: car.description,
            pricePerHour: car.pricePerHour,
            pricePerDay: car.pricePerDay,
            acceleration: car.specs?.acceleration || '',
            transmission: car.specs?.transmission || 'Automatic',
            seating: car.specs?.seating || '4',
            fuel: car.specs?.fuel || 'Petrol',
            features: car.features?.join(', ') || '',
        });
        setImagePreview(car.image);
        setExistingThumbs(car.thumbs || []);
        setNewThumbFiles([]);
        setNewThumbPreviews([]);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteCar(deleteId).unwrap();
            toast.success('Car deleted successfully');
            refetch();
            setIsDeleteModalOpen(false);
            setDeleteId(null);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
            setIsDeleteModalOpen(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (!formData.brand) {
            toast.error('Please select a brand');
            return;
        }

        // Validate main image for new cars
        if (!editingCar && !mainImage) {
            toast.error('Main image is required');
            return;
        }

        const data = new FormData();
        data.append('name', formData.name);
        data.append('brand', formData.brand);
        data.append('category', formData.category);
        data.append('description', formData.description);
        data.append('pricePerHour', formData.pricePerHour);
        data.append('pricePerDay', formData.pricePerDay);

        const specs = {
            acceleration: formData.acceleration,
            transmission: formData.transmission,
            seating: formData.seating,
            fuel: formData.fuel,
        };
        data.append('specs', JSON.stringify(specs));

        const featuresArray = formData.features.split(',').map(f => f.trim()).filter(f => f !== '');
        data.append('features', JSON.stringify(featuresArray));

        // Append main image if it exists (new or changed)
        if (mainImage) {
            data.append('image', mainImage);
        }

        // Send existing thumbs as a JSON string for update logic
        data.append('existingThumbs', JSON.stringify(existingThumbs));

        // Append new thumbnail files
        if (newThumbFiles.length > 0) {
            newThumbFiles.forEach(file => {
                data.append('thumbs', file);
            });
        }

        try {
            if (editingCar) {
                await updateCar({ id: editingCar._id, formData: data }).unwrap();
                toast.success('Car updated successfully');
            } else {
                await createCar(data).unwrap();
                toast.success('Car added successfully');
            }
            resetForm();
            refetch();
        } catch (err) {
            console.error('Save error:', err);
            toast.error(err?.data?.message || err.error || 'An error occurred while saving');
        }
    };

    const filteredCars = cars?.filter(car =>
        car.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === '' || (statusFilter === 'Available' ? car.isAvailable : !car.isAvailable))
    );

    const totalPages = Math.ceil(filteredCars?.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentCars = filteredCars
        ?.slice()
        .reverse() // latest first (optional)
        .slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="admin_layout_wrapper">
            <AdminSidebar />
            <main className="admin_main_content">
                {!showForm ? (
                    <>
                        <div className="admin_header_top">
                            <h2 className="admin_title">Manage <span>Cars</span></h2>
                            <button className="admin_btn_primary_v2" onClick={() => setShowForm(true)}>
                                <FaPlus /> Add New Car
                            </button>
                        </div>

                        <div className="admin_table_actions_v2">
                            <div className="admin_search_box_v2">
                                <FaSearch />
                                <input
                                    type="text"
                                    placeholder="Search cars..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="admin_filter_group_v2">
                                <select
                                    className="admin_select_v2"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="">Status: All</option>
                                    <option value="Available">Available</option>
                                    <option value="Rented">Rented</option>
                                </select>
                            </div>
                        </div>

                        <div className="admin_table_container_v2">
                            <table className="admin_table_v2">
                                <thead>
                                    <tr>
                                        <th>Car Image</th>
                                        <th>Car Name</th>
                                        <th>Brand</th>
                                        <th>Price / Day</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr><td colSpan="6">Loading...</td></tr>
                                    ) : currentCars && currentCars.length > 0 ? (
                                        currentCars.map((car) => (
                                            <tr key={car._id}>
                                                <td>
                                                    <img src={car.image} alt={car.name} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                                </td>
                                                <td><strong>{car.name}</strong></td>
                                                <td>{car.brand?.name || 'N/A'}</td>
                                                <td className="admin_price_td">${car.pricePerDay}</td>
                                                <td>
                                                    <span className={`status_badge_v2 ${car.isAvailable ? 'status_available' : 'status_rented'}`}>
                                                        {car.isAvailable ? 'Available' : 'Rented'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="admin_action_btns_v2">
                                                        <button className="btn_edit_v2" title="Edit" onClick={() => handleEdit(car)}><FaEdit /></button>
                                                        <button className="btn_delete_v2" title="Delete" onClick={() => handleDelete(car._id)}><FaTrash /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="6">No cars found</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <div className="admin_form_container_v2">
                        <div className="admin_header_top">
                            <h2 className="admin_title">{editingCar ? 'Edit' : 'Add'} <span>Car</span></h2>
                            <button className="admin_btn_secondary_v2" onClick={resetForm}>Cancel</button>
                        </div>

                        <form className="admin_car_form_v2" onSubmit={handleSave}>
                            <div className="admin_form_grid_v2">
                                <div className="admin_form_group_v2">
                                    <label>Car Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                                </div>
                                <div className="admin_form_group_v2">
                                    <label>Brand</label>
                                    <select name="brand" value={formData.brand} onChange={handleInputChange} required>
                                        <option value="">Select Brand</option>
                                        {brands?.map(brand => (
                                            <option key={brand._id} value={brand._id}>{brand.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="admin_form_group_v2">
                                    <label>Category</label>
                                    <select name="category" value={formData.category} onChange={handleInputChange}>
                                        <option value="Luxury">Luxury</option>
                                        <option value="Exotic">Exotic</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Supercar">Supercar</option>
                                        <option value="Hypercar">Hypercar</option>
                                        <option value="Sedan">Sedan</option>
                                        <option value="SUV">SUV</option>
                                    </select>
                                </div>
                                <div className="admin_form_group_v2">
                                    <label>Price Per Hour ($)</label>
                                    <input type="number" name="pricePerHour" value={formData.pricePerHour} onChange={handleInputChange} required />
                                </div>
                                <div className="admin_form_group_v2">
                                    <label>Price Per Day ($)</label>
                                    <input type="number" name="pricePerDay" value={formData.pricePerDay} onChange={handleInputChange} required />
                                </div>
                                <div className="admin_form_group_v2">
                                    <label>Acceleration (0-100)</label>
                                    <input type="text" name="acceleration" value={formData.acceleration} onChange={handleInputChange} placeholder="e.g. 3.2s" />
                                </div>
                                <div className="admin_form_group_v2">
                                    <label>Transmission</label>
                                    <select name="transmission" value={formData.transmission} onChange={handleInputChange}>
                                        <option value="Automatic">Automatic</option>
                                        <option value="Manual">Manual</option>
                                    </select>
                                </div>
                                <div className="admin_form_group_v2">
                                    <label>Seating</label>
                                    <input type="text" name="seating" value={formData.seating} onChange={handleInputChange} placeholder="e.g. 2" />
                                </div>
                                <div className="admin_form_group_v2">
                                    <label>Fuel Type</label>
                                    <input type="text" name="fuel" value={formData.fuel} onChange={handleInputChange} placeholder="e.g. Petrol" />
                                </div>
                            </div>

                            <div className="admin_form_group_v2 full_width">
                                <label>Description</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" required></textarea>
                            </div>

                            <div className="admin_form_group_v2 full_width">
                                <label>Features (Comma separated)</label>
                                <input type="text" name="features" value={formData.features} onChange={handleInputChange} placeholder="e.g. GPS, Bluetooth, Leather Seats" />
                            </div>

                            <div className="admin_image_upload_grid">
                                <div className="admin_upload_box_v2">
                                    <label>Main Image</label>
                                    <div className="image_preview_container_v2">
                                        {imagePreview ? (
                                            <div className="preview_wrapper">
                                                <img src={imagePreview} alt="Main Preview" />
                                                <label htmlFor="main-image-upload" className="change_img_btn"><FaUpload /></label>
                                            </div>
                                        ) : (
                                            <label htmlFor="main-image-upload" className="upload_placeholder_v2">
                                                <FaUpload />
                                                <span>Upload Main Image</span>
                                            </label>
                                        )}
                                        <input id="main-image-upload" type="file" onChange={handleMainImageChange} style={{ display: 'none' }} accept="image/*" />
                                    </div>
                                </div>

                                <div className="admin_upload_box_v2">
                                    <label>Thumbnails</label>
                                    <div className="thumbs_preview_grid_v2">
                                        {/* Render Existing Thumbnails */}
                                        {existingThumbs.map((url, index) => (
                                            <div key={`existing-${index}`} className="thumb_preview_wrapper">
                                                <img src={url} alt={`Existing Thumb ${index}`} />
                                                <button type="button" className="remove_thumb_btn" onClick={() => removeExistingThumb(index)}><FaTimes /></button>
                                            </div>
                                        ))}
                                        {/* Render New Thumbnail Previews */}
                                        {newThumbPreviews.map((prev, index) => (
                                            <div key={`new-${index}`} className="thumb_preview_wrapper">
                                                <img src={prev} alt={`New Thumb ${index}`} />
                                                <button type="button" className="remove_thumb_btn" onClick={() => removeNewThumb(index)}><FaTimes /></button>
                                            </div>
                                        ))}
                                        <label htmlFor="thumb-upload" className="add_thumb_btn">
                                            <FaPlus />
                                        </label>
                                        <input id="thumb-upload" type="file" onChange={handleThumbChange} style={{ display: 'none' }} accept="image/*" multiple />
                                    </div>
                                </div>
                            </div>

                            <div className="admin_form_actions_v2">
                                <button type="submit" className="admin_btn_primary_v2">
                                    {editingCar ? 'Update Car' : 'Add Car'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Reusable Delete Confirmation Modal */}
                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    title="Confirm Delete Car"
                    message="Are you sure you want to delete this car? This action cannot be undone."
                />
            </main>
        </div>
    );
};

export default ManageCars;
