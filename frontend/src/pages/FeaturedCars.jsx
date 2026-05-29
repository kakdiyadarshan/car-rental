import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import {
  RiUserLine,
  RiBriefcaseLine,
  RiSnowflakeLine,
  RiSettings3Line,
  RiCarLine,
  RiArrowRightLine,
  RiArrowDownSLine
} from 'react-icons/ri';
import BookingModal from '../components/BookingModal';
import { useGetCarsQuery } from '../slices/carsApiSlice';
import { Link } from 'react-router-dom';

/* ── Reusable Car Card ────────────────────────────── */
// const CarCard = ({ car, openBookingModal }) => {
//   return (

//   );
// };

/* ── Main Component ─────────────────────────────────── */
const FeaturedCars = () => {
  const { data: cars, isLoading, error } = useGetCarsQuery();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const openBookingModal = (car) => {
    setSelectedCar(car);
    setShowBookingModal(true);
  };

  const categories = [
    { id: 'All', label: 'All Vehicles' },
    { id: 'Economy', label: 'Economy' },
    { id: 'Suvs', label: 'Suvs' },
    { id: 'Luxury', label: 'Luxury' },
    { id: 'Vans', label: 'Vans' }
  ];

  // Helper to filter cars into categories based on database schema
  const filteredCars = cars?.filter(car => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Economy') {
      return ['Sedan', 'Hatchback', 'Economy'].includes(car.category);
    }
    if (selectedCategory === 'Suvs') {
      return ['SUV', 'MUV'].includes(car.category);
    }
    if (selectedCategory === 'Luxury') {
      return ['Luxury', 'Exotic', 'Supercar', 'Hypercar', 'Coupe'].includes(car.category);
    }
    if (selectedCategory === 'Vans') {
      return ['other', 'Van', 'MUV'].includes(car.category);
    }
    return true;
  }) || [];

  return (
    <section className="py-24 bg-[#0a0b0f] relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-x-primary/3 rounded-full blur-[140px] pointer-events-none" />

      <Container>
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3 text-x-primary uppercase tracking-[3px] font-bold text-[0.7rem]">
            <span className="w-8 h-[2px] bg-x-primary"></span>
            <span>Explore Our Premium Fleet</span>
            <span className="w-8 h-[2px] bg-x-primary"></span>
          </div>
          <p className="text-x-text-muted max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-dm font-medium opacity-85">
            Choose from our wide selection of vehicles, from economical compacts to luxurious SUVs, all maintained to the highest standards.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          {categories.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${selectedCategory === tab.id
                ? 'bg-x-primary border-x-primary text-white shadow-lg shadow-x-primary/25 scale-105'
                : 'bg-[#111318]/50 border-white/[0.08] text-x-text-muted hover:border-white/20 hover:text-white'
                }`}
            >
              {tab?.label}
            </button>
          ))}
        </div>

        {/* Cars Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-x-primary border-t-transparent rounded-full animate-spin mb-6" />
            <p className="text-x-text-muted font-dm tracking-widest uppercase text-xs">Discovering premium vehicles...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white/[0.02] border border-white/[0.05] rounded-3xl">
            <p className="text-red-500 font-bold uppercase tracking-widest">Error loading vehicles. Please try again later.</p>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.01] border border-white/[0.04] rounded-3xl">
            <p className="text-x-text-muted font-bold uppercase tracking-widest text-sm">No vehicles found in this category.</p>
          </div>
        ) : (
          <Row className="g-3">
            {filteredCars.slice(0, 8).map((car) => (
              <Col key={car._id} lg={3} md={6}>
                <div className="group bg-[#161a22] rounded-2xl p-3.5 transition-all duration-500 hover:border-white/[0.08] hover:shadow-[0_12px_24px_rgba(0,0,0,0.3)] flex flex-col justify-between h-full">
                  <div>
                    {/* Car Image */}
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-3 bg-white/[0.02]">
                      <img
                        src={car?.image}
                        alt={car?.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                    </div>

                    {/* Title & Price Row */}
                    <div className="flex items-start justify-between mb-1.5">
                      <div>
                        <h3 className="text-sm font-bold text-white tracking-tight leading-tight group-hover:text-x-primary transition-colors">
                          {car?.name}
                        </h3>
                        <span className="text-[0.6rem] text-[#a0a5b5] font-dm capitalize">
                          {car?.category} Sedan
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-bold text-x-primary leading-none block">
                          ${car?.pricePerDay}
                        </span>
                        <span className="text-[0.5rem] uppercase tracking-widest text-[#a0a5b5] font-bold">
                          Per day
                        </span>
                      </div>
                    </div>

                    {/* Specification Badges */}
                    <div className="grid grid-cols-4 gap-0.5 py-2 my-2 border-t border-b border-white/[0.03] text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <RiUserLine className="text-white/40 text-[0.9rem] shrink-0" />
                        <span className="text-[0.55rem] text-[#a0a5b5] font-bold font-dm uppercase tracking-wider truncate max-w-full">
                          {car.specs?.seating || '5 Seats'}
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <RiBriefcaseLine className="text-white/40 text-[0.9rem] shrink-0" />
                        <span className="text-[0.55rem] text-[#a0a5b5] font-bold font-dm uppercase tracking-wider truncate max-w-full">
                          2 Bags
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <RiSnowflakeLine className="text-white/40 text-[0.9rem] shrink-0" />
                        <span className="text-[0.55rem] text-[#a0a5b5] font-bold font-dm uppercase tracking-wider truncate max-w-full">
                          AC
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <RiSettings3Line className="text-white/40 text-[0.9rem] shrink-0" />
                        <span className="text-[0.55rem] text-[#a0a5b5] font-bold font-dm uppercase tracking-wider truncate max-w-full">
                          {car.specs?.transmission?.split(' ')[0] || 'Auto'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.02] mt-auto">
                    <button
                      className="rent-now-btn group/btn flex items-center justify-between pl-4 pr-1 py-1 bg-x-primary hover:bg-[#b84f1c] text-white text-[0.6rem] font-bold uppercase tracking-wider rounded-xl transition-all duration-300 hover:shadow-[0_6px_20px_rgba(221,111,39,0.3)] active:scale-95 shadow-md shadow-x-primary/10"
                      onClick={() => openBookingModal(car)}
                    >
                      <span className="mr-2.5 transition-transform duration-300 group-hover/btn:-translate-x-0.5">Rent Now</span>
                    </button>

                    <Link
                      to={`/car/${car._id}`}
                      className="text-white hover:text-x-primary text-[0.6rem] font-bold uppercase tracking-wider no-underline transition-colors py-1.5"
                    >
                      See Details
                    </Link>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}

        {/* Explore All Vehicles Footer Link */}
        <div className="text-center mt-16 animate-fadeIn">
          <Link
            to="/Fleet"
            className="inline-block text-white hover:text-x-primary font-bold text-xs uppercase tracking-widest no-underline transition-colors border-b border-white/20 hover:border-x-primary pb-1"
          >
            Explore All Vehicles
          </Link>
        </div>
      </Container>

      {/* Booking Modal */}
      <BookingModal
        show={showBookingModal}
        onHide={() => setShowBookingModal(false)}
        selectedCar={selectedCar}
      />
    </section>
  );
};

export default FeaturedCars;


