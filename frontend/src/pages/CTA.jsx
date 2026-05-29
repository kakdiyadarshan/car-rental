import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { RiCarWashingLine, RiPhoneLine, RiArrowRightLine } from 'react-icons/ri';
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
    <section className="relative py-24 bg-x-primary overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black opacity-[0.1] rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
      </div>

      <Container className="relative z-10">
        <div className="max-w-[900px] mx-auto text-center space-y-10 group">
          <div className="w-24 h-24 bg-white/10 rounded-[32px] flex items-center justify-center text-white text-5xl mx-auto transition-transform duration-700 group-hover:rotate-[360deg] shadow-2xl">
            <RiCarWashingLine />
          </div>
          
          <h2 className="font-bebas text-5xl md:text-[5rem] text-white tracking-widest uppercase leading-none select-none">
            Ready to Drive Your <span className="text-transparent !stroke-white [-webkit-text-stroke:1px_#fff]">Dream Car?</span>
          </h2>
          
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto font-dm leading-relaxed">
            Book now and experience the thrill of premium performance. Your journey to excellence starts with a single click in our exclusive fleet.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-4">
            <Button
              className="w-full md:w-auto px-10 py-5 bg-white text-x-primary border-none rounded-2xl font-bold uppercase tracking-[2px] text-sm flex items-center justify-center gap-3 transition-all hover:bg-x-accent hover:text-white hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)] active:translate-y-0 shadow-xl"
              onClick={() => navigate("/Fleet")}
            >
              Book Now <RiArrowRightLine size={18} />
            </Button>

            <Button
              className="w-full md:w-auto px-10 py-5 bg-transparent border-2 border-white/20 text-white rounded-2xl font-bold uppercase tracking-[2px] text-sm flex items-center justify-center gap-3 transition-all hover:bg-white/10 hover:border-white hover:-translate-y-1"
              onClick={() => navigate("/Contact")}
            >
              <RiPhoneLine size={18} /> Contact Support
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

