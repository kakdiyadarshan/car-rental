import React, { useState } from 'react';
import { Carousel, Container, Button } from 'react-bootstrap';
import { 
  RiArrowRightLine, 
  RiSpeedUpLine, 
  RiRoadsterLine, 
  RiShieldCheckLine, 
  RiMapPinRangeLine 
} from 'react-icons/ri';
import '../style/d_style.css';
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
    <section className="d_hero_section_container">
      <Carousel 
        fade 
        indicators={true} 
        interval={3000} 
        controls={false}
        className="d_main_hero_carousel"
      >
        {SLIDE_DATA.map((slide, index) => (
          <Carousel.Item key={slide.id}>
            {/* Background Image with Ken Burns Effect */}
            <div 
              className="d_hero_bg_img" 
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="d_hero_dark_overlay" />
            </div>
            
            <Carousel.Caption className="d_hero_caption_layer">
              <Container>
                <div className="d_hero_text_content">
                  <div className="d_hero_meta_top">
                    <span className="d_hero_index">0{index + 1}</span>
                    <span className="d_hero_tag_line">{slide.tag}</span>
                  </div>

                  <h1 className="d_hero_main_title">
                    {slide.title} <br />
                    <span className="d_hero_outline_txt">{slide.subTitle}</span>
                  </h1>

                  <p className="d_hero_description">{slide.desc}</p>
                  
                  <div className="d_hero_btns_row">
                    <Button
                      className="d_hero_btn_cta"
                      onClick={() => navigate("/Fleet")}
                    >
                      Explore Now <RiArrowRightLine size={18} />
                    </Button>
                    <div className="d_hero_spec_badge">
                      <RiSpeedUpLine /> {slide.spec}
                    </div>
                  </div>

                  {/* Feature Grid - Hidden on tablets and below */}
                  <div className="d_hero_feature_bar d-none d-md-flex">
                    <div className="d_hero_feat_item">
                      <RiShieldCheckLine size={20} />
                      <span>Full Insurance</span>
                    </div>
                    <div className="d_hero_feat_item">
                      <RiMapPinRangeLine size={20} />
                      <span>Anywhere Delivery</span>
                    </div>
                    <div className="d_hero_feat_item">
                      <RiRoadsterLine size={20} />
                      <span>Latest Models</span>
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