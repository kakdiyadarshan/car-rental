import React, { useState, useMemo, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Offcanvas,
  Spinner,
} from "react-bootstrap";
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
} from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <section className="py-24 bg-x-bg min-h-screen">
      <Container>
        <div className="mb-16 space-y-4 text-center md:text-left animate-fadeIn">
          <span className="block uppercase text-[0.7rem] tracking-[5px] text-x-primary font-bold">Unlimited Performance</span>
          <h2 className="font-bebas text-5xl md:text-7xl text-white tracking-widest uppercase leading-none">
            Explore Our <span className="text-transparent !stroke-white [-webkit-text-stroke:1px_#fff]">Premium Fleet</span>
          </h2>
        </div>

        {isCarsLoading ? (
          <div className="flex flex-col items-center justify-center py-32 animate-fadeIn">
            <div className="w-16 h-16 border-4 border-x-primary border-t-transparent rounded-full animate-spin mb-8" />
            <p className="text-x-text-muted font-dm tracking-widest uppercase text-xs">Discovering premium vehicles...</p>
          </div>
        ) : carsError ? (
          <div className="text-center py-24 bg-x-surface border border-x-border rounded-[40px]">
            <p className="text-red-500 font-bold uppercase tracking-widest">Error loading fleet. Please try again later.</p>
          </div>
        ) : (
          <Row className="g-8">
            {/* Desktop Filter Sidebar */}
            <Col lg={3} className="hidden lg:block">
              <aside className="sticky top-32">
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
              <div className="flex flex-wrap items-center justify-between gap-6 mb-10 pb-6 border-b border-white/[0.05]">
                <div className="flex items-center gap-4">
                  <button
                    className="lg:hidden flex items-center gap-3 px-6 py-3 bg-x-surface border border-x-border rounded-xl text-white font-bold uppercase tracking-widest text-[0.65rem] hover:border-x-primary transition-all"
                    onClick={() => setShowFilter(true)}
                  >
                    <RiFilter3Line className="text-x-primary" /> Filters
                  </button>
                  <span className="text-x-text-muted text-[0.7rem] font-bold uppercase tracking-widest">
                    Showing <span className="text-white">{filteredCars.length}</span> vehicles
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-x-surface border border-x-border rounded-xl px-4 py-2 hover:border-x-primary/40 transition-colors">
                    <RiFilter3Line className="text-x-primary" />
                    <span className="text-x-text-muted text-[0.65rem] font-bold uppercase tracking-widest hidden sm:inline">Sort By:</span>
                    <select
                      className="bg-transparent text-white font-bold uppercase tracking-widest text-[0.65rem] outline-none cursor-pointer"
                      value={sortBy}
                      onChange={(e) => {
                        setSortBy(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="price-low" className="bg-x-surface">Price: Low to High</option>
                      <option value="price-high" className="bg-x-surface">Price: High to Low</option>
                    </select>
                  </div>
                </div>
              </div>

              <Row className="g-6">
                {currentItems.map((car) => (
                  <Col key={car._id} md={6} xl={4}>
                    <div className="group bg-x-surface border border-x-border rounded-[32px] overflow-hidden transition-all duration-500 hover:border-x-primary/40 hover:shadow-premium hover:-translate-y-2 animate-slideUp">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img 
                          src={car.image} 
                          alt={car.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute top-5 left-5">
                          <span className="px-3 py-1 bg-x-primary text-white text-[0.6rem] font-bold uppercase tracking-widest rounded-lg shadow-lg">
                            {car.category}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      <div className="p-6 space-y-6">
                        <div className="space-y-1">
                          <h3 className="font-bebas text-2xl text-white tracking-widest uppercase transition-colors group-hover:text-x-primary truncate">{car.name}</h3>
                          <div className="flex items-center justify-between">
                            <span className="text-[0.6rem] font-bold uppercase tracking-widest text-x-text-muted">Starting at</span>
                            <div className="flex items-end gap-1">
                              <span className="text-xl font-bebas text-x-primary leading-none">${car.pricePerDay}</span>
                              <span className="text-[0.55rem] font-bold uppercase tracking-widest text-x-text-muted mb-0.5">/day</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { icon: <RiGasStationLine />, label: car.specs?.fuel || 'Petrol' },
                            { icon: <RiSettings3Line />, label: car.specs?.transmission || 'Auto' },
                            { icon: <RiUserLine />, label: car.specs?.seating || '5 Seats' },
                            { icon: <RiDashboardLine />, label: car.specs?.acceleration || '0-100 4s' }
                          ].map((spec, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 bg-white/[0.03] rounded-xl border border-white/[0.02] group-hover:bg-white/[0.05] transition-colors">
                              <span className="text-x-primary text-sm">{spec.icon}</span>
                              <span className="text-x-text-muted text-[0.6rem] font-bold uppercase tracking-wider truncate">{spec.label}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                          <button
                            className="flex-1 h-12 bg-white text-x-primary font-bold uppercase tracking-widest text-[0.65rem] rounded-xl transition-all hover:bg-x-primary hover:text-white active:scale-95 shadow-xl hover:shadow-x-primary/20"
                            onClick={() => openBookingModal(car)}
                          >
                            Rent Now
                          </button>
                          <Link
                            to={`/car/${car._id}`}
                            className="w-12 h-12 border border-x-border rounded-xl flex items-center justify-center text-x-text-muted transition-all hover:border-x-primary hover:text-x-primary group/link no-underline"
                          >
                            <RiArrowRightLine size={18} className="group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}

                {filteredCars.length === 0 && (
                  <Col xs={12}>
                    <div className="flex flex-col items-center justify-center py-32 bg-x-surface border border-dashed border-x-border rounded-[40px] animate-fadeIn text-center p-8">
                      <div className="w-24 h-24 bg-x-primary/10 rounded-full flex items-center justify-center text-x-primary text-4xl mb-8">
                        <RiSearchLine />
                      </div>
                      <h3 className="font-bebas text-3xl text-white tracking-widest uppercase mb-4">No Vehicles Found</h3>
                      <p className="text-x-text-muted font-dm max-w-md mx-auto mb-10 text-lg">
                        We couldn't find any vehicles matching your current filters. 
                        Try adjusting your search term or exploring other categories.
                      </p>
                      <button
                        className="px-10 py-5 bg-x-primary text-white font-bold uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center gap-3 transition-all hover:shadow-xl hover:shadow-x-primary/20 hover:-translate-y-1 active:translate-y-0"
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
                  </Col>
                )}
              </Row>

              {/* Pagination UI */}
              {totalPages > 1 && (
                <div className="mt-20 flex justify-center animate-fadeIn">
                  <div className="flex items-center gap-4 bg-x-surface border border-x-border p-2 rounded-[24px]">
                    <button
                      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 disabled:opacity-10 enabled:hover:bg-x-primary enabled:hover:text-white text-x-text-muted"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      <RiArrowLeftSLine size={24} />
                    </button>

                    <div className="px-6 font-bebas text-xl text-white tracking-widest">
                      <span className="text-x-primary">{currentPage}</span> <span className="text-white/20 mx-1">/</span> {totalPages}
                    </div>

                    <button
                      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 disabled:opacity-10 enabled:hover:bg-x-primary enabled:hover:text-white text-x-text-muted"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      <RiArrowRightSLine size={24} />
                    </button>
                  </div>
                </div>
              )}
            </Col>
          </Row>
        )}

        {/* Mobile Filter Offcanvas */}
        <Offcanvas
          show={showFilter}
          onHide={() => setShowFilter(false)}
          placement="end"
          className="!bg-x-bg border-l !border-x-border !w-full sm:!w-[400px]"
        >
          <Offcanvas.Header closeButton className="border-b border-white/[0.05] p-6 !text-white [&>button]:!invert">
            <Offcanvas.Title className="font-bebas text-3xl tracking-widest uppercase">Filters & Search</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="p-8">
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

// Filter Sidebar
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
  <div className="space-y-10 animate-fadeIn">
    <div className="space-y-4">
      <label className="block text-[0.65rem] font-bold uppercase tracking-[3px] text-x-text-muted ml-1">Search Fleet</label>
      <div className="relative group">
        <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-x-primary text-xl transition-transform group-focus-within:scale-110" />
        <input
          type="text"
          placeholder="Search model..."
          className="w-full bg-x-surface border border-x-border rounded-2xl py-4 pl-12 pr-4 text-white focus:border-x-primary outline-none transition-all placeholder:text-white/10 text-sm"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>
    </div>

    <div className="space-y-4">
      <label className="block text-[0.65rem] font-bold uppercase tracking-[3px] text-x-text-muted ml-1">Categories</label>
      <div className="flex flex-col gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 text-sm font-bold uppercase tracking-widest border ${
              activeCat === cat 
                ? "bg-x-primary border-x-primary text-white shadow-lg shadow-x-primary/20" 
                : "bg-white/[0.02] border-x-border text-x-text-muted hover:border-x-primary/40 hover:bg-white/[0.04]"
            }`}
            onClick={() => {
              setActiveCat(cat);
              setCurrentPage(1);
              if (showFilter) setShowFilter(false);
            }}
          >
            <span>{cat}</span>
            <span className={`text-[0.65rem] px-2 py-0.5 rounded-lg border ${activeCat === cat ? 'bg-white/20 border-white/20' : 'bg-white/5 border-white/10'}`}>
              {counts.catCounts[cat] || 0}
            </span>
          </button>
        ))}
      </div>
    </div>

    <div className="space-y-4">
      <label className="block text-[0.65rem] font-bold uppercase tracking-[3px] text-x-text-muted ml-1">Top Brands</label>
      <div className="grid grid-cols-1 gap-2">
        {BRANDS_LIST.map((brand) => (
          <button
            key={brand}
            className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 text-sm font-bold uppercase tracking-widest border ${
              activeBrand === brand 
                ? "bg-x-primary border-x-primary text-white shadow-lg shadow-x-primary/20" 
                : "bg-white/[0.02] border-x-border text-x-text-muted hover:border-x-primary/40 hover:bg-white/[0.04]"
            }`}
            onClick={() => {
              setActiveBrand(brand);
              setCurrentPage(1);
              if (showFilter) setShowFilter(false);
            }}
          >
            <span>{brand}</span>
            <span className={`text-[0.65rem] px-2 py-0.5 rounded-lg border ${activeBrand === brand ? 'bg-white/20 border-white/20' : 'bg-white/5 border-white/10'}`}>
              {counts.brandCounts[brand] || 0}
            </span>
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default FleetContent;

