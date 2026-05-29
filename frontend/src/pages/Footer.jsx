import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import {
  RiCarLine,
  RiFacebookFill,
  RiTwitterFill,
  RiInstagramLine,
  RiLinkedinFill,
  RiMapPinLine,
  RiPhoneLine,
  RiMailLine
} from 'react-icons/ri';
import { Link } from 'react-router-dom';
import '../style/d_style.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="d_footer_section">
      <Container>
        <Row className="d_footer_top gx-4 gy-3">
          <Col lg={4} md={6}>
            <div className="d_footer_brand">
              <div className="d_brand_logo_footer">
                <div className="d_logo_badge_footer">
                  <RiCarLine />
                </div>
                <div className="d_logo_text_footer">
                  <span className="name">Auto<span>X</span></span>
                  <span className="tagline">Premium Rentals</span>
                </div>
              </div>
              <p className="d_footer_about">
                Elevate your journey with AutoX. We provide the most exclusive collection of luxury and exotic vehicles for those who demand excellence.
              </p>
              <div className="d_footer_socials">
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                  <RiFacebookFill />
                </a>
                <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
                  <RiTwitterFill />
                </a>
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                  <RiInstagramLine />
                </a>
                <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
                  <RiLinkedinFill />
                </a>
              </div>
            </div>
          </Col>

       <Col xs={6} lg={2}>
            <div className="d_footer_links">
              <h4 className="d_footer_title">Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/Fleet">Our Fleet</Link></li>
                <li><Link to="/Gallery">Car Gallery</Link></li>
                <li><Link to="/AboutUs">About Us</Link></li>
                <li><Link to="/Feedback">Feedback</Link></li>
              </ul>
            </div>
          </Col>

       <Col xs={6} lg={2}>
            <div className="d_footer_links">
              <h4 className="d_footer_title">Support</h4>
              <ul>
                <li><Link to="/Help">Help Center</Link></li>
                <li><Link to="/FAQ">FAQs</Link></li>
                <li><Link to="/PrivacyPolicy">Privacy Policy</Link></li>
                <li><Link to="/TermsOfService">Terms of Service</Link></li>
              </ul>
            </div>
          </Col>

          <Col lg={4} md={6}>
            <div className="d_footer_contact">
              <h4 className="d_footer_title">Get In Touch</h4>
              <div className="d_contact_item">
                <RiMapPinLine />
                <span>123 Luxury Drive, Beverly Hills, CA 90210</span>
              </div>
              <div className="d_contact_item">
                <RiPhoneLine />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="d_contact_item">
                <RiMailLine />
                <span>support@autox.com</span>
              </div>
            </div>
          </Col>
        </Row>

        <div className="d_footer_bottom">
          <p>&copy; {currentYear} AutoX Premium Car Rentals. All rights reserved.</p>
          <div className="d_footer_bottom_links">
            <a href="#">Sitemap</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
