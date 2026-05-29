import React, { useState, useEffect } from "react";
import {
    FaUser,
    FaHistory,
    FaLock,
    FaSignOutAlt,
    FaShieldAlt,
    FaCar,
    FaCalendarCheck,
    FaUsers,
    FaChevronRight,
    FaPlus,
    FaEdit,
    FaTrash,
    FaSearch,
    FaEye,
    FaEyeSlash,
    FaCheck,
    FaTimes,
    FaMoneyBillWave,
    FaChartLine,
    FaTachometerAlt,
    FaArrowRight,
    FaClock,
    FaMapPin,
    FaGift,
    FaUpload,
    FaEnvelope
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, setCredentials } from "../slices/authSlice";
import {
    useGetMyBookingsQuery,
    useGetBookingsQuery,
    useUpdateBookingStatusMutation,
} from "../slices/bookingsApiSlice";
import {
    useUpdateProfileMutation,
    useGetUsersQuery,
    useDeleteUserMutation,
    useProfileQuery,
} from "../slices/usersApiSlice";
import {
    useGetCarsQuery,
    useCreateCarMutation,
    useUpdateCarMutation,
    useDeleteCarMutation,
} from "../slices/carsApiSlice";
import { useGetBrandsQuery } from "../slices/brandsApiSlice";
import StarRating from '../components/StarRating';
import { useCreateOrUpdateRatingMutation } from '../slices/ratingsApiSlice';
import ManageBrands from "../components/ManageBrands";
import ManageContacts from "./Admin/ManageContacts";
import DeleteModal from "../components/DeleteModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import "../z_styles.css";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

