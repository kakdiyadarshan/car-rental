import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { 
  RiMapPinLine, 
  RiCalendarCheckLine, 
  RiCarLine, 
  RiArrowRightLine 
} from 'react-icons/ri';
import '../style/d_style.css';

const STEPS = [
  {
    id: 1,
    icon: <RiMapPinLine size={32} />,
    title: "Choose Location",
    desc: "Select your preferred pickup point from our extensive network of premium outlets across the city.",
    color: "#dd6f27"
  },
  {
    id: 2,
    icon: <RiCalendarCheckLine size={32} />,
    title: "Pick-Up Date",
    desc: "Flexible scheduling options that fit your timeline. Book instantly with our real-time availability system.",
    color: "#e8c97a"
  },
  {
    id: 3,
    icon: <RiCarLine size={32} />,
    title: "Book Your Car",
    desc: "Confirm your reservation with a few clicks. No hidden fees, just pure performance at your fingertips.",
    color: "#dd6f27"
  }
];

const HowItWorks = () => {
  return (
    <section className="d_how_it_works_section d_section_padding">
      <Container>
        {/* Header */}
        <div className="d_hiw_header d_mb_responsive">
          <span className="d_hiw_eyebrow">Seamless Process</span>
          <h2 className="d_hiw_title d_responsive_title">How It <span>Works</span></h2>
          <p className="d_hiw_subtitle d_responsive_subtitle">
            Experience the future of car rentals with our streamlined three-step booking process designed for speed and convenience.
          </p>
        </div>

        {/* Steps Grid */}
        <Row className="d_hiw_steps_row">
          {STEPS.map((step, index) => (
            <Col key={step.id} lg={4} md={6} className="d_hiw_step_col">
              <div className="d_hiw_card_wrapper">
                {/* Connection Line (Hidden on mobile) */}
                {index < STEPS.length - 1 && (
                  <div className="d_hiw_connector d-none d-lg-block">
                    <RiArrowRightLine />
                  </div>
                )}

                <div className="d_hiw_card">
                  <div className="d_hiw_icon_box" style={{ '--step-color': step.color }}>
                    <div className="d_hiw_icon_inner">
                      {step.icon}
                    </div>
                    <span className="d_hiw_number">0{step.id}</span>
                  </div>
                  
                  <div className="d_hiw_content">
                    <h3 className="d_hiw_step_title">{step.title}</h3>
                    <p className="d_hiw_step_desc">{step.desc}</p>
                  </div>

                  {/* Decorative element */}
                  <div className="d_hiw_card_bg_glow" style={{ background: step.color }} />
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default HowItWorks;
