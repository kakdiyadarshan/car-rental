import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { RiCarWashingLine, RiPhoneLine, RiArrowRightLine } from 'react-icons/ri';
import '../style/d_style.css';
import BookingModal from '../components/BookingModal';
import { useNavigate } from "react-router-dom";

const CTA = () => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const navigate = useNavigate();
  const selectedCar = {
    name: "Premium Selection",
    price: 450,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800"
  };

  return (
    <section className="d_cta_section d_section_padding">
      <div className="d_cta_bg_overlay" />
      <Container>
        <div className="d_cta_content">
          <div className="d_cta_icon">
            <RiCarWashingLine />
          </div>
          <h2 className="d_cta_title d_responsive_title">Ready to Drive Your <span>Dream Car?</span></h2>
          <p className="d_cta_desc d_responsive_subtitle">
            Book now and experience the thrill of premium performance. Your journey to excellence starts with a single click.
          </p>
          
          <div className="d_cta_btns">
          <Button
              className="d_cta_btn_primary"
              onClick={() => navigate("/Fleet")}
            >
              Book Now <RiArrowRightLine />
            </Button>

            {/* Contact Page Redirect */}
            <Button
              className="d_cta_btn_outline"
              onClick={() => navigate("/Contact")}
            >
              <RiPhoneLine /> Contact Support
            </Button>
          </div>
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

export default CTA;
