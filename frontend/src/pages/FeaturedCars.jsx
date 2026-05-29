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
import '../style/d_style.css';
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
    <section className="d_featured_cars_section d_section_padding">
      <Container>
        <div className="d_fc_header_row d_mb_responsive">
          <div className="d_fc_heading">
            <span className="d_fc_eyebrow">Premium Fleet</span>
            <h2 className="d_fc_title d_responsive_title">Featured <span>Vehicles</span></h2>
          </div>
          <Link to="/Fleet" className="d_fc_view_all">
            View All Fleet <RiArrowRightLine />
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Discovering premium vehicles...</p>
          </div>
        ) : error ? (
          <div className="text-center py-5 text-danger">
            <p>Error loading cars. Please try again later.</p>
          </div>
        ) : (
          <Row className="g-4">
            {cars?.slice(0, 6).map((car) => (
              <Col key={car._id} lg={4} md={6}>
                <div className="d_car_card">
                  <div className="d_car_img_box">
                    <img src={car.image} alt={car.name} className="d_car_img" />
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
                        onClick={() => openBookingModal(car)}
                      >
                        Rent Now
                      </button>
                      <Link
                        to={`/car/${car._id}`}
                        className="d_car_btn_outline"
                        style={{ textDecoration: "none", textAlign: "center" }}
                      >
                        Details
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
