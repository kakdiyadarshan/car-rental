import React, { useState } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { 
  RiGasStationLine, 
  RiSettings3Line, 
  RiUserLine, 
  RiSpeedLine,
  RiArrowRightLine,
  RiHeartFill,
  RiDashboardLine
} from 'react-icons/ri';
import BookingModal from '../components/BookingModal';
import { useGetCarsQuery } from '../slices/carsApiSlice';
import { Link } from 'react-router-dom';

const FeaturedCars = () => {
  const { data: cars, isLoading, error } = useGetCarsQuery();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  const openBookingModal = (car) => {
    setSelectedCar(car);
    setShowBookingModal(true);
  };

  return (
    <section className="py-24 bg-x-bg">
      <Container>
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8 animate-fadeIn">
          <div className="space-y-4 text-center md:text-left">
            <span className="block uppercase text-[0.7rem] tracking-[5px] text-x-primary font-bold">Premium Fleet</span>
            <h2 className="font-bebas text-5xl md:text-6xl text-white tracking-widest uppercase mb-0">
              Featured <span className="text-transparent !stroke-white [-webkit-text-stroke:1px_#fff]">Vehicles</span>
            </h2>
          </div>
          <Link to="/Fleet" className="flex items-center gap-3 text-x-primary font-bold uppercase tracking-widest text-[0.8rem] hover:text-white transition-colors group">
            View All Fleet <RiArrowRightLine className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
            <div className="w-12 h-12 border-4 border-x-primary border-t-transparent rounded-full animate-spin mb-6" />
            <p className="text-x-text-muted font-dm tracking-widest uppercase text-xs">Discovering premium vehicles...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white/[0.02] border border-white/[0.05] rounded-3xl">
            <p className="text-red-500 font-bold uppercase tracking-widest">Error loading vehicles. Please try again later.</p>
          </div>
        ) : (
          <Row className="g-4">
            {cars?.slice(0, 6).map((car) => (
              <Col key={car._id} lg={4} md={6}>
                <div className="group bg-x-surface border border-x-border rounded-[32px] overflow-hidden transition-all duration-500 hover:border-x-primary/40 hover:shadow-premium hover:-translate-y-2 animate-slideUp">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img 
                      src={car.image} 
                      alt={car.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-1.5 bg-x-primary text-white text-[0.65rem] font-bold uppercase tracking-widest rounded-lg shadow-lg">
                        {car.category}
                      </span>
                    </div>
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/40 transition-colors" />
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-bebas text-3xl text-white tracking-widest uppercase transition-colors group-hover:text-x-primary">{car.name}</h3>
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1 text-x-primary">
                          <span className="text-2xl font-bold font-bebas">${car.pricePerDay}</span>
                        </div>
                        <span className="text-[0.6rem] font-bold uppercase tracking-widest text-x-text-muted">Per Day</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { icon: <RiGasStationLine />, label: car.specs?.fuel || 'Petrol' },
                        { icon: <RiSettings3Line />, label: car.specs?.transmission || 'Auto' },
                        { icon: <RiUserLine />, label: car.specs?.seating || '5 Seats' },
                        { icon: <RiDashboardLine />, label: car.specs?.acceleration || '0-100 4s' }
                      ].map((spec, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-xl border border-white/[0.02] group-hover:bg-white/[0.05] transition-colors">
                          <span className="text-x-primary text-lg">{spec.icon}</span>
                          <span className="text-x-text-muted text-[0.7rem] font-bold uppercase tracking-wider">{spec.label}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                      <button
                        className="flex-1 h-14 bg-white text-x-primary font-bold uppercase tracking-widest text-xs rounded-xl transition-all hover:bg-x-primary hover:text-white hover:shadow-lg active:scale-95"
                        onClick={() => openBookingModal(car)}
                      >
                        Rent Now
                      </button>
                      <Link
                        to={`/car/${car._id}`}
                        className="w-14 h-14 border border-x-border rounded-xl flex items-center justify-center text-x-text-muted transition-all hover:border-x-primary hover:text-x-primary hover:bg-x-primary/5 no-underline"
                      >
                        <RiArrowRightLine size={20} />
                      </Link>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
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

