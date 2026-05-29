import React from 'react';
import { Container } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from './Footer';
import '../style/d_style.css';

const PrivacyPolicy = () => {
  return (
    <>
      <section className="d_legal_page_section d_section_padding" style={{ background: 'var(--x-bg)', minHeight: '100vh', color: 'var(--x-text)' }}>
        <Container>
          <div className="d_fleet_header d_mb_responsive" style={{ textAlign: 'center' }}>
            <span className="d_fleet_eyebrow">Trust & Transparency</span>
            <h1 className="d_fleet_title d_responsive_title">Privacy <span>Policy</span></h1>
          </div>
          
          <div className="d_legal_content" style={{ maxWidth: '900px', margin: '0 auto', background: 'var(--x-surface)', padding: '40px', borderRadius: '16px', border: '1px solid var(--x-border)', lineHeight: '1.8' }}>
            <h3 style={{ fontFamily: 'Bebas Neue', letterSpacing: '1px', color: 'var(--x-primary)', marginBottom: '20px' }}>1. Information We Collect</h3>
            <p style={{ color: 'var(--x-text-muted)', marginBottom: '30px' }}>
              At AutoX, we collect various types of information to provide and improve our premium car rental services. This includes personal identification (name, email, phone), driver's license details, and payment information required for secure transactions.
            </p>

            <h3 style={{ fontFamily: 'Bebas Neue', letterSpacing: '1px', color: 'var(--x-primary)', marginBottom: '20px' }}>2. How We Use Your Data</h3>
            <p style={{ color: 'var(--x-text-muted)', marginBottom: '30px' }}>
              Your data is primarily used to process bookings, verify identity for insurance purposes, and communicate important updates regarding your rental. We also use anonymized data to analyze our fleet performance and improve user experience.
            </p>

            <h3 style={{ fontFamily: 'Bebas Neue', letterSpacing: '1px', color: 'var(--x-primary)', marginBottom: '20px' }}>3. Data Protection & Security</h3>
            <p style={{ color: 'var(--x-text-muted)', marginBottom: '30px' }}>
              We implement industry-standard encryption and security protocols to protect your sensitive information. Our systems are regularly audited to ensure compliance with global data protection regulations.
            </p>

            <h3 style={{ fontFamily: 'Bebas Neue', letterSpacing: '1px', color: 'var(--x-primary)', marginBottom: '20px' }}>4. Third-Party Sharing</h3>
            <p style={{ color: 'var(--x-text-muted)', marginBottom: '30px' }}>
              We do not sell your personal data. We only share necessary information with trusted partners such as insurance providers and payment processors to facilitate your rental experience.
            </p>

            <h3 style={{ fontFamily: 'Bebas Neue', letterSpacing: '1px', color: 'var(--x-primary)', marginBottom: '20px' }}>5. Your Rights</h3>
            <p style={{ color: 'var(--x-text-muted)', marginBottom: '10px' }}>
              You have the right to:
            </p>
            <ul style={{ color: 'var(--x-text-muted)', marginBottom: '30px' }}>
              <li>Access and update your personal information.</li>
              <li>Request deletion of your data (subject to legal requirements).</li>
              <li>Opt-out of marketing communications at any time.</li>
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

export default PrivacyPolicy;
