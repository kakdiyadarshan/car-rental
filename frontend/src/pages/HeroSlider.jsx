import React, { useState } from 'react';
import { Carousel, Container, Button } from 'react-bootstrap';
import { 
  RiArrowRightLine, 
  RiSpeedUpLine, 
  RiRoadsterLine, 
  RiShieldCheckLine, 
  RiMapPinRangeLine 
} from 'react-icons/ri';
import BookingModal from '../components/BookingModal';
import { useNavigate } from 'react-router-dom';

const SLIDE_DATA = [
  {
    id: 1,
    tag: "Exotic Collection",
    title: "Precision",
    subTitle: "Engineering",
    desc: "Unleash the power of elite performance. Our fleet represents the pinnacle of automotive craftsmanship.",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1920",
    spec: "0-60 in 2.8s"
  },
  {
    id: 2,
    tag: "Modern Luxury",
    title: "Chauffeur",
    subTitle: "Class",
    desc: "Arrive in style. Experience unparalleled comfort with our executive sedan series for business and gala events.",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1920",
    spec: "VIP Comfort"
  },
  {
    id: 3,
    tag: "Off-Road Kings",
    title: "Command",
    subTitle: "The Terrain",
    desc: "Go where others won't. Dominate the landscape with our reinforced 4x4 and adventure-ready SUV fleet.",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1920",
    spec: "All-Terrain 4WD"
  },
  {
    id: 4,
    tag: "Electric Future",
    title: "Silent",
    subTitle: "Revolution",
    desc: "The future is here. Sustainable power meets instant torque in our premium electric vehicle category.",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=1920",
    spec: "Eco-Performance"
  }
];

const HeroSlider = () => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const navigate = useNavigate();

  const openBookingModal = (slide) => {
    setSelectedCar({
      name: slide.tag + " - " + slide.title,
      price: 500, // Dummy price
      image: slide.image
    });
    setShowBookingModal(true);
  };

  return (
    <section className="relative w-full overflow-hidden bg-x-bg">
      <Carousel 
        fade 
        indicators={true} 
        interval={4000} 
        controls={false}
        className="h-screen"
      >
        {SLIDE_DATA.map((slide, index) => (
          <Carousel.Item key={slide.id} className="h-screen">
            {/* Background Image with Ken Burns Effect */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] scale-100 group-active:scale-110" 
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-x-bg via-x-bg/60 to-transparent z-[1]" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-x-bg z-[1]" />
            </div>
            
            <Carousel.Caption className="absolute inset-0 flex items-center justify-center text-left p-0 z-[2]">
              <Container>
                <div className="max-w-[850px] space-y-6 md:space-y-8 px-4 md:px-0">
                  <div className="flex items-center gap-5 translate-y-10 opacity-0 animate-x_slideUp [animation-fill-mode:forwards]">
                    <span className="font-bebas text-2xl text-x-primary tracking-widest">0{index + 1}</span>
                    <span className="h-px w-10 bg-white/20"></span>
                    <span className="font-jakarta font-bold text-white uppercase tracking-[5px] text-xs md:text-sm">{slide.tag}</span>
                  </div>

                  <h1 className="font-bebas text-6xl md:text-[8rem] leading-[0.9] text-white uppercase select-none tracking-tight translate-y-10 opacity-0 animate-x_slideUp [animation-delay:200ms] [animation-fill-mode:forwards] [text-shadow:0_10px_30px_rgba(0,0,0,0.3)]">
                    {slide.title} <br />
                    <span className="text-transparent !stroke-x-primary [-webkit-text-stroke:2px_#dd6f27]">{slide.subTitle}</span>
                  </h1>

                  <p className="font-dm text-x-text-muted text-sm md:text-lg max-w-[550px] leading-relaxed translate-y-10 opacity-0 animate-x_slideUp [animation-delay:400ms] [animation-fill-mode:forwards]">
                    {slide.desc}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-5 pt-4 translate-y-10 opacity-0 animate-x_slideUp [animation-delay:600ms] [animation-fill-mode:forwards]">
                    <Button
                      className="group flex items-center justify-center gap-2 bg-x-primary border-none text-white font-bold uppercase tracking-wider text-xs md:text-sm px-8 py-4 rounded-xl transition-all hover:bg-x-accent hover:text-x-bg hover:shadow-[0_15px_30px_rgba(221,111,39,0.3)]"
                      onClick={() => navigate("/Fleet")}
                    >
                      Explore Now <RiArrowRightLine size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-4 rounded-xl text-white font-semibold text-xs md:text-sm">
                      <RiSpeedUpLine className="text-x-primary" size={20} /> {slide.spec}
                    </div>
                  </div>

                  {/* Feature Bar */}
                  <div className="hidden md:flex items-center gap-10 pt-12 translate-y-10 opacity-0 animate-x_slideUp [animation-delay:800ms] [animation-fill-mode:forwards]">
                    <div className="flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-x-primary/20 group-hover:border-x-primary/40 transition-colors">
                        <RiShieldCheckLine size={20} className="text-x-primary" />
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-x-text-muted font-bold group-hover:text-x-text transition-colors">Full Insurance</span>
                    </div>
                    <div className="flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-x-primary/20 group-hover:border-x-primary/40 transition-colors">
                        <RiMapPinRangeLine size={20} className="text-x-primary" />
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-x-text-muted font-bold group-hover:text-x-text transition-colors">Anywhere Delivery</span>
                    </div>
                    <div className="flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-x-primary/20 group-hover:border-x-primary/40 transition-colors">
                        <RiRoadsterLine size={20} className="text-x-primary" />
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-x-text-muted font-bold group-hover:text-x-text transition-colors">Latest Models</span>
                    </div>
                  </div>
                </div>
              </Container>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Booking Modal */}
      <BookingModal
        show={showBookingModal}
        onHide={() => setShowBookingModal(false)}
        selectedCar={selectedCar}
      />
    </section>
  );
};

export default HeroSlider;