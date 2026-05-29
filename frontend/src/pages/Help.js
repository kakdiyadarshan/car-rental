import React from 'react';
import { Container, Row, Col, Accordion } from 'react-bootstrap';
import {
  RiPhoneLine,
  RiMailLine,
  RiMapPinLine,
  RiArrowRightLine
} from 'react-icons/ri';
import Header from '../components/Header';
import Footer from './Footer';
import CTA from './CTA';
import '../style/d_style.css';

const Help = () => {
  const FAQS = [
    {
      q: "How do I book a premium car?",
      a: "Simply browse our fleet, select your preferred vehicle, choose your dates and location, and complete the secure checkout process. You'll receive an instant confirmation email."
    },
    {
      q: "What is the minimum age for exotic rentals?",
      a: "For our exotic collection (Lamborghini, Ferrari, etc.), the minimum age is 25. For luxury and standard models, the minimum age is 21."
    },
    {
      q: "Are there any hidden charges?",
      a: "No. At AutoX, we pride ourselves on absolute transparency. The price you see during booking includes standard insurance and taxes."
    },
    {
      q: "Can I get the car delivered to my hotel?",
      a: "Yes! We offer concierge delivery to any hotel, airport, or residence within our service areas. This can be selected during the booking process."
    }
  ];

  return (
    <>
      {/* <Header /> */}
      <section className="d_help_page_section pb-0" style={{ background: 'var(--x-bg)', color: 'var(--x-text)' }}>
        {/* Header */}
        <div className="d_fleet_header" style={{ textAlign: 'center' }}>
          <span className="d_fleet_eyebrow">Support Center</span>
          <h1 className="d_fleet_title">How Can We <span>Help You?</span></h1>
          <p className="d_help_subtitle" style={{ color: 'var(--x-text-muted)', maxWidth: '700px', margin: '20px auto 0', fontSize: '1.1rem' }}>
            Find answers to common questions or reach out to our 24/7 concierge team.
          </p>
        </div>

        <Container>
          {/* Support Channels */}
          <Row className="g-3 g-md-4 mb-4 mb-md-5">
            {[
              {
                icon: <RiPhoneLine />,
                title: "24/7 Concierge",
                detail: "+1 (555) 123-4567",
                action: "Call Now",
                onClick: () => window.location.href = "tel:+15551234567"
              },
              {
                icon: <RiMailLine />,
                title: "Email Support",
                detail: "vip@autox.com",
                action: "Send Email",
                onClick: () => window.open("https://mail.google.com/mail/?view=cm&to=vip@autox.com", "_blank")
              },
              {
                icon: <RiMapPinLine />,
                title: "Global HQ",
                detail: "Beverly Hills, CA",
                action: "Get Directions",
                onClick: () => window.open("https://www.google.com/maps?q=Beverly+Hills+CA", "_blank")
              }
            ].map((item, i) => (
              <Col md={4} key={i}>
                <div className="d_wcu_feature_card d_help_channel_card" style={{ textAlign: 'center', height: '100%' }}>

                  <div style={{ color: 'var(--x-primary)', fontSize: '2.5rem', marginBottom: '20px', marginTop: '-20px' }}>
                    {item.icon}
                  </div>

                  <h3 style={{ fontFamily: 'Bebas Neue', letterSpacing: '1px', fontSize: '1.5rem', marginBottom: '10px' }}>
                    {item.title}
                  </h3>

                  <p style={{ color: 'var(--x-text)', fontWeight: 600, marginBottom: '20px' }}>
                    {item.detail}
                  </p>

                  <button
                    className="d_car_btn_outline"
                    style={{ margin: '0 auto' }}
                    onClick={item.onClick}
                  >
                    {item.action}
                  </button>

                </div>
              </Col>
            ))}
          </Row>

          {/* FAQs Section */}
          <Row className="g-4 g-lg-5 align-items-center mt-3 mt-md-5 pt-3 mb-4 mb-lg-0">
            <Col lg={6}>
              <div className="d_help_faq_content">
                <span className="d_fleet_eyebrow" style={{ textAlign: 'left' }}>Knowledge Base</span>
                <h2 className="d_fleet_title d_help_faq_title" style={{ fontSize: '2.5rem', textAlign: 'left' }}>Common <span>Questions</span></h2>
                <Accordion defaultActiveKey="0" className="d_custom_accordion">
                  {FAQS.map((faq, index) => (
                    <Accordion.Item eventKey={index.toString()} key={index}>
                      <Accordion.Header>{faq.q}</Accordion.Header>
                      <Accordion.Body>{faq.a}</Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </div>
            </Col>
            <Col lg={6}>
              <div className="d_help_img_box" style={{ padding: '20px', background: 'var(--x-surface)', borderRadius: '20px', border: '1px solid var(--x-border)' }}>
                <img
                  src="https://demo.awaikenthemes.com/novaride/dark/wp-content/uploads/2024/08/post-1.jpg"
                  alt="Customer Support"
                  style={{ width: '100%', borderRadius: '12px' }}
                />
              </div>
            </Col>
          </Row>
        </Container>
        <CTA />
      </section>
      <Footer />
    </>
  );
};

export default Help;
