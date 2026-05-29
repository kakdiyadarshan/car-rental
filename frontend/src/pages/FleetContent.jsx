import React, { useState, useMemo, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Offcanvas,
  Modal,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";
import { FaArrowRightLong } from "react-icons/fa6";
import {
  RiGasStationLine,
  RiSettings3Line,
  RiUserLine,
  RiDashboardLine,
  RiFilter3Line,
  RiArrowRightLine,
  RiSearchLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCheckboxCircleLine,
  RiMapPin2Line,
  RiCalendarEventLine,
  RiTimeLine,
  RiCloseLine,
} from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../style/d_style.css";
import BookingModal from "../components/BookingModal";
import { useGetCarsQuery } from "../slices/carsApiSlice";
import { useGetBrandsQuery } from "../slices/brandsApiSlice";

const FleetContent = () => {
  const { data: cars, isLoading: isCarsLoading, error: carsError } = useGetCarsQuery();
  const { data: brands } = useGetBrandsQuery();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState("All");
  const [activeBrand, setActiveBrand] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  // Booking Modal State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Handle initial search term or brand from location state
  useEffect(() => {
    if (location.state) {
      if (location.state.searchTerm) {
        setSearchTerm(location.state.searchTerm);
      }
      if (location.state.activeBrand) {
        setActiveBrand(location.state.activeBrand);
      }
      // Clear state after reading to avoid re-applying on every navigation
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, location.pathname]);

  const CATEGORIES = useMemo(() => {
    if (!cars) return ["All"];
    const cats = new Set(cars.map(car => car.category));
    return ["All", ...Array.from(cats)];
  }, [cars]);

  const BRANDS_LIST = useMemo(() => {
    if (!brands) return ["All"];
    return ["All", ...brands.map(b => b.name)];
  }, [brands]);

  const filteredCars = useMemo(() => {
    if (!cars) return [];
    let result = cars.filter((car) => {
      const catMatch = activeCat === "All" || car.category === activeCat;
      const brandName = car.brand?.name || car.brand || "";
      const brandMatch = activeBrand === "All" || brandName === activeBrand;
      
      const searchLower = searchTerm.toLowerCase().trim();
      const carNameMatch = car.name?.toLowerCase().includes(searchLower);
      const carBrandMatch = brandName.toLowerCase().includes(searchLower);
      const carCatMatch = car.category?.toLowerCase().includes(searchLower);
      
      const searchMatch = !searchTerm || carNameMatch || carBrandMatch || carCatMatch;
      
      return catMatch && brandMatch && searchMatch;
    });

    if (sortBy === "price-low") result.sort((a, b) => a.pricePerDay - b.pricePerDay);
    if (sortBy === "price-high") result.sort((a, b) => b.pricePerDay - a.pricePerDay);
    if (sortBy === "speed")
      result.sort((a, b) => parseInt(b.specs?.speed || 0) - parseInt(a.specs?.speed || 0));

    return result;
  }, [cars, activeCat, activeBrand, sortBy, searchTerm]);

  // Paginated Data
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredCars.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredCars, currentPage]);

  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);

  const counts = useMemo(() => {
    const catCounts = { All: cars?.length || 0 };
    const brandCounts = { All: cars?.length || 0 };

    cars?.forEach((car) => {
      catCounts[car.category] = (catCounts[car.category] || 0) + 1;
      const brandName = car.brand?.name || car.brand;
      brandCounts[brandName] = (brandCounts[brandName] || 0) + 1;
    });

    return { catCounts, brandCounts };
  }, [cars]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const openBookingModal = (car) => {
    setSelectedCar(car);
    setShowBookingModal(true);
  };

  return (
    <section className="d_fleet_section">
      <Container>
        <div className="d_fleet_header">
          <span className="d_fleet_eyebrow">Unlimited Performance</span>
          <h2 className="d_fleet_title">
            Explore Our <span>Premium Fleet</span>
          </h2>
        </div>

        {isCarsLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Discovering premium vehicles...</p>
          </div>
        ) : carsError ? (
          <div className="text-center py-5 text-danger">
            <p>Error loading fleet. Please try again later.</p>
          </div>
        ) : (
          <Row className="g-4">
            {/* Desktop Filter Sidebar */}
            <Col lg={3} className="d-none d-lg-block">
              <aside className="d_fleet_filter_card">
                <FilterSidebar
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  CATEGORIES={CATEGORIES}
                  activeCat={activeCat}
                  setActiveCat={setActiveCat}
                  BRANDS_LIST={BRANDS_LIST}
                  activeBrand={activeBrand}
                  setActiveBrand={setActiveBrand}
                  counts={counts}
                  setCurrentPage={setCurrentPage}
                  showFilter={showFilter}
                  setShowFilter={setShowFilter}
                />
              </aside>
            </Col>

            {/* Grid Content */}
            <Col lg={9}>
              <div className="d_fleet_grid_top">
                <div className="d_results_count">
                  <button
                    className="d_filter_btn_mobile d-lg-none me-3"
                    onClick={() => setShowFilter(true)}
                  >
                    <RiFilter3Line /> Filters
                  </button>
                  <span className="d-none d-sm-inline">
                    Showing <strong>{filteredCars.length}</strong> vehicles found
                  </span>
                </div>
                <div className="d_grid_sort">
                  <RiFilter3Line
                    className="d-none d-sm-block"
                    color="var(--x-primary)"
                  />
                  <span
                    style={{ fontSize: "0.85rem", fontWeight: 600 }}
                    className="d-none d-sm-block"
                  >
                    Sort By:
                  </span>
                  <select
                    className="d_sort_select"
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    {/* <option value="featured">Featured</option> */}
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    {/* <option value="speed">Top Speed</option> */}
                  </select>
                </div>
              </div>

              <Row className="g-4">
                {currentItems.map((car) => (
                  <Col key={car._id} md={6} xl={4}>
                    <div className="d_car_card">
                      <div className="d_car_img_box">
                        <img
                          src={car.image}
                          alt={car.name}
                          className="d_car_img"
                        />
                        <div className="d_car_badges">
                          <span className="d_car_tag">{car.category}</span>
                        </div>
                      </div>

                      <div className="d_car_content">
                        <div className="d_car_header">
                          <h3 className="d_car_name">{car.name}</h3>
                          <div className="d_car_price">
                            <span className="amount">${car.pricePerDay}</span>
                            <span className="period">/day</span>
                          </div>
                        </div>

                        <div className="d_car_specs_grid">
                          <div className="d_spec_item">
                            <RiGasStationLine />
                            <span>{car.specs?.fuel || 'Petrol'}</span>
                          </div>
                          <div className="d_spec_item">
                            <RiSettings3Line />
                            <span>{car.specs?.transmission || 'Auto'}</span>
                          </div>
                          <div className="d_spec_item">
                            <RiUserLine />
                            <span>{car.specs?.seating || '5 Seats'}</span>
                          </div>
                          <div className="d_spec_item">
                            <RiDashboardLine />
                            <span>{car.specs?.acceleration || '0-100 4s'}</span>
                          </div>
                        </div>

                        <div className="d_car_footer">
                          <button
                            className="d_car_btn_primary"
                            style={{ border: "none" }}
                            onClick={() => openBookingModal(car)}
                          >
                            Rent Now
                          </button>
                          <Link
                            to={`/car/${car._id}`}
                            className="d_car_btn_outline"
                            style={{ textDecoration: "none",textAlign: "center" }}
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}

                {filteredCars.length === 0 && (
                  <Col xs={12}>
                    <div className="d_no_results_container">
                      <div className="d_no_results_icon">
                        <RiSearchLine size={64} />
                      </div>
                      <h3 className="d_no_results_title">No Vehicles Found</h3>
                      <p className="d_no_results_text">
                        We couldn't find any vehicles matching your current filters. 
                        Try adjusting your search term or exploring other categories.
                      </p>
                      <div className="d_no_results_actions">
                        <button
                          className="d_btn_cta"
                          onClick={() => {
                            setActiveCat("All");
                            setActiveBrand("All");
                            setSearchTerm("");
                            setCurrentPage(1);
                          }}
                        >
                          <RiFilter3Line size={18} />
                          Clear All Filters
                        </button>
                      </div>
                    </div>
                  </Col>
                )}
              </Row>

              {/* Pagination UI */}
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
            </Col>
          </Row>)}

        {/* Mobile Filter Offcanvas */}
        <Offcanvas
          show={showFilter}
          onHide={() => setShowFilter(false)}
          placement="end"
          className="d_filter_offcanvas"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Filters & Search</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <FilterSidebar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              CATEGORIES={CATEGORIES}
              activeCat={activeCat}
              setActiveCat={setActiveCat}
              BRANDS_LIST={BRANDS_LIST}
              activeBrand={activeBrand}
              setActiveBrand={setActiveBrand}
              counts={counts}
              setCurrentPage={setCurrentPage}
              showFilter={showFilter}
              setShowFilter={setShowFilter}
            />
          </Offcanvas.Body>
        </Offcanvas>

        {/* Booking Modal */}
        <BookingModal
          show={showBookingModal}
          onHide={() => setShowBookingModal(false)}
          selectedCar={selectedCar}
        />
      </Container>
    </section>
  );
};

// Filter Sidebar as a separate component to prevent focus loss
const FilterSidebar = ({
  searchTerm,
  setSearchTerm,
  CATEGORIES,
  activeCat,
  setActiveCat,
  BRANDS_LIST,
  activeBrand,
  setActiveBrand,
  counts,
  setCurrentPage,
  showFilter,
  setShowFilter,
}) => (
  <div className="d_filter_sidebar_inner">
    <div className="d_filter_group">
      <label className="d_filter_label">Search Fleet</label>
      <div style={{ position: "relative" }}>
        <RiSearchLine
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--x-primary)",
          }}
        />
        <input
          type="text"
          placeholder="Search model..."
          className="d_cd_input"
          style={{ paddingLeft: "40px" }}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>
    </div>

    <div className="d_filter_group">
      <label className="d_filter_label">Categories</label>
      <ul className="d_filter_list">
        {CATEGORIES.map((cat) => (
          <li
            key={cat}
            className={`d_filter_item ${activeCat === cat ? "active" : ""}`}
            onClick={() => {
              setActiveCat(cat);
              setCurrentPage(1);
              if (showFilter) setShowFilter(false);
            }}
          >
            <span className="d_filter_name">{cat}</span>
            <span className="d_filter_count">
              {counts.catCounts[cat] || 0}
            </span>
          </li>
        ))}
      </ul>
    </div>

    <div className="d_filter_group">
      <label className="d_filter_label">Brands</label>
      <ul className="d_filter_list">
        {BRANDS_LIST.map((brand) => (
          <li
            key={brand}
            className={`d_filter_item ${activeBrand === brand ? "active" : ""}`}
            onClick={() => {
              setActiveBrand(brand);
              setCurrentPage(1);
              if (showFilter) setShowFilter(false);
            }}
          >
            <span className="d_filter_name">{brand}</span>
            <span className="d_filter_count">
              {counts.brandCounts[brand] || 0}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default FleetContent;
