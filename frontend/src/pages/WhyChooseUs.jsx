import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { 
  RiShieldStarLine, 
  RiMoneyDollarCircleLine, 
  RiCustomerService2Line, 
  RiRoadMapLine 
} from 'react-icons/ri';
import '../style/d_style.css';

const FEATURES = [
  {
    id: 1,
    icon: <RiShieldStarLine />,
    title: "Premium Protection",
    desc: "Comprehensive insurance coverage for total peace of mind during your luxury drive."
  },
  {
    id: 2,
    icon: <RiMoneyDollarCircleLine />,
    title: "Best Price Guarantee",
    desc: "Unbeatable rates for the world's most exclusive automotive brands and models."
  },
  {
    id: 3,
    icon: <RiCustomerService2Line />,
    title: "24/7 VIP Support",
    desc: "Dedicated concierge service available around the clock for any assistance you need."
  },
  {
    id: 4,
    icon: <RiRoadMapLine />,
    title: "Anywhere Delivery",
    desc: "We bring the car to your doorstep, airport, or hotel. Your convenience is our priority."
  }
];

const WhyChooseUs = () => {
  return (
    <section className="d_why_choose_section d_section_padding">
      <Container>
        <Row className="align-items-center">
          <Col lg={6} className="mb-md-5 mb-3 mb-lg-0">
            <div className="d_wcu_text_content">
              <span className="d_wcu_eyebrow">The AutoX Advantage</span>
              <h2 className="d_wcu_title d_responsive_title">Why Choose Our <span>Service</span></h2>
              <p className="d_wcu_desc d_responsive_subtitle">
                We redefine the luxury car rental experience with a focus on quality, speed, and personalized service that exceeds expectations.
              </p>
              
              <div className="d_wcu_stats">
                <div className="d_stat_item">
                  <span className="d_stat_num">150+</span>
                  <span className="d_stat_label">Luxury Cars</span>
                </div>
                <div className="d_stat_item">
                  <span className="d_stat_num">12k+</span>
                  <span className="d_stat_label">Happy Clients</span>
                </div>
                <div className="d_stat_item">
                  <span className="d_stat_num">25+</span>
                  <span className="d_stat_label">Locations</span>
                </div>
              </div>
            </div>
          </Col>

          <Col lg={6}>
            <Row className="g-4">
              {FEATURES.map((feat) => (
                <Col key={feat.id} sm={6}>
                  <div className="d_wcu_feature_card">
                    <div className="d_wcu_icon_box">
                      {feat.icon}
                    </div>
                    <h3 className="d_wcu_feature_title">{feat.title}</h3>
                    <p className="d_wcu_feature_desc">{feat.desc}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default WhyChooseUs;
