import React from 'react';
import { Container } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from './Footer';
import '../style/d_style.css';

const TermsOfService = () => {
  return (
    <>
      <section className="d_legal_page_section d_section_padding" style={{ background: 'var(--x-bg)', minHeight: '100vh', color: 'var(--x-text)' }}>
        <Container>
          <div className="d_fleet_header d_mb_responsive" style={{ textAlign: 'center' }}>
            <span className="d_fleet_eyebrow">Service Agreement</span>
            <h1 className="d_fleet_title d_responsive_title">Terms of <span>Service</span></h1>
          </div>
          
          <div className="d_legal_content" style={{ maxWidth: '900px', margin: '0 auto', background: 'var(--x-surface)', padding: '40px', borderRadius: '16px', border: '1px solid var(--x-border)', lineHeight: '1.8' }}>
            <h3 style={{ fontFamily: 'Bebas Neue', letterSpacing: '1px', color: 'var(--x-primary)', marginBottom: '20px' }}>1. Rental Eligibility</h3>
            <p style={{ color: 'var(--x-text-muted)', marginBottom: '30px' }}>
              Drivers must be at least 21 years old and possess a valid driver's license with at least 2 years of driving experience. For exotic vehicles, the minimum age requirement is 25 years.
            </p>

            <h3 style={{ fontFamily: 'Bebas Neue', letterSpacing: '1px', color: 'var(--x-primary)', marginBottom: '20px' }}>2. Booking & Cancellation</h3>
            <p style={{ color: 'var(--x-text-muted)', marginBottom: '30px' }}>
              Reservations are confirmed upon successful payment. Cancellations made more than 48 hours before the rental start time are eligible for a full refund. Cancellations within 48 hours are subject to a one-day rental fee.
            </p>

            <h3 style={{ fontFamily: 'Bebas Neue', letterSpacing: '1px', color: 'var(--x-primary)', marginBottom: '20px' }}>3. Vehicle Usage & Responsibility</h3>
            <p style={{ color: 'var(--x-text-muted)', marginBottom: '30px' }}>
              The renter is responsible for the vehicle during the rental period. Smoking, racing, or off-roading (unless specified for the vehicle type) is strictly prohibited and will result in significant fines and termination of the rental.
            </p>

            <h3 style={{ fontFamily: 'Bebas Neue', letterSpacing: '1px', color: 'var(--x-primary)', marginBottom: '20px' }}>4. Insurance & Damage</h3>
            <p style={{ color: 'var(--x-text-muted)', marginBottom: '30px' }}>
              All rentals include standard insurance coverage. In the event of an accident or damage, the renter is responsible for the insurance deductible as specified in the rental agreement.
            </p>

            <h3 style={{ fontFamily: 'Bebas Neue', letterSpacing: '1px', color: 'var(--x-primary)', marginBottom: '20px' }}>5. Return Policy</h3>
            <p style={{ color: 'var(--x-text-muted)', marginBottom: '10px' }}>
              Vehicles must be returned:
            </p>
            <ul style={{ color: 'var(--x-text-muted)', marginBottom: '30px' }}>
              <li>At the agreed-upon time and location.</li>
              <li>With the same fuel level as at the start of the rental.</li>
              <li>In a clean condition (excessive cleaning fees may apply).</li>
            </ul>

            <p className='d_legal_lastp' style={{ fontSize: '0.85rem', color: 'var(--x-primary)', marginTop: '40px' }}>
              Last Updated: March 25, 2026
            </p>
          </div>
        </Container>
      </section>
      <Footer />
    </>
  );
};

export default TermsOfService;
