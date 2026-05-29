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
import '../style/d_style.css';
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
      <div className="text-center py-5" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h3 className="text-danger">Error loading car details.</h3>
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
    <section className="d_car_detail_section">
      <Container>
        {/* Header Section */}
        <div className="d_cd_header">
          <span className="d_cd_eyebrow">{car.category} Collection</span>
          <h2 className="d_cd_title">{car.name} <span>{car.brand?.name}</span></h2>
        </div>

        <Row className="g-5">
          {/* Main Content (Left) */}
          <Col lg={8}>
            {/* Gallery Wrapper */}
            <div className="d_cd_gallery_wrapper">
              <div className="d_cd_main_img_box">
                <img src={thumbs[activeImg]} className="d_cd_main_img" alt={car.name} />
                <div className="d_cd_verified_badge">
                  <RiCheckboxCircleLine /> Verified Listing
                </div>
              </div>

              {/* Thumbnails Navigation */}
              {thumbs.length > 1 && (
                <div className="d_cd_thumbs_outer">
                  <button
                    type="button"
                    className="d_cd_thumb_btn"
                    onClick={() => handleScroll('left')}
                  >
                    <RiArrowLeftSLine size={24} />
                  </button>

                  <div className="d_cd_thumbs_wrapper" ref={scrollRef}>
                    {thumbs.map((url, index) => (
                      <div
                        key={index}
                        className={`d_cd_thumb_item ${activeImg === index ? 'active' : ''}`}
                        onClick={() => setActiveImg(index)}
                      >
                        <img src={url} alt={`Thumbnail ${index + 1}`} />
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="d_cd_thumb_btn"
                    onClick={() => handleScroll('right')}
                  >
                    <RiArrowRightSLine size={24} />
                  </button>
                </div>
              )}
            </div>

            {/* Car Info Card */}
            <div className="d_cd_info_card">
              <div className="d_cd_meta_row">
                <div className="d_cd_meta_item"><RiStarFill /> <strong>{carRating?.averageRating || '0.0'}</strong> ({carRating?.totalRatings || 0} reviews)</div>
                <div className="d_cd_meta_item"><RiMapPin2Line /> Surat, Gujarat</div>
                <div className="d_cd_meta_item"><RiAwardLine /> Top Rated Choice</div>
              </div>

              {/* Specifications Grid */}
              <div className="d_cd_specs_grid">
                {specs.map((s, i) => (
                  <div className="d_cd_spec_box" key={i}>
                    <div className="d_cd_spec_icon">{s.icon}</div>
                    <span className="d_cd_spec_val">{s.val}</span>
                    <span className="d_cd_spec_lab">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Description Section */}
              <div style={{ borderTop: '1px solid var(--x-border)', paddingTop: '30px' }}>
                <h3 className="d_cd_extras_title" style={{ marginBottom: '15px' }}>About this Vehicle</h3>
                <p style={{ color: 'var(--x-text-muted)', lineHeight: 1.8 }}>
                  {car.description}
                </p>
              </div>
            </div>

            {/* Features Card */}
            {car.features?.length > 0 && (
              <div className="d_cd_info_card d_cd_prem_features_card">
                <h3 className="d_cd_extras_title" style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <RiInformationLine color="var(--x-primary)" /> Premium Features
                </h3>
                <div className="d_cd_features_grid">
                  {car.features.map((f, i) => (
                    <div key={i} className="d_cd_feature_item">
                      <RiCheckLine /> {f}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Col>

          {/* Sidebar (Right) */}
          <Col lg={4}>
            <aside className="d_cd_booking_sidebar">
              {/* Price Header */}
              <div className="d_cd_price_box">
                <div className="d-flex justify-content-between align-items-end">
                  <div>
                    <h3>${car.pricePerDay}</h3>
                    <span>Rent per day</span>
                  </div>
                  <div style={{
                    background: car.isAvailable ? 'rgba(5, 150, 105, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: car.isAvailable ? '#10b981' : '#ef4444',
                    padding: '5px 12px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 700
                  }}>
                    {car.isAvailable ? 'AVAILABLE' : 'RENTED'}
                  </div>
                </div>
              </div>

              {/* Rent Now Button */}
              <div className="d_cd_form_card">
                <button
                  className="d_cd_btn_book"
                  onClick={() => setShowBookingModal(true)}
                  disabled={!car.isAvailable}
                >
                  {car.isAvailable ? 'Rent This Car' : 'Currently Unavailable'} <RiArrowRightSLine />
                </button>
              </div>

              {/* Included Extras */}
              <div className="d_cd_extras_card">
                <h4 className="d_cd_extras_title">Included In Price</h4>
                <ul className="d_cd_extras_list">
                  {[
                    'Professional Chauffeur',
                    'Fuel & Tolls Included',
                    'Premium Insurance',
                    'Refreshments & Wi-Fi',
                    '24/7 Roadside Assist'
                  ].map((item, i) => (
                    <li key={i} className="d_cd_extra_item">
                      <RiCheckLine /> {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Badges */}
              <div className="d-flex gap-2 mt-3">
                {[
                  { icon: <RiShieldCheckLine />, label: 'Insured' },
                  { icon: <RiCheckboxCircleLine />, label: 'Verified' },
                  { icon: <RiToolsLine />, label: 'Serviced' }
                ].map((item, i) => (
                  <div key={i} style={{
                    flex: 1,
                    background: 'var(--x-surface)',
                    padding: '12px 5px',
                    borderRadius: '8px',
                    border: '1px solid var(--x-border)',
                    textAlign: 'center',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    color: 'var(--x-text-muted)',
                    textTransform: 'uppercase'
                  }}>
                    <div style={{ color: 'var(--x-primary)', marginBottom: '5px' }}>{item.icon}</div>
                    {item.label}
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
