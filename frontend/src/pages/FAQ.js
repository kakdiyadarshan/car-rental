import React from 'react';
import { Container, Accordion } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from './Footer';
import '../style/d_style.css';

const FAQ = () => {
  const FAQS = [
    {
      q: "What do I need to rent a car?",
      a: "You will need a valid driver's license (with at least 2 years of experience), a valid passport or ID card, and a credit card for the security deposit. International renters may require an International Driving Permit (IDP)."
    },
    {
      q: "Can I cancel my reservation?",
      a: "Yes, you can cancel your reservation through our Help Center. Cancellations made more than 48 hours before the pickup time are free. Cancellations within 48 hours will incur a one-day rental fee."
    },
    {
      q: "Is there a mileage limit?",
      a: "Most of our standard luxury and SUV rentals include unlimited mileage. However, exotic vehicles like Lamborghini and Ferrari models have a daily mileage limit. Please check the vehicle details page for specific limits."
    },
    {
      q: "What happens if I return the car late?",
      a: "A grace period of 59 minutes is typically allowed. Beyond that, a late return fee of one full rental day may apply. Please contact us immediately if you anticipate being late."
    },
    {
      q: "Are the vehicles insured?",
      a: "Yes, all our vehicles include comprehensive insurance with a standard deductible. You can also opt for additional coverage during the booking process to reduce your liability."
    },
    {
      q: "Can I add an additional driver?",
      a: "Yes, you can add up to two additional drivers during the booking process or at the time of pickup. Additional drivers must meet the same age and licensing requirements as the primary renter."
    },
    {
      q: "What is the policy for fuel?",
      a: "Our standard policy is 'Full-to-Full'. We provide the car with a full tank, and we expect it to be returned full. If not, a refueling fee plus the cost of fuel will be charged."
    }
  ];

  return (
    <>
      <section className="d_faq_page_section d_section_padding" style={{ background: 'var(--x-bg)', minHeight: '100vh', color: 'var(--x-text)' }}>
        <Container>
          {/* Header */}
          <div className="d_fleet_header d_mb_responsive" style={{ textAlign: 'center' }}>
            <span className="d_fleet_eyebrow">Everything you need to know</span>
            <h1 className="d_fleet_title d_responsive_title">Frequently Asked <span>Questions</span></h1>
            <p className="d_responsive_subtitle" style={{ color: 'var(--x-text-muted)', maxWidth: '650px', margin: '20px auto 0', lineHeight: '1.8' }}>
              Got questions? We've got answers. Explore our knowledge base for everything from booking details to rental policies.
            </p>
          </div>
          
          <div className="d_faq_content" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <Accordion defaultActiveKey="0" className="d_custom_accordion">
              {FAQS.map((faq, index) => (
                <Accordion.Item eventKey={index.toString()} key={index} style={{ background: 'var(--x-surface)', border: '1px solid var(--x-border)', marginBottom: '15px', borderRadius: '12px', overflow: 'hidden' }}>
                  <Accordion.Header style={{ background: 'transparent' }}>
                    <span style={{ fontFamily: 'Bebas Neue', letterSpacing: '1px', fontSize: '1.2rem', color: 'var(--x-text)' }}>{faq.q}</span>
                  </Accordion.Header>
                  <Accordion.Body style={{ background: 'var(--x-surface2)', color: 'var(--x-text-muted)', lineHeight: '1.8' }}>
                    {faq.a}
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </div>
        </Container>
      </section>
      <Footer />
    </>
  );
};

export default FAQ;
