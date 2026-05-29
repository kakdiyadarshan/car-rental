import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import {
  RiStarFill,
  RiMapPin2Line,
  RiSpeedUpLine,
  RiSettings3Line,
  RiUserLine,
  RiGasStationLine,
  RiShieldCheckLine,
  RiCheckboxCircleLine,
  RiToolsLine,
  RiCalendarEventLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiAwardLine,
  RiInformationLine,
  RiCheckLine,
  RiTimeLine,
  RiDashboardLine
} from 'react-icons/ri';
import BookingModal from '../components/BookingModal';
import { useGetCarByIdQuery } from '../slices/carsApiSlice';
import { useGetCarRatingQuery } from '../slices/ratingsApiSlice';

const CarDetailContent = () => {
  const { id: carId } = useParams();
  const { data: car, isLoading, error } = useGetCarByIdQuery(carId);
  const { data: carRating } = useGetCarRatingQuery(carId);
  const [activeImg, setActiveImg] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      const activeThumb = scrollRef.current.children[activeImg];
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [activeImg]);

  const handleScroll = (direction) => {
    if (direction === "left") {
      setActiveImg((prev) =>
        prev === 0 ? thumbs.length - 1 : prev - 1
      );
    } else {
      setActiveImg((prev) =>
        prev === thumbs.length - 1 ? 0 : prev + 1
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-x-bg">
        <Spinner animation="border" className="text-x-primary mb-4" />
        <p className="text-x-text-muted font-dm tracking-widest uppercase text-xs">Loading vehicle details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-x-bg">
        <h3 className="text-red-500 font-bebas text-3xl tracking-widest">Error loading car details.</h3>
      </div>
    );
  }

  const thumbs = car?.thumbs?.length > 0 ? [car.image, ...car.thumbs] : [car.image];

  const specs = [
    { icon: <RiDashboardLine />, label: "0–100 km/h", val: car.specs?.acceleration || 'N/A' },
    { icon: <RiSettings3Line />, label: "Transmission", val: car.specs?.transmission || 'N/A' },
    { icon: <RiUserLine />, label: "Seating", val: car.specs?.seating || 'N/A' },
    { icon: <RiGasStationLine />, label: "Fuel Type", val: car.specs?.fuel || 'N/A' },
  ];

  return (
    <section className="py-24 bg-x-bg min-h-screen">
      <Container>
        {/* Header Section */}
        <div className="mb-16 space-y-4 text-center md:text-left animate-fadeIn">
          <span className="block uppercase text-[0.7rem] tracking-[5px] text-x-primary font-bold">{car.category} Collection</span>
          <h2 className="font-bebas text-5xl md:text-7xl text-white tracking-widest uppercase leading-none">
            {car.name} <span className="text-transparent !stroke-white [-webkit-text-stroke:1px_#fff]">{car.brand?.name}</span>
          </h2>
        </div>

        <Row className="g-10">
          {/* Main Content (Left) */}
          <Col lg={8}>
            {/* Gallery Wrapper */}
            <div className="space-y-6 animate-slideUp">
              <div className="relative aspect-[16/9] bg-x-surface border border-x-border rounded-[40px] overflow-hidden group">
                <img src={thumbs[activeImg]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={car.name} />
                <div className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-x-primary text-white text-[0.7rem] font-bold uppercase tracking-widest rounded-xl shadow-lg">
                  <RiCheckboxCircleLine className="text-lg" /> Verified Listing
                </div>
              </div>

              {/* Thumbnails Navigation */}
              {thumbs.length > 1 && (
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    className="w-12 h-12 bg-x-surface border border-x-border rounded-xl flex items-center justify-center text-white hover:bg-x-primary hover:border-x-primary transition-all disabled:opacity-20"
                    onClick={() => handleScroll('left')}
                  >
                    <RiArrowLeftSLine size={24} />
                  </button>

                  <div className="flex-1 flex gap-4 overflow-x-auto no-scrollbar py-2" ref={scrollRef}>
                    {thumbs.map((url, index) => (
                      <div
                        key={index}
                        className={`relative min-w-[120px] aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${activeImg === index ? 'border-x-primary shadow-lg shadow-x-primary/20 scale-105' : 'border-transparent opacity-40 hover:opacity-100'}`}
                        onClick={() => setActiveImg(index)}
                      >
                        <img src={url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="w-12 h-12 bg-x-surface border border-x-border rounded-xl flex items-center justify-center text-white hover:bg-x-primary hover:border-x-primary transition-all disabled:opacity-20"
                    onClick={() => handleScroll('right')}
                  >
                    <RiArrowRightSLine size={24} />
                  </button>
                </div>
              )}
            </div>

            {/* Car Info Card */}
            <div className="mt-12 bg-x-surface border border-x-border rounded-[40px] p-8 md:p-12 space-y-12 animate-slideUp">
              <div className="flex flex-wrap gap-10">
                <div className="flex items-center gap-3">
                    <RiStarFill className="text-[#F5A200] text-xl" />
                    <span className="text-white font-bold text-lg">{carRating?.averageRating || '0.0'}</span>
                    <span className="text-x-text-muted text-sm font-dm">({carRating?.totalRatings || 0} reviews)</span>
                </div>
                <div className="flex items-center gap-3 text-x-text-muted text-sm font-dm">
                    <RiMapPin2Line className="text-x-primary text-xl" />
                    Surat, Gujarat
                </div>
                <div className="flex items-center gap-3 text-x-text-muted text-sm font-dm uppercase tracking-widest text-[0.7rem] font-bold">
                    <RiAwardLine className="text-x-primary text-xl" />
                    Top Rated Choice
                </div>
              </div>

              {/* Specifications Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {specs.map((s, i) => (
                  <div className="space-y-3 p-6 bg-white/[0.03] border border-white/[0.05] rounded-3xl transition-transform hover:-translate-y-1 group" key={i}>
                    <div className="text-x-primary text-3xl group-hover:scale-110 transition-transform">{s.icon}</div>
                    <div className="space-y-1">
                        <span className="block text-white font-bebas text-2xl tracking-widest leading-none">{s.val}</span>
                        <span className="block text-[0.6rem] font-bold uppercase tracking-[2px] text-x-text-muted">{s.label}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Description Section */}
              <div className="pt-12 border-t border-white/[0.05] space-y-6">
                <h3 className="font-bebas text-3xl text-white tracking-widest uppercase">About this Vehicle</h3>
                <p className="text-x-text-muted text-lg leading-relaxed font-dm">
                  {car.description}
                </p>
              </div>
            </div>

            {/* Features Card */}
            {car.features?.length > 0 && (
              <div className="mt-8 bg-x-surface border border-x-border rounded-[40px] p-8 md:p-12 animate-slideUp">
                <h3 className="font-bebas text-3xl text-white tracking-widest uppercase mb-10 flex items-center gap-4">
                  <RiInformationLine className="text-x-primary" /> Premium Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                  {car.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-4 text-x-text-muted font-dm text-lg group">
                      <div className="w-6 h-6 rounded-full bg-x-primary/10 flex items-center justify-center text-x-primary group-hover:bg-x-primary group-hover:text-white transition-all">
                        <RiCheckLine />
                      </div>
                      <span className="opacity-80 group-hover:opacity-100 transition-opacity">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Col>

          {/* Sidebar (Right) */}
          <Col lg={4}>
            <aside className="sticky top-32 space-y-8 animate-slideUp">
              {/* Price Header */}
              <div className="bg-x-surface border border-x-border rounded-[32px] p-8 space-y-8">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <h3 className="font-bebas text-5xl text-white tracking-widest leading-none">${car.pricePerDay}</h3>
                    <span className="text-[0.65rem] font-bold uppercase tracking-widest text-x-text-muted">Rent per day</span>
                  </div>
                  <div className={`px-4 py-1.5 rounded-lg text-[0.6rem] font-extrabold tracking-widest border ${car.isAvailable ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                    {car.isAvailable ? 'AVAILABLE' : 'RENTED'}
                  </div>
                </div>

                <button
                    className="w-full h-18 bg-white text-x-primary font-bold uppercase tracking-widest text-sm rounded-2xl py-5 shadow-xl transition-all hover:bg-x-primary hover:text-white hover:shadow-x-primary/20 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    onClick={() => setShowBookingModal(true)}
                    disabled={!car.isAvailable}
                >
                    {car.isAvailable ? 'Rent This Car' : 'Currently Unavailable'} <RiArrowRightSLine className="text-xl" />
                </button>
              </div>

              {/* Included Extras */}
              <div className="bg-x-surface border border-x-border rounded-[32px] p-8 space-y-8">
                <h4 className="font-bebas text-2xl text-white tracking-widest uppercase">Included In Price</h4>
                <ul className="space-y-4">
                  {[
                    'Professional Chauffeur',
                    'Fuel & Tolls Included',
                    'Premium Insurance',
                    'Refreshments & Wi-Fi',
                    '24/7 Roadside Assist'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-x-text-muted font-dm text-base">
                      <RiCheckLine className="text-x-primary text-xl" /> {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Badges */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: <RiShieldCheckLine />, label: 'Insured' },
                  { icon: <RiCheckboxCircleLine />, label: 'Verified' },
                  { icon: <RiToolsLine />, label: 'Serviced' }
                ].map((item, i) => (
                  <div key={i} className="bg-x-surface border border-x-border rounded-2xl p-4 flex flex-col items-center gap-2 group transition-all hover:border-x-primary/40 hover:-translate-y-1">
                    <div className="text-x-primary text-xl group-hover:scale-110 transition-transform">{item.icon}</div>
                    <span className="text-[0.55rem] font-bold uppercase tracking-widest text-x-text-muted">{item.label}</span>
                  </div>
                ))}
              </div>
            </aside>
          </Col>
        </Row>
      </Container>

      {/* Booking Modal */}
      <BookingModal
        show={showBookingModal}
        onHide={() => setShowBookingModal(false)}
        selectedCar={car}
      />
    </section>
  );
};

export default CarDetailContent;