const Profile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [userPage, setUserPage] = useState(1);
    const usersPerPage = 10;

    // Get latest profile data from backend
    const { data: profileData, isLoading: isProfileLoading, refetch: refetchProfile } = useProfileQuery();

    const {
        data: myBookingsData,
        isLoading: isMyBookingsLoading,
        refetch: refetchMyBookings,
    } = useGetMyBookingsQuery();
    const {
        data: allBookingsData,
        isLoading: isAllBookingsLoading,
        refetch: refetchAllBookings,
    } = useGetBookingsQuery(undefined, {
        skip: userInfo?.role !== "admin",
    });
    const totalPages = Math.ceil(allBookingsData?.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentBookings = allBookingsData
        ?.slice()
        .reverse() // latest first
        .slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const [updateBookingStatus] = useUpdateBookingStatusMutation();
    const [updateProfile, { isLoading: isUpdatingProfile }] =
        useUpdateProfileMutation();

    const {
        data: carsData,
        isLoading: isCarsLoading,
        refetch: refetchCars,
    } = useGetCarsQuery();
    console.log("Cars Data from API:", carsData);
    const [createCar] = useCreateCarMutation();
    const [updateCar] = useUpdateCarMutation();
    const [deleteCar] = useDeleteCarMutation();

    const { data: brandsData } = useGetBrandsQuery();

    const {
        data: usersData,
        isLoading: isUsersLoading,
        refetch: refetchUsers,
    } = useGetUsersQuery(undefined, {
        skip: userInfo?.role !== "admin",
    });
    const [deleteUser] = useDeleteUserMutation();
    const [createOrUpdateRating] = useCreateOrUpdateRatingMutation();

    useEffect(() => {
        if (!userInfo) {
            navigate("/Register");
        }
    }, [userInfo, navigate]);

    // Sync user state with profileData from backend (latest data)
    useEffect(() => {
        // Use profileData if available, otherwise fallback to userInfo
        const dataSource = profileData || userInfo;

        if (dataSource) {
            console.log("dataSource:", dataSource);

            const newUserState = {
                firstname: dataSource.firstname || "",
                lastname: dataSource.lastname || "",
                name: `${dataSource.firstname} ${dataSource.lastname}`,
                email: dataSource.email || "",
                phone: dataSource.phoneNo || "",
                location: dataSource.location || "Surat, Gujarat",
                role: dataSource.role || "user",
                joined: "Jan 2024",
                image: dataSource.img || "https://i.pravatar.cc/150?u=admin",
            };
            console.log("Setting user state:", newUserState);
            setUser(newUserState);
            setProfileFormData({
                firstname: newUserState.firstname,
                lastname: newUserState.lastname,
                email: newUserState.email,
                phone: newUserState.phone,
                location: newUserState.location,
                image: newUserState.image,
            });
        }
    }, [profileData, userInfo]);

    const totalUserPages = Math.ceil(usersData?.length / usersPerPage);

    const indexOfLastUser = userPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;

    const currentUsers = usersData
        ?.slice()
        .reverse() // latest users first (optional)
        .slice(indexOfFirstUser, indexOfLastUser);

    const handleUserPageChange = (page) => {
        setUserPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    useEffect(() => {
        setUserPage(1);
    }, [usersData]);

    const [activeTab, setActiveTab] = useState(
        localStorage.getItem("profileActiveTab") || "profile",
    );
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showAddCarForm, setShowAddCarForm] = useState(false);
    const [subPage, setSubPage] = useState(null);
    const [editingCar, setEditingCar] = useState(null);
    const [errors, setErrors] = useState({});

const validatePasswordForm = () => {
    let newErrors = {};

    if (!oldPassword) {
        newErrors.oldPassword = "Old password is required";
        toast.error("Old password is required");
    }

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
        newErrors.newPassword =
            "Min 8 chars, include upper, lower, number & special char";
        toast.error(
            "Password must be 8+ chars with upper, lower, number & special char"
        );
    }

    if (oldPassword === newPassword) {
        newErrors.newPassword = "New password must be different";
        toast.error("New password must be different from old password");
    }

    // 🔥 MAIN PART YOU ASKED
    if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
        toast.error("New password and confirm password do not match ❌");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

    // Sync subPage with showAddCarForm
    useEffect(() => {
        if (!subPage) {
            setShowAddCarForm(false);
            setEditingCar(null);
        }
    }, [subPage]);
    const [carFormData, setCarFormData] = useState({
        name: "",
        brand: "",
        category: "Sedan",
        pricePerDay: "",
        pricePerHour: "",
        description: "",
        image: "",
        specs: {
            acceleration: "",
            transmission: "",
            seating: "",
            fuel: "",
        },
        features: [],
        isAvailable: true,
    });

    const [mainImage, setMainImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    // Split thumbnails into existing (URLs) and new (File objects)
    const [existingThumbs, setExistingThumbs] = useState([]);
    const [newThumbFiles, setNewThumbFiles] = useState([]);
    const [newThumbPreviews, setNewThumbPreviews] = useState([]);

    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [bookingPage, setBookingPage] = useState(1);
    const bookingsPerPage = 6;

    // Delete Confirmation Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteType, setDeleteType] = useState(null); // 'car' or 'user'
    const [deleteId, setDeleteId] = useState(null);

    const [user, setUser] = useState({
        firstname: "",
        lastname: "",
        name: "",
        email: "",
        phone: "",
        location: "Surat, Gujarat",
        role: "user",
        joined: "Jan 2024",
        image: "https://i.pravatar.cc/150?u=admin",
    });
    console.log(user, "user");

    // Profile form state
    const [profileFormData, setProfileFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        location: "Surat, Gujarat",
        image: "https://i.pravatar.cc/150?u=admin",
    });

    const [isEditingProfile, setIsEditingProfile] = useState(false);

    const handleProfileChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "image" && files && files[0]) {
            setProfileFormData({
                ...profileFormData,
                image: files[0],
            });
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileFormData((prev) => ({
                    ...prev,
                    preview: reader.result,
                }));
            };
            reader.readAsDataURL(files[0]);
        } else {
            setProfileFormData({
                ...profileFormData,
                [name]: value,
            });
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const formData = new FormData();
            formData.append("firstname", profileFormData.firstname);
            formData.append("lastname", profileFormData.lastname);
            formData.append("email", profileFormData.email);
            formData.append("phoneNo", profileFormData.phone);

            formData.append("location", profileFormData.location);

            if (profileFormData.image instanceof File) {
                formData.append("img", profileFormData.image);
            }

            const res = await updateProfile(formData).unwrap();
            dispatch(setCredentials(res));

            // Refetch profile data to get the latest updates
            await refetchProfile();

            toast.success("Profile updated successfully!");
            setIsEditingProfile(false);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!validatePasswordForm()) return;

        try {
            await updateProfile({
                password: newPassword,
            }).unwrap();

            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            toast.success("Password updated successfully!");
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };
    const totalBookingPages = Math.ceil(myBookingsData?.length / bookingsPerPage);

    const indexOfLastBooking = bookingPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;

    const currentmyBookings = myBookingsData
        ?.slice()
        .reverse()
        .slice(indexOfFirstBooking, indexOfLastBooking);

    const handleBookingPageChange = (page) => {
        setBookingPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const [bookings, setBookings] = useState([
        {
            id: "#BK-1024",
            customer: "John Doe",
            customerImage: "https://i.pravatar.cc/150?u=john",
            car: "Toyota Corolla",
            status: "Pending",
            date: "Mar 25, 2026",
            total: "150",
            location: "Surat, Gujarat",
            image:
                "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600",
            pickupDate: "Mar 25, 2026",
            returnDate: "Mar 27, 2026",
            fuel: "Petrol",
            transmission: "Automatic",
            seats: "5 People",
            time: "10:00 AM",
        },
        {
            id: "#BK-1025",
            customer: "Sarah Smith",
            customerImage: "https://i.pravatar.cc/150?u=sarah",
            car: "Audi A4",
            status: "Approved",
            date: "Mar 24, 2026",
            total: "360",
            location: "Surat, Gujarat",
            image:
                "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&q=80&w=600",
            pickupDate: "Mar 24, 2026",
            returnDate: "Mar 26, 2026",
            fuel: "Petrol",
            transmission: "Automatic",
            seats: "5 People",
            time: "11:30 AM",
        },
    ]);

    // Mock Data for Users
    const [users, setUsers] = useState([
        {
            id: 1,
            name: "John Doe",
            image: "https://i.pravatar.cc/150?u=john",
            email: "john@example.com",
            phone: "+91 90123 45678",
            location: "Mumbai, Maharashtra",
            role: "User",
            status: "Active",
            joined: "Feb 2024",
            totalBookings: 5,
        },
        {
            id: 2,
            name: "Sarah Smith",
            image: "https://i.pravatar.cc/150?u=sarah",
            email: "sarah@example.com",
            phone: "+91 91234 56789",
            location: "Delhi, India",
            role: "User",
            status: "Active",
            joined: "Mar 2024",
            totalBookings: 12,
        },
        {
            id: 3,
            name: "Krupali Admin",
            image: "https://i.pravatar.cc/150?u=admin",
            email: "admin@autox.com",
            phone: "+91 98765 43210",
            location: "Surat, Gujarat",
            role: "Admin",
            status: "Active",
            joined: "Jan 2024",
            totalBookings: 0,
        },
    ]);

    // Mock Data for My Bookings (User's own)
    const [myBookings] = useState([
        {
            id: "#BK-1001",
            car: "BMW 228i Gran Coupe",
            status: "Upcoming",
            pickupDate: "Mar 30, 2026",
            returnDate: "Apr 02, 2026",
            total: "1800",
            location: "Surat, Gujarat",
            image:
                "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=600",
            fuel: "Petrol",
            transmission: "Automatic",
            seats: "5 People",
            time: "10:00 AM",
        },
    ]);

    const handleViewDetails = (booking) => {
        // Find full car details from carsData to get specs (Fuel, Transmission, etc.)
        const carId = booking.car?._id || booking.car;
        const fullCar = carsData?.find((c) => c._id === carId);

        console.log("Selected Booking:", booking);
        console.log("Enriched Car Data:", fullCar);

        setSelectedBooking({
            ...booking,
            car: fullCar || booking.car,
        });
        setIsBookingModalOpen(true);
    };

    const handleViewUser = (user) => {
        setSelectedUser({
            ...user,
            name: `${user.firstname} ${user.lastname}`,
            image: user.img,
            joined: new Date(user.createdAt).toLocaleDateString(),
        });
        setIsUserModalOpen(true);
    };

    const handleUpdateBookingStatus = async (id, newStatus) => {
        try {
            await updateBookingStatus({ id, status: newStatus }).unwrap();
            toast.success("Booking status updated!");
            refetchAllBookings();
            if (selectedBooking && selectedBooking._id === id) {
                setSelectedBooking({ ...selectedBooking, status: newStatus });
            }
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const handleRatingSubmit = async (ratingData) => {
        await createOrUpdateRating(ratingData).unwrap();
    };

    // Check if booking has been rated
    const hasBookingRating = (bookingId) => {
        // This will be checked in the component itself
        return false; // We'll handle this in StarRating component
    };

    const handleLogout = () => {
        dispatch(logout());
        setIsLogoutModalOpen(false);
        navigate("/"); // Redirect to home after logout
    };



    const handleTabChange = (tab) => {
        setActiveTab(tab);
        localStorage.setItem("profileActiveTab", tab);
        setShowAddCarForm(false);
        setSubPage(null);
        setEditingCar(null);
        resetCarForm();
    };

    const resetCarForm = () => {
        setCarFormData({
            name: "",
            brand: "",
            category: "Sedan",
            pricePerDay: "",
            pricePerHour: "",
            description: "",
            image: "",
            specs: {
                acceleration: "",
                transmission: "",
                seating: "",
                fuel: "",
            },
            features: [],
            isAvailable: true,
        });
        setMainImage(null);
        setImagePreview("");
        setExistingThumbs([]);
        setNewThumbFiles([]);
        setNewThumbPreviews([]);
        setEditingCar(null);
    };

    const handleEditCar = (car) => {
        console.log("Editing car:", car);
        setEditingCar(car);
        setCarFormData({
            name: car.name || "",
            brand: car.brand?._id || "",
            category: car.category || "Sedan",
            pricePerDay: car.pricePerDay || "",
            pricePerHour: car.pricePerHour || "",
            description: car.description || "",
            image: car.image || "",
            specs: car.specs || {
                acceleration: "",
                transmission: "",
                seating: "",
                fuel: "",
            },
            features: car.features || [],
            isAvailable: car.isAvailable !== undefined ? car.isAvailable : true,
        });
        setImagePreview(car.image);
        setExistingThumbs(car.thumbs || []);
        setNewThumbFiles([]);
        setNewThumbPreviews([]);
        setShowAddCarForm(true);
        setSubPage("Update Car");
    };

    const handleDeleteCar = (id) => {
        setDeleteId(id);
        setDeleteType("car");
        setIsDeleteModalOpen(true);
    };

    const handleDeleteUser = (id) => {
        setDeleteId(id);
        setDeleteType("user");
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            if (deleteType === "car") {
                await deleteCar(deleteId).unwrap();
                toast.success("Car deleted successfully");
                refetchCars();
            } else if (deleteType === "user") {
                await deleteUser(deleteId).unwrap();
                toast.success("User deleted successfully");
                refetchUsers();
            }
            setIsDeleteModalOpen(false);
            setDeleteId(null);
            setDeleteType(null);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
            setIsDeleteModalOpen(false);
        }
    };

    const handleSaveCar = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", carFormData.name);
            formData.append("brand", carFormData.brand);
            formData.append("category", carFormData.category);
            formData.append("pricePerDay", carFormData.pricePerDay);
            formData.append("pricePerHour", carFormData.pricePerHour);
            formData.append("description", carFormData.description);
            formData.append("isAvailable", carFormData.isAvailable);
            formData.append("specs", JSON.stringify(carFormData.specs));
            formData.append("features", JSON.stringify(carFormData.features));

            // Append main image if it's a file
            if (mainImage) {
                formData.append("image", mainImage);
            }

            // Send existing thumbs as a JSON string for update logic
            formData.append("existingThumbs", JSON.stringify(existingThumbs));

            // Append new thumbnail files
            if (newThumbFiles.length > 0) {
                newThumbFiles.forEach((file) => {
                    formData.append("thumbs", file);
                });
            }

            if (editingCar) {
                await updateCar({
                    id: editingCar._id,
                    formData,
                }).unwrap();
                toast.success("Car updated successfully");
            } else {
                await createCar(formData).unwrap();
                toast.success("Car added successfully");
            }
            setShowAddCarForm(false);
            setEditingCar(null);
            resetCarForm();
            refetchCars();
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const handleCarImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMainImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setCarFormData((prev) => ({
                    ...prev,
                    image: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCarThumbsUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setNewThumbFiles([...newThumbFiles, ...files]);

            files.forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setNewThumbPreviews((prev) => [...prev, reader.result]);
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

    return (
        <div className="profile_dark_wrapper">
            <div className="container-fluid">
                {/* Breadcrumb */}
                <div className="profile_v3_breadcrumb">
                    <Link to="/">Home</Link> <FaChevronRight size={10} />
                    <span
                        className="breadcrumb_link"
                        onClick={() => handleTabChange(user.role === 'admin' ? 'dashboard' : 'profile')}
                        style={{ cursor: 'pointer' }}
                    >
                        My Account
                    </span> <FaChevronRight size={10} />
                    <span
                        className={subPage ? "breadcrumb_link" : "active"}
                        onClick={() => subPage && setSubPage(null)}
                        style={{ cursor: subPage ? 'pointer' : 'default' }}
                    >
                        {activeTab === "profile"
                            ? "My Profile"
                            : activeTab === "dashboard"
                                ? "Admin Dashboard"
                                : activeTab === "my_bookings"
                                    ? "My Bookings"
                                    : activeTab === "change_password"
                                        ? "Change Password"
                                        : activeTab === "manage_cars"
                                            ? "Manage Cars"
                                            : activeTab === "manage_bookings"
                                                ? "Manage Bookings"
                                                : activeTab === "manage_users"
                                                    ? "Manage Users"
                                                    : activeTab === "manage_offers"
                                                        ? "Manage Offers"
                                                        : activeTab === "manage_brands"
                                                            ? "Manage Brands"
                                                            : activeTab === "manage_contacts"
                                                                ? "Manage Contact"
                                                                : activeTab}
                    </span>
                    {subPage && (
                        <>
                            <FaChevronRight size={10} />
                            <span className="active">{subPage}</span>
                        </>
                    )}
                </div>

                <div className="profile_v3_main_layout">
                    {/* Left Sidebar */}
                    <aside className="profile_dark_sidebar">
                        <div className="profile_user_mini">
                            <div className="mini_avatar">
                                {user.image ? (
                                    <img
                                        src={user.image}
                                        alt={user.name}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                        }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = `https://ui-avatars.com/api/?name=${user.name}&background=dd6f27&color=fff`;
                                        }}
                                    />
                                ) : (
                                    user?.name?.charAt(0)
                                )}
                            </div>
                            <div className="mini_info">
                                <h4>{user.name}</h4>
                                <p>{user.email}</p>
                            </div>
                        </div>
                        <nav className="profile_v3_nav">
                            <button
                                className={`profile_v3_nav_item ${activeTab === "profile" ? "active" : ""}`}
                                onClick={() => handleTabChange("profile")}
                            >
                                <FaUser /> <span>My Profile</span>
                            </button>
                            <button
                                className={`profile_v3_nav_item ${activeTab === "my_bookings" ? "active" : ""}`}
                                onClick={() => handleTabChange("my_bookings")}
                            >
                                <FaHistory /> <span>My Bookings</span>
                            </button>
                            <button
                                className={`profile_v3_nav_item ${activeTab === "change_password" ? "active" : ""}`}
                                onClick={() => handleTabChange("change_password")}
                            >
                                <FaLock /> <span>Change Password</span>
                            </button>

                            {/* Admin Options */}
                            {user.role === "admin" && (
                                <>
                                    <div className="profile_v3_nav_divider">Admin Controls</div>
                                    <button
                                        className={`profile_v3_nav_item ${activeTab === "dashboard" ? "active" : ""}`}
                                        onClick={() => handleTabChange("dashboard")}
                                    >
                                        <FaTachometerAlt /> <span>Dashboard</span>
                                    </button>
                                    <button
                                        className={`profile_v3_nav_item ${activeTab === "manage_brands" ? "active" : ""}`}
                                        onClick={() => handleTabChange("manage_brands")}
                                    >
                                        <FaShieldAlt /> <span>Manage Brands</span>
                                    </button>
                                    <button
                                        className={`profile_v3_nav_item ${activeTab === "manage_cars" ? "active" : ""}`}
                                        onClick={() => handleTabChange("manage_cars")}
                                    >
                                        <FaCar /> <span>Manage Cars</span>
                                    </button>
                                    <button
                                        className={`profile_v3_nav_item ${activeTab === "manage_bookings" ? "active" : ""}`}
                                        onClick={() => handleTabChange("manage_bookings")}
                                    >
                                        <FaCalendarCheck /> <span>Manage Bookings</span>
                                    </button>
                                    <button
                                        className={`profile_v3_nav_item ${activeTab === "manage_users" ? "active" : ""}`}
                                        onClick={() => handleTabChange("manage_users")}
                                    >
                                        <FaUsers /> <span>Manage Users</span>
                                    </button>

                                    <button
                                        className={`profile_v3_nav_item ${activeTab === "manage_contacts" ? "active" : ""}`}
                                        onClick={() => handleTabChange("manage_contacts")}
                                    >
                                        <FaEnvelope /> <span>Manage Contacts</span>
                                    </button>
                                </>
                            )}

                            <button
                                className="profile_v3_nav_item logout"
                                onClick={() => setIsLogoutModalOpen(true)}
                            >
                                <FaSignOutAlt /> <span>Logout</span>
                            </button>
                        </nav>
                    </aside>

                    {/* Right Content Area */}
                    <main className="profile_dark_content_area">
                        {activeTab === "profile" && (
                            <div className="profile_dark_card">
                                <div
                                    className="card_header_modern"
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <div>
                                        <h3>Account Settings</h3>
                                        <p>Manage your personal information and preferences.</p>
                                    </div>
                                    <button
                                        className="btn-icon edit profile_dark_save_btn z_edit_btn"
                                        style={{
                                            fontSize: "1rem",
                                            padding: "10px",
                                            fontWeight: "500",
                                        }}
                                        onClick={() => setIsEditingProfile(!isEditingProfile)}
                                    >
                                        Edit Profile
                                    </button>
                                </div>

                                <div
                                    className="profile_v3_avatar_section"
                                    style={{ textAlign: "center", marginBottom: "30px" }}
                                >
                                    <div
                                        className="profile_v3_avatar_wrapper"
                                        style={{ position: "relative", display: "inline-block" }}
                                    >
                                        <div
                                            className="profile_v3_main_avatar"
                                            style={{
                                                width: "130px",
                                                height: "130px",
                                                borderRadius: "50%",
                                                overflow: "hidden",
                                                border: "4px solid var(--x-primary)",
                                                margin: "0 auto",
                                                boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                                                background: "#111",
                                            }}
                                        >
                                            {profileFormData.preview || profileFormData.image ? (
                                                <img
                                                    src={profileFormData.preview || profileFormData.image}
                                                    alt="Profile"
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        background: "var(--x-border)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontSize: "3.5rem",
                                                        color: "var(--x-primary)",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {user?.name?.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        {isEditingProfile && (
                                            <label
                                                htmlFor="profile-image-upload"
                                                className="profile_v3_avatar_edit_icon"
                                                style={{
                                                    position: "absolute",
                                                    bottom: "5px",
                                                    right: "5px",
                                                    background: "var(--x-primary)",
                                                    color: "white",
                                                    width: "35px",
                                                    height: "35px",
                                                    borderRadius: "50%",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    border: "3px solid #1a1a1a",
                                                    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                                                    transition: "all 0.2s ease",
                                                }}
                                            >
                                                <FaEdit size={16} />
                                                <input
                                                    id="profile-image-upload"
                                                    type="file"
                                                    name="image"
                                                    accept="image/*"
                                                    style={{ display: "none" }}
                                                    onChange={handleProfileChange}
                                                />
                                            </label>
                                        )}
                                    </div>
                                    <h4 style={{ marginTop: "15px", color: "var(--x-text)" }}>
                                        {user.name}
                                    </h4>
                                    <p style={{ color: "var(--x-grey)", fontSize: "0.9rem" }}>
                                        {user.role.toUpperCase()}
                                    </p>
                                </div>

                                <div className="profile_v3_info_grid">
                                    <div className="profile_dark_field">
                                        <label>First Name</label>
                                        <input
                                            type="text"
                                            name="firstname"
                                            value={profileFormData.firstname}
                                            onChange={(e) => {
                                                let value = e.target.value;

                                                // Allow only letters
                                                value = value.replace(/[^A-Za-z]/g, "");

                                                handleProfileChange({
                                                    target: { name: "firstname", value }
                                                });
                                            }}
                                            readOnly={!isEditingProfile}
                                            style={{
                                                cursor: isEditingProfile ? "text" : "not-allowed",
                                            }}
                                        />
                                    </div>

                                    <div className="profile_dark_field">
                                        <label>Last Name</label>
                                        <input
                                            type="text"
                                            name="lastname"
                                            value={profileFormData.lastname}
                                            onChange={(e) => {
                                                let value = e.target.value;

                                                // Allow only letters
                                                value = value.replace(/[^A-Za-z]/g, "");

                                                handleProfileChange({
                                                    target: { name: "lastname", value }
                                                });
                                            }}
                                            readOnly={!isEditingProfile}
                                            style={{
                                                cursor: isEditingProfile ? "text" : "not-allowed",
                                            }}
                                        />
                                    </div>

                                    <div className="profile_dark_field">
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profileFormData.email}
                                            onChange={handleProfileChange}
                                            readOnly={!isEditingProfile}
                                            style={{
                                                cursor: isEditingProfile ? "text" : "not-allowed",
                                            }}
                                        />
                                    </div>
                                    <div className="profile_dark_field">
                                        <label>Phone Number</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={profileFormData.phone}
                                            onChange={(e) => {
                                                let value = e.target.value;

                                                // Allow only digits
                                                value = value.replace(/\D/g, "");

                                                // Limit to 10 digits
                                                if (value.length > 10) {
                                                    value = value.slice(0, 10);
                                                }

                                                handleProfileChange({
                                                    target: {
                                                        name: "phone",
                                                        value: value
                                                    }
                                                });
                                            }}
                                            readOnly={!isEditingProfile}
                                            maxLength={10}
                                            style={{
                                                cursor: isEditingProfile ? "text" : "not-allowed",
                                            }}
                                        />
                                    </div>
                                    <div className="profile_dark_field">
                                        <label>Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={profileFormData.location}
                                            onChange={handleProfileChange}
                                            readOnly={!isEditingProfile}
                                            style={{
                                                cursor: isEditingProfile ? "text" : "not-allowed",
                                            }}
                                        />
                                    </div>
                                </div>
                                {isEditingProfile && (
                                    <button
                                        className="profile_dark_save_btn"
                                        onClick={handleUpdateProfile}
                                    >
                                        Update Profile
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Admin: Dashboard Section */}
                        {activeTab === "dashboard" && (
                            <div className="admin_dashboard_v3">
                                <div className="card_header_modern">
                                    <div className="admin_header_flex">
                                        <div>
                                            <h3>Admin Overview</h3>
                                            <p>
                                                Welcome back, {user.name.split(" ")[0]}! Here's what's
                                                happening with your business today.
                                            </p>
                                        </div>
                                        <div className="admin_header_date">
                                            <FaClock />{" "}
                                            <span>
                                                {new Date().toLocaleDateString("en-US", {
                                                    month: "long",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="admin_stats_v3_grid">
                                    <div className="admin_stat_card_v3">
                                        <div className="admin_stat_main">
                                            <div className="admin_stat_icon_v3">
                                                <FaCar />
                                            </div>
                                            <div className="admin_stat_data">
                                                <h3>{carsData?.length || 0}</h3>
                                                <p>Total Fleet</p>
                                            </div>
                                        </div>
                                        <div className="admin_stat_footer">
                                            <span className="trend_up">+ 12%</span>
                                            <span>from last month</span>
                                        </div>
                                    </div>
                                    <div className="admin_stat_card_v3">
                                        <div className="admin_stat_main">
                                            <div className="admin_stat_icon_v3">
                                                <FaCalendarCheck />
                                            </div>
                                            <div className="admin_stat_data">
                                                <h3>{allBookingsData?.filter(b => b.status === 'approved')?.length || 0}</h3>
                                                <p>Active Rentals</p>
                                            </div>
                                        </div>
                                        <div className="admin_stat_footer">
                                            <span className="trend_up">+ 8%</span>
                                            <span>new bookings today</span>
                                        </div>
                                    </div>
                                    <div className="admin_stat_card_v3">
                                        <div className="admin_stat_main">
                                            <div className="admin_stat_icon_v3">
                                                <FaMoneyBillWave />
                                            </div>
                                            <div className="admin_stat_data">
                                                <h3>${(allBookingsData?.reduce((sum, b) => sum + (b.totalAmount || 0), 0) / 1000).toFixed(1)}k</h3>
                                                <p>Revenue</p>
                                            </div>
                                        </div>
                                        <div className="admin_stat_footer">
                                            <span className="trend_up">+ 20%</span>
                                            <span>Net Profit</span>
                                        </div>
                                    </div>
                                    <div className="admin_stat_card_v3">
                                        <div className="admin_stat_main">
                                            <div className="admin_stat_icon_v3">
                                                <FaUsers />
                                            </div>
                                            <div className="admin_stat_data">
                                                <h3>{usersData?.length || 0}</h3>
                                                <p>Customers</p>
                                            </div>
                                        </div>
                                        <div className="admin_stat_footer">
                                            <span className="trend_up">+ 5%</span>
                                            <span>Active Users</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="admin_dashboard_lower_grid">
                                    <div className="profile_dark_card dashboard_main_table">
                                        <div className="admin_header_flex">
                                            <div>
                                                <h3>Recent Bookings</h3>
                                                <p>Latest customer activity</p>
                                            </div>
                                            <button
                                                className="admin_view_all_dark"
                                                onClick={() => setActiveTab("manage_bookings")}
                                            >
                                                View All <FaArrowRight size={12} />
                                            </button>
                                        </div>
                                        <div className="admin_table_responsive_v3">
                                            <table className="admin_table_dark">
                                                <thead>
                                                    <tr>
                                                        <th>Booking</th>
                                                        <th>Customer</th>
                                                        <th>Car</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {isAllBookingsLoading ? (
                                                        <tr>
                                                            <td colSpan="4">Loading bookings...</td>
                                                        </tr>
                                                    ) : allBookingsData?.slice(0, 5).reverse().map((booking) => (
                                                        <tr key={booking._id}>
                                                            <td>
                                                                <span className="booking_id_pill">{booking._id.slice(-6).toUpperCase()}</span>
                                                            </td>
                                                            <td>
                                                                <div className="customer_cell">
                                                                    {booking.user?.img ? (
                                                                        <img
                                                                            src={booking.user.img}
                                                                            alt={`${booking.user.firstname} ${booking.user.lastname}`}
                                                                            className="cell_avatar"
                                                                            style={{
                                                                                borderRadius: "50%",
                                                                                objectFit: "cover",
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <div className="cell_avatar">
                                                                            {booking.user?.firstname?.charAt(0)}
                                                                        </div>
                                                                    )}
                                                                    <span>{booking.user?.firstname} {booking.user?.lastname}</span>
                                                                </div>
                                                            </td>
                                                            <td>{booking.car?.name}</td>
                                                            <td>
                                                                <span
                                                                    className={`status_badge_v2 status_${booking.status?.toLowerCase()}`}
                                                                >
                                                                    {booking.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="admin_quick_actions">
                                        <div className="profile_dark_card">
                                            <h3>Quick Actions</h3>
                                            <div className="quick_actions_list">
                                                <button onClick={() => setActiveTab("manage_cars")}>
                                                    <div className="action_icon">
                                                        <FaPlus />
                                                    </div>
                                                    <div className="action_text">
                                                        <span>Add New Car</span>
                                                        <p>Expand your fleet</p>
                                                    </div>
                                                </button>
                                                <button onClick={() => setActiveTab("manage_bookings")}>
                                                    <div className="action_icon">
                                                        <FaCheck />
                                                    </div>
                                                    <div className="action_text">
                                                        <span>Approve Bookings</span>
                                                        <p>Review pending requests</p>
                                                    </div>
                                                </button>
                                                <button onClick={() => setActiveTab("manage_users")}>
                                                    <div className="action_icon">
                                                        <FaShieldAlt />
                                                    </div>
                                                    <div className="action_text">
                                                        <span>Access Control</span>
                                                        <p>Manage permissions</p>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "change_password" && (
                            <div className="profile_dark_card">
                                <div className="card_header_modern">
                                    <h3>Security</h3>
                                    <p>Update your password to keep your account secure.</p>
                                </div>
                                <form
                                    className="profile_v3_password_form"
                                    onSubmit={handleResetPassword}
                                >
                                    <div className="profile_dark_field password_field_wrapper">
                                        <label>Old Password</label>
                                        <div className="password_input_container">
                                            <input
                                                type={showOldPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={oldPassword}
                                                onChange={(e) => setOldPassword(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                className="password_toggle_btn"
                                                onClick={() => setShowOldPassword(!showOldPassword)}
                                            >
                                                {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="profile_dark_field password_field_wrapper">
                                        <label>New Password</label>
                                        <div className="password_input_container">
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="password_toggle_btn"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                            >
                                                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="profile_dark_field password_field_wrapper">
                                        <label>Confirm Password</label>
                                        <div className="password_input_container">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="password_toggle_btn"
                                                onClick={() =>
                                                    setShowConfirmPassword(!showConfirmPassword)
                                                }
                                            >
                                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="profile_v3_form_actions">
                                        <button
                                            type="button"
                                            className="profile_v3_cancel_btn_dark"
                                            onClick={() => {
                                                setOldPassword("");
                                                setNewPassword("");
                                                setConfirmPassword("");
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="profile_dark_save_btn">
                                            Reset Password
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Admin: Manage Cars Section */}
                        {activeTab === "manage_cars" && (
                            <div className="profile_dark_card">
                                {!showAddCarForm ? (
                                    <>
                                        <div className="admin_header_flex">
                                            <div className="card_header_modern">
                                                <h3>Manage Fleet</h3>
                                                <p>Add, edit or remove vehicles from your fleet.</p>
                                            </div>
                                            <button
                                                className="admin_btn_primary_sm"
                                                onClick={() => {
                                                    setShowAddCarForm(true);
                                                    setSubPage("Add Car");
                                                    setEditingCar(null);
                                                    resetCarForm();
                                                }}
                                            >
                                                <FaPlus /> Add Car
                                            </button>
                                        </div>
                                        <div className="admin_table_responsive_v3">
                                            <table className="admin_table_dark">
                                                <thead>
                                                    <tr>
                                                        <th>Image</th>
                                                        <th>Car</th>
                                                        <th>Brand</th>
                                                        <th>Price</th>
                                                        <th>Status</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {isCarsLoading ? (
                                                        <tr>
                                                            <td
                                                                colSpan="6"
                                                                style={{ textAlign: "center", padding: "20px" }}
                                                            >
                                                                Loading cars...
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        carsData?.map((car) => (
                                                            <tr key={car._id}>
                                                                <td>
                                                                    <div
                                                                        style={{
                                                                            width: "60px",
                                                                            height: "40px",
                                                                            background: "#222",
                                                                            borderRadius: "4px",
                                                                            overflow: "hidden",
                                                                        }}
                                                                    >
                                                                        <img
                                                                            src={car.image}
                                                                            alt={car.name}
                                                                            style={{
                                                                                width: "100%",
                                                                                height: "100%",
                                                                                objectFit: "cover",
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <strong>{car.name}</strong>
                                                                </td>
                                                                <td>{car.brand?.name || "N/A"}</td>
                                                                <td>${car.pricePerDay}</td>
                                                                <td>
                                                                    <span
                                                                        className={`status_badge_v2 status_${car.isAvailable ? "available" : "rented"}`}
                                                                    >
                                                                        {car.isAvailable ? "Available" : "Rented"}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <div className="admin_action_btns_v2">
                                                                        <button
                                                                            className="btn-icon edit"
                                                                            onClick={() => handleEditCar(car)}
                                                                        >
                                                                            <FaEdit />
                                                                        </button>
                                                                        <button
                                                                            className="btn-icon delete"
                                                                            onClick={() => handleDeleteCar(car._id)}
                                                                        >
                                                                            <FaTrash />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                ) : (
                                    <div className="admin_form_container_v3">
                                        <div className="card_header_modern">
                                            <h3>{editingCar ? "Edit Vehicle" : "Add New Vehicle"}</h3>
                                            <p>
                                                {editingCar
                                                    ? "Update the details of your vehicle."
                                                    : "Fill in the details to add a new car to your fleet."}
                                            </p>
                                        </div>
                                        <form
                                            className="admin_add_car_form_v3"
                                            onSubmit={handleSaveCar}
                                        >
                                            <div className="profile_v3_info_grid">
                                                <div className="profile_dark_field">
                                                    <label>Car Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. BMW 228i Gran Coupe"
                                                        value={carFormData.name}
                                                        onChange={(e) =>
                                                            setCarFormData({
                                                                ...carFormData,
                                                                name: e.target.value,
                                                            })
                                                        }
                                                        required
                                                    />
                                                </div>
                                                <div className="profile_dark_field">
                                                    <label>Brand</label>
                                                    <select
                                                        className="admin_form_select_v3"
                                                        value={carFormData.brand}
                                                        onChange={(e) =>
                                                            setCarFormData({
                                                                ...carFormData,
                                                                brand: e.target.value,
                                                            })
                                                        }
                                                        required
                                                    >
                                                        <option value="">Select Brand</option>
                                                        {brandsData?.map((brand) => (
                                                            <option key={brand._id} value={brand._id}>
                                                                {brand.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="profile_dark_field">
                                                    <label>Category</label>
                                                    <select
                                                        className="admin_form_select_v3"
                                                        value={carFormData.category}
                                                        onChange={(e) =>
                                                            setCarFormData({
                                                                ...carFormData,
                                                                category: e.target.value,
                                                            })
                                                        }
                                                    >
                                                        <option value="Luxury">Luxury</option>
                                                        <option value="Exotic">Exotic</option>
                                                        <option value="Sports">Sports</option>
                                                        <option value="Supercar">Supercar</option>
                                                        <option value="Hypercar">Hypercar</option>
                                                        <option value="Sedan">Sedan</option>
                                                        <option value="Hatchback">Hatchback</option>
                                                        <option value="SUV">SUV</option>
                                                        <option value="MUV">MUV</option>
                                                        <option value="Coupe">Coupe</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                                <div className="profile_dark_field">
                                                    <label>Price per Day ($)</label>
                                                    <input
                                                        type="number"
                                                        placeholder="e.g. 600"
                                                        value={carFormData.pricePerDay}
                                                        onChange={(e) =>
                                                            setCarFormData({
                                                                ...carFormData,
                                                                pricePerDay: e.target.value,
                                                            })
                                                        }
                                                        required
                                                    />
                                                </div>
                                                <div className="profile_dark_field">
                                                    <label>Price per Hour ($)</label>
                                                    <input
                                                        type="number"
                                                        placeholder="e.g. 50"
                                                        value={carFormData.pricePerHour}
                                                        onChange={(e) =>
                                                            setCarFormData({
                                                                ...carFormData,
                                                                pricePerHour: e.target.value,
                                                            })
                                                        }
                                                        required
                                                    />
                                                </div>
                                                <div className="profile_dark_field">
                                                    <label>Car Main Image</label>
                                                    <div
                                                        className="brand_logo_upload_section"
                                                        style={{
                                                            border: "2px dashed var(--x-border)",
                                                            borderRadius: "12px",
                                                            padding: "20px",
                                                            textAlign: "center",
                                                            background: "rgba(255,255,255,0.02)",
                                                            transition: "all 0.3s ease",
                                                        }}
                                                    >
                                                        <div
                                                            className="car_main_preview_container"
                                                            style={{
                                                                width: "100%",
                                                                height: "150px",
                                                                background: "#111",
                                                                borderRadius: "8px",
                                                                margin: "0 auto 15px",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                overflow: "hidden",
                                                                border: "1px solid var(--x-border)",
                                                            }}
                                                        >
                                                            {imagePreview || carFormData.image ? (
                                                                <img
                                                                    src={imagePreview || carFormData.image}
                                                                    alt="Preview"
                                                                    style={{
                                                                        width: "100%",
                                                                        height: "100%",
                                                                        objectFit: "contain",
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div style={{ textAlign: "center" }}>
                                                                    <FaCar
                                                                        style={{
                                                                            fontSize: "40px",
                                                                            color: "var(--x-grey)",
                                                                            marginBottom: "10px",
                                                                        }}
                                                                    />
                                                                    <p
                                                                        style={{
                                                                            color: "var(--x-grey)",
                                                                            fontSize: "0.8rem",
                                                                        }}
                                                                    >
                                                                        No image selected
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <label
                                                            htmlFor="car-image-upload"
                                                            className="admin_btn_primary_sm"
                                                            style={{
                                                                cursor: "pointer",
                                                                display: "inline-flex",
                                                                alignItems: "center",
                                                                gap: "8px",
                                                            }}
                                                        >
                                                            <FaUpload />{" "}
                                                            {carFormData.image
                                                                ? "Change Main Image"
                                                                : "Upload Main Image"}
                                                            <input
                                                                id="car-image-upload"
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={handleCarImageUpload}
                                                                style={{ display: "none" }}
                                                                required={!editingCar}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form_section_divider">Vehicle Specs</div>
                                            <div className="profile_v3_info_grid">
                                                <div className="profile_dark_field">
                                                    <label>0-100 KMPH (in sec)</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. 4.5s"
                                                        value={carFormData.specs.acceleration}
                                                        onChange={(e) =>
                                                            setCarFormData({
                                                                ...carFormData,
                                                                specs: {
                                                                    ...carFormData.specs,
                                                                    acceleration: e.target.value,
                                                                },
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="profile_dark_field">
                                                    <label>Transmission</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Automatic"
                                                        value={carFormData.specs.transmission}
                                                        onChange={(e) =>
                                                            setCarFormData({
                                                                ...carFormData,
                                                                specs: {
                                                                    ...carFormData.specs,
                                                                    transmission: e.target.value,
                                                                },
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="profile_dark_field">
                                                    <label>Seating Capacity</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. 5 People"
                                                        value={carFormData.specs.seating}
                                                        onChange={(e) =>
                                                            setCarFormData({
                                                                ...carFormData,
                                                                specs: {
                                                                    ...carFormData.specs,
                                                                    seating: e.target.value,
                                                                },
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="profile_dark_field">
                                                    <label>Fuel Type</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Petrol"
                                                        value={carFormData.specs.fuel}
                                                        onChange={(e) =>
                                                            setCarFormData({
                                                                ...carFormData,
                                                                specs: {
                                                                    ...carFormData.specs,
                                                                    fuel: e.target.value,
                                                                },
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="profile_dark_field">
                                                    <label>Availability</label>
                                                    <select
                                                        className="admin_form_select_v3"
                                                        value={carFormData.isAvailable}
                                                        onChange={(e) =>
                                                            setCarFormData({
                                                                ...carFormData,
                                                                isAvailable: e.target.value === "true",
                                                            })
                                                        }
                                                    >
                                                        <option value="true">Available</option>
                                                        <option value="false">Rented</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="form_section_divider">
                                                Features & Gallery
                                            </div>
                                            <div className="profile_v3_info_grid">
                                                <div className="profile_dark_field">
                                                    <label>Features (comma-separated)</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. GPS, Sunroof, 360 Camera"
                                                        value={carFormData.features.join(", ")}
                                                        onChange={(e) =>
                                                            setCarFormData({
                                                                ...carFormData,
                                                                features: e.target.value
                                                                    .split(",")
                                                                    .map((f) => f.trim()),
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="profile_dark_field">
                                                    <label>Thumbnail Gallery</label>
                                                    <div
                                                        className="brand_logo_upload_section"
                                                        style={{
                                                            border: "2px dashed var(--x-border)",
                                                            borderRadius: "12px",
                                                            padding: "20px",
                                                            background: "rgba(255,255,255,0.02)",
                                                        }}
                                                    >
                                                        <div
                                                            className="thumbs_preview_grid"
                                                            style={{
                                                                display: "grid",
                                                                gridTemplateColumns:
                                                                    "repeat(auto-fill, minmax(80px, 1fr))",
                                                                gap: "12px",
                                                                marginBottom: "15px",
                                                            }}
                                                        >
                                                            {/* Render Existing Thumbnails */}
                                                            {existingThumbs.map((url, index) => (
                                                                <div
                                                                    key={`existing-${index}`}
                                                                    className="thumb_preview_wrapper"
                                                                    style={{
                                                                        position: "relative",
                                                                        height: "60px",
                                                                        background: "#111",
                                                                        borderRadius: "8px",
                                                                        overflow: "hidden",
                                                                        border: "1px solid var(--x-border)",
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={url}
                                                                        alt={`Existing Thumb ${index}`}
                                                                        style={{
                                                                            width: "100%",
                                                                            height: "100%",
                                                                            objectFit: "cover",
                                                                        }}
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        className="remove_thumb_btn"
                                                                        onClick={() => removeExistingThumb(index)}
                                                                        style={{
                                                                            position: "absolute",
                                                                            top: "4px",
                                                                            right: "4px",
                                                                            background: "var(--x-primary)",
                                                                            border: "none",
                                                                            borderRadius: "50%",
                                                                            width: "18px",
                                                                            height: "18px",
                                                                            display: "flex",
                                                                            alignItems: "center",
                                                                            justifyContent: "center",
                                                                            color: "white",
                                                                            fontSize: "10px",
                                                                            cursor: "pointer",
                                                                            boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                                                                        }}
                                                                    >
                                                                        <FaTimes />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                            {/* Render New Thumbnail Previews */}
                                                            {newThumbPreviews.map((prev, index) => (
                                                                <div
                                                                    key={`new-${index}`}
                                                                    className="thumb_preview_wrapper"
                                                                    style={{
                                                                        position: "relative",
                                                                        height: "60px",
                                                                        background: "#111",
                                                                        borderRadius: "8px",
                                                                        overflow: "hidden",
                                                                        border: "1px solid var(--x-border)",
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={prev}
                                                                        alt={`New Thumb ${index}`}
                                                                        style={{
                                                                            width: "100%",
                                                                            height: "100%",
                                                                            objectFit: "cover",
                                                                        }}
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        className="remove_thumb_btn"
                                                                        onClick={() => removeNewThumb(index)}
                                                                        style={{
                                                                            position: "absolute",
                                                                            top: "4px",
                                                                            right: "4px",
                                                                            background: "var(--x-primary)",
                                                                            border: "none",
                                                                            borderRadius: "50%",
                                                                            width: "18px",
                                                                            height: "18px",
                                                                            display: "flex",
                                                                            alignItems: "center",
                                                                            justifyContent: "center",
                                                                            color: "white",
                                                                            fontSize: "10px",
                                                                            cursor: "pointer",
                                                                            boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                                                                        }}
                                                                    >
                                                                        <FaTimes />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <label
                                                            htmlFor="car-thumbs-upload"
                                                            className="admin_btn_primary_sm"
                                                            style={{
                                                                cursor: "pointer",
                                                                display: "inline-flex",
                                                                alignItems: "center",
                                                                gap: "8px",
                                                            }}
                                                        >
                                                            <FaPlus /> Add More Thumbs
                                                            <input
                                                                id="car-thumbs-upload"
                                                                type="file"
                                                                accept="image/*"
                                                                multiple
                                                                onChange={handleCarThumbsUpload}
                                                                style={{ display: "none" }}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div
                                                className="profile_dark_field"
                                                style={{ marginTop: "20px" }}
                                            >
                                                <label>About this Vehicle (Description)</label>
                                                <textarea
                                                    className="admin_form_textarea_v3"
                                                    placeholder="Vehicle description..."
                                                    rows="4"
                                                    value={carFormData.description}
                                                    onChange={(e) =>
                                                        setCarFormData({
                                                            ...carFormData,
                                                            description: e.target.value,
                                                        })
                                                    }
                                                ></textarea>
                                            </div>

                                            <div className="profile_v3_form_actions">
                                                <button
                                                    type="button"
                                                    className="profile_v3_cancel_btn_dark"
                                                    onClick={() => {
                                                        setShowAddCarForm(false);
                                                        setEditingCar(null);
                                                        resetCarForm();
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                                <button type="submit" className="admin_btn_primary_sm">
                                                    {editingCar ? "Update Vehicle" : "Save Vehicle"}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "manage_brands" && (
                            // <div className="profile_dark_card">
                            <ManageBrands setSubPage={setSubPage} subPage={subPage} />
                            // </div>
                        )}


                        {activeTab === "manage_contacts" && (
                            // <div className="profile_dark_card">
                            <ManageContacts />
                            // </div>
                        )}

                        {/* Admin: Manage Bookings Section */}
                        {activeTab === "manage_bookings" && (
                            <div className="profile_dark_card">
                                <div className="card_header_modern">
                                    <h3>Manage Bookings</h3>
                                    <p>Review and manage all customer car reservations.</p>
                                </div>
                                <div className="admin_table_responsive_v3">
                                    <table className="admin_table_dark">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Customer</th>
                                                <th>Car</th>
                                                <th>Payment</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {isAllBookingsLoading ? (
                                                <tr>
                                                    <td colSpan="5">Loading bookings...</td>
                                                </tr>
                                            ) : currentBookings?.length > 0 ? (
                                                currentBookings?.map((booking) => (
                                                    <tr key={booking._id}>
                                                        <td>{booking._id.slice(-6).toUpperCase()}</td>
                                                        <td>
                                                            {booking.user?.firstname} {booking.user?.lastname}
                                                        </td>
                                                        <td>{booking.car?.name}</td>
                                                        <td>{booking.paymentStatus.toLowerCase()}</td>
                                                        <td>
                                                            <select
                                                                className={`status_badge_v2 status_${booking.status.toLowerCase()}`}
                                                                value={booking.status}
                                                                onChange={(e) =>
                                                                    handleUpdateBookingStatus(
                                                                        booking._id,
                                                                        e.target.value,
                                                                    )
                                                                }
                                                                style={{
                                                                    border: "none",
                                                                    outline: "none",
                                                                    cursor: "pointer",
                                                                    appearance: "none",
                                                                    textAlign: "center",
                                                                    width: "120px",
                                                                }}
                                                            >
                                                                <option value="pending">Pending</option>
                                                                <option value="approved">Approved</option>
                                                                <option value="cancelled">Cancelled</option>
                                                                <option value="completed">Completed</option>
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <div className="admin_action_btns_v2">
                                                                <button
                                                                    className="btn_view_dark"
                                                                    title="View Details"
                                                                    onClick={() => handleViewDetails(booking)}
                                                                >
                                                                    <FaEye />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5">No bookings found.</td>
                                                </tr>
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
                            </div>
                        )}

                        {activeTab === "my_bookings" && (
                            <div className="profile_dark_card">
                                <div className="card_header_modern">
                                    <h3>My Bookings</h3>
                                    <p>Track your current and past car rentals.</p>
                                </div>
                                {isMyBookingsLoading ? (
                                    <p>Loading your bookings...</p>
                                ) : currentmyBookings?.length > 0 ? (
                                    <div className="my_bookings_list_v3">
                                        {currentmyBookings?.slice().reverse().map((booking) => (
                                            <div key={booking._id} className="booking_card_v3">
                                                <div className="booking_img_box">
                                                    <img
                                                        src={booking.car?.image}
                                                        alt={booking.car?.name}
                                                    />
                                                    <span
                                                        className={`status_badge_v2 status_${booking.status.toLowerCase()}`}
                                                    >
                                                        {booking.status}
                                                    </span>
                                                </div>
                                                <div className="booking_info_box">
                                                    <div className="booking_main_info">
                                                        <div className="booking_car_name">
                                                            <h4>{booking.car?.name}</h4>
                                                            <span className="booking_id_pill">
                                                                {booking._id.slice(-6).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div className="booking_total_price">
                                                            <span className="label">Total Amount</span>
                                                            <span className="amount">
                                                                ${booking.totalAmount}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="booking_details_grid">
                                                        <div className="detail_item">
                                                            <FaCalendarCheck />
                                                            <div>
                                                                <label>Pickup Date</label>
                                                                <p>
                                                                    {new Date(
                                                                        booking.pickupDate,
                                                                    ).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="detail_item">
                                                            <FaCalendarCheck />
                                                            <div>
                                                                <label>Return Date</label>
                                                                <p>
                                                                    {booking.dropoffDate
                                                                        ? new Date(
                                                                            booking.dropoffDate,
                                                                        ).toLocaleDateString()
                                                                        : booking.returnDate
                                                                            ? new Date(
                                                                                booking.returnDate,
                                                                            ).toLocaleDateString()
                                                                            : "N/A"}
                                                                </p>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="booking_actions_v3">
                                                        <button
                                                            className="admin_btn_primary_sm"
                                                            onClick={() => handleViewDetails(booking)}
                                                        >
                                                            View Details
                                                        </button>
                                                        <StarRating
                                                            bookingId={booking._id}
                                                            carId={booking.car?._id || booking.car}
                                                            onRatingSubmit={handleRatingSubmit}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {totalBookingPages > 1 && (
                                            <div className="d_fleet_pagination">
                                                <div className="d_pagination_pills">
                                                    <button
                                                        className="d_pag_btn d_pag_btn--prev"
                                                        disabled={bookingPage === 1}
                                                        onClick={() => handleBookingPageChange(bookingPage - 1)}
                                                    >
                                                        <RiArrowLeftSLine size={24} />
                                                    </button>

                                                    <div className="d_pag_info">
                                                        {bookingPage} of {totalBookingPages}
                                                    </div>

                                                    <button
                                                        className="d_pag_btn d_pag_btn--next"
                                                        disabled={bookingPage === totalBookingPages}
                                                        onClick={() => handleBookingPageChange(bookingPage + 1)}
                                                    >
                                                        <RiArrowRightSLine size={24} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="empty_msg">
                                        You have no active bookings at the moment.
                                    </p>
                                )}
                            </div>
                        )}

                        {activeTab === "manage_users" && (
                            <div className="profile_dark_card">
                                <div className="admin_header_flex">
                                    <div className="card_header_modern">
                                        <h3>Manage Users</h3>
                                        <p>
                                            Control user access and permissions for your platform.
                                        </p>
                                    </div>
                                    {/* <button className="admin_btn_primary_sm"><FaPlus /> Add Admin</button> */}
                                </div>
                                <div className="admin_table_responsive_v3">
                                    <table className="admin_table_dark">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                                <th>Joined</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {isUsersLoading ? (
                                                <tr>
                                                    <td colSpan="5">Loading users...</td>
                                                </tr>
                                            ) : (
                                                currentUsers?.map((u) => (
                                                    <tr key={u._id}>
                                                        <td>
                                                            <div className="customer_cell">
                                                                {u.img ? (
                                                                    <img
                                                                        src={u.img}
                                                                        alt={u.firstname}
                                                                        className="cell_avatar"
                                                                        style={{
                                                                            borderRadius: "50%",
                                                                            objectFit: "cover",
                                                                        }}
                                                                        onError={(e) => {
                                                                            e.target.onerror = null;
                                                                            e.target.src = `https://ui-avatars.com/api/?name=${u.firstname}+${u.lastname}&background=dd6f27&color=fff`;
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <div className="cell_avatar">
                                                                        {u?.firstname?.charAt(0)}
                                                                    </div>
                                                                )}
                                                                <strong>
                                                                    {u.firstname} {u.lastname}
                                                                </strong>
                                                            </div>
                                                        </td>
                                                        <td>{u.email}</td>
                                                        <td>
                                                            <span
                                                                className={`status_badge_v2 status_${u.role.toLowerCase()}`}
                                                            >
                                                                {u.role}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {new Date(u.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td>
                                                            <div className="admin_action_btns_v2">
                                                                <button
                                                                    className="btn_view_dark"
                                                                    title="View User Details"
                                                                    onClick={() => handleViewUser(u)}
                                                                >
                                                                    <FaEye />
                                                                </button>
                                                                {u.role !== "admin" && (
                                                                    <button
                                                                        className="btn-icon delete"
                                                                        onClick={() => handleDeleteUser(u._id)}
                                                                    >
                                                                        <FaTrash />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                    {totalUserPages > 1 && (
                                        <div className="d_fleet_pagination">
                                            <div className="d_pagination_pills">
                                                <button
                                                    className="d_pag_btn d_pag_btn--prev"
                                                    disabled={userPage === 1}
                                                    onClick={() => handleUserPageChange(userPage - 1)}
                                                >
                                                    <RiArrowLeftSLine size={24} />
                                                </button>

                                                <div className="d_pag_info">
                                                    {userPage} of {totalUserPages}
                                                </div>

                                                <button
                                                    className="d_pag_btn d_pag_btn--next"
                                                    disabled={userPage === totalUserPages}
                                                    onClick={() => handleUserPageChange(userPage + 1)}
                                                >
                                                    <RiArrowRightSLine size={24} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Booking Details Modal */}
            {isBookingModalOpen && selectedBooking && (
                <div
                    className="profile_modal_overlay"
                    onClick={() => setIsBookingModalOpen(false)}
                >
                    <div
                        className="profile_modal_content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal_header_v3">
                            <h3>Booking Details</h3>
                            <button
                                className="modal_close_btn"
                                onClick={() => setIsBookingModalOpen(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className="modal_body_v3">
                            <div className="modal_car_info">
                                <img
                                    src={selectedBooking.car?.image}
                                    alt={selectedBooking.car?.name}
                                />
                                <div className="modal_car_meta">
                                    <h4>{selectedBooking.car?.name}</h4>
                                    <span className="booking_id_pill">
                                        {selectedBooking._id.slice(-6).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <div className="modal_details_grid">
                                <div className="modal_detail_item">
                                    <label>Customer Name</label>
                                    <p>
                                        {selectedBooking.user?.firstname}{" "}
                                        {selectedBooking.user?.lastname}
                                    </p>
                                </div>
                                <div className="modal_detail_item">
                                    <label>Status</label>
                                    <select
                                        className={`status_badge_v2 status_${selectedBooking.status.toLowerCase()}`}
                                        value={selectedBooking.status}
                                        onChange={(e) =>
                                            handleUpdateBookingStatus(
                                                selectedBooking._id,
                                                e.target.value,
                                            )
                                        }
                                        style={{
                                            border: "none",
                                            outline: "none",
                                            cursor: "pointer",
                                            appearance: "none",
                                            width: "110px",
                                        }}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                                <div className="modal_detail_item">
                                    <label>Total Price</label>
                                    <p className="modal_price">${selectedBooking.totalAmount}</p>
                                </div>
                                <div className="modal_detail_item">
                                    <label>Pickup Date</label>
                                    <p>
                                        {new Date(selectedBooking.pickupDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="modal_detail_item">
                                    <label>Return Date</label>
                                    <p>
                                        {selectedBooking.dropoffDate
                                            ? new Date(
                                                selectedBooking.dropoffDate,
                                            ).toLocaleDateString()
                                            : selectedBooking.returnDate
                                                ? new Date(
                                                    selectedBooking.returnDate,
                                                ).toLocaleDateString()
                                                : "N/A"}
                                    </p>
                                </div>
                                <div className="modal_detail_item">
                                    <label>Fuel Type</label>
                                    <p>{selectedBooking.car?.specs?.fuel || "N/A"}</p>
                                </div>
                                <div className="modal_detail_item">
                                    <label>Transmission</label>
                                    <p>{selectedBooking.car?.specs?.transmission || "N/A"}</p>
                                </div>
                                <div className="modal_detail_item">
                                    <label>Seating</label>
                                    <p>{selectedBooking.car?.specs?.seating || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                        <div className="modal_footer_v3">
                            <button
                                className="profile_dark_save_btn"
                                onClick={() => setIsBookingModalOpen(false)}
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* User Details Modal */}
            {isUserModalOpen && selectedUser && (
                <div
                    className="profile_modal_overlay"
                    onClick={() => setIsUserModalOpen(false)}
                >
                    <div
                        className="profile_modal_content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal_header_v3">
                            <h3>User Details</h3>
                            <button
                                className="modal_close_btn"
                                onClick={() => setIsUserModalOpen(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className="modal_body_v3">
                            <div className="modal_car_info">
                                {selectedUser.image ? (
                                    <img
                                        src={selectedUser.image}
                                        alt={selectedUser.name}
                                        className="mini_avatar"
                                        style={{
                                            width: "80px",
                                            height: "80px",
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                        }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = `https://ui-avatars.com/api/?name=${selectedUser.name}&background=dd6f27&color=fff`;
                                        }}
                                    />
                                ) : (
                                    <div
                                        className="mini_avatar"
                                        style={{ width: "80px", height: "80px", fontSize: "2rem" }}
                                    >
                                        {selectedUser?.name?.charAt(0)}
                                    </div>
                                )}
                                <div className="modal_car_meta">
                                    <h4>{selectedUser.name}</h4>
                                    <span
                                        className={`status_badge_v2 status_${selectedUser.role.toLowerCase()}`}
                                    >
                                        {selectedUser.role}
                                    </span>
                                </div>
                            </div>
                            <div className="modal_details_grid">
                                <div className="modal_detail_item">
                                    <label>Email Address</label>
                                    <p>{selectedUser.email}</p>
                                </div>
                                <div className="modal_detail_item">
                                    <label>Phone Number</label>
                                    <p>{selectedUser.phone || "Not Provided"}</p>
                                </div>
                                <div className="modal_detail_item">
                                    <label>Location</label>
                                    <p>{selectedUser.location || "Not Provided"}</p>
                                </div>
                                <div className="modal_detail_item">
                                    <label>User Role</label>
                                    <p>{selectedUser.role}</p>
                                </div>
                                <div className="modal_detail_item">
                                    <label>Status</label>
                                    <p>{selectedUser.status || "Active"}</p>
                                </div>
                                <div className="modal_detail_item">
                                    <label>Joined Date</label>
                                    <p>{selectedUser.joined}</p>
                                </div>
                                <div className="modal_detail_item">
                                    <label>Total Bookings</label>
                                    <p>{selectedUser.totalBookings ?? 0}</p>
                                </div>
                                <div className="modal_detail_item">
                                    <label>User ID</label>
                                    <p>#USR-00{selectedUser.id}</p>
                                </div>
                            </div>
                        </div>
                        <div className="modal_footer_v3">
                            <button
                                className="profile_dark_save_btn"
                                onClick={() => setIsUserModalOpen(false)}
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Logout Confirmation Modal */}
            {isLogoutModalOpen && (
                <div
                    className="profile_modal_overlay"
                    onClick={() => setIsLogoutModalOpen(false)}
                >
                    <div
                        className="profile_modal_content logout_modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal_header_v3">
                            <h3>Confirm Logout</h3>
                            <button
                                className="modal_close_btn"
                                onClick={() => setIsLogoutModalOpen(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className="modal_body_v3 text-center">
                            <div className="logout_icon_wrapper">
                                <FaSignOutAlt />
                            </div>
                            <p className="logout_confirm_msg">
                                Are you sure you want to log out from AutoX?
                            </p>
                        </div>
                        <div className="modal_footer_v3 logout_actions">
                            <button
                                className="profile_v3_cancel_btn_dark"
                                onClick={() => setIsLogoutModalOpen(false)}
                            >
                                No, Stay
                            </button>
                            <button
                                className="profile_dark_save_btn logout_confirm_btn"
                                onClick={handleLogout}
                            >
                                Yes, Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reusable Delete Confirmation Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title={`Confirm Delete ${deleteType === "car" ? "Car" : "User"}`}
                message={`Are you sure you want to delete this ${deleteType}? This action cannot be undone and all associated data will be lost.`}
            />
        </div>
    );
};

export default Profile;