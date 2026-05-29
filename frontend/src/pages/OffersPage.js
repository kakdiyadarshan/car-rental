import React, { useState, useMemo, useEffect } from 'react';
import { Container, Row, Col, Pagination } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { 
  RiPercentLine, 
  RiCalendarCheckLine, 
  RiVipCrownLine, 
  RiShieldFlashLine,
  RiArrowRightLine,
  RiTimeLine,
  RiArrowLeftSLine,
  RiArrowRightSLine
} from 'react-icons/ri';
import Header from '../components/Header';
import Footer from './Footer';
import CTA from './CTA';
import '../style/d_style.css';
import BookingModal from '../components/BookingModal';

const BASE_OFFERS = [
  {
    id: 1,
    title: "Weekend Getaway Special",
    discount: "20% OFF",
    desc: "Planning a weekend trip? Enjoy an exclusive 20% discount on any of our luxury sedans or SUVs.",
    code: "WEEKEND20",
    color: "#dd6f27",
    image: "https://images.unsplash.com/photo-1542362567-b05503f3f7f4?auto=format&fit=crop&q=80&w=1200",
    validTill: "Valid for 3-day rentals",
    car: { name: "Luxury SUV Selection", price: 350 }
  },
  {
    id: 2,
    title: "First-Time Renter",
    discount: "15% OFF",
    desc: "New to the AutoX experience? We welcome you with a special 15% discount on your first rental.",
    code: "WELCOME15",
    color: "#e8c97a",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=1200",
    validTill: "Limited time offer",
    car: { name: "Exotic Collection", price: 500 }
  },
  {
    id: 3,
    title: "Business Elite Monthly",
    discount: "30% OFF",
    desc: "For those who need long-term premium mobility. Our monthly rentals offer the best rates.",
    code: "ELITE30",
    color: "#dd6f27",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1200",
    validTill: "Minimum 30-day rental",
    car: { name: "Executive Business Sedan", price: 250 }
  },
  {
    id: 4,
    title: "Spring Break Roadtrip",
    discount: "25% OFF",
    desc: "Gear up for your next adventure with our spring break special on all convertible models.",
    code: "SPRING25",
    color: "#e8c97a",
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200",
    validTill: "Valid through April 30",
    car: { name: "Convertible Fleet", price: 420 }
  }
];


// Create a larger dataset by repeating BASE_OFFERS (32 items total for multiple pages)
const OFFERS_DATA = Array.from({ length: 32 }, (_, i) => ({
  ...BASE_OFFERS[i % BASE_OFFERS.length],
  id: i + 1
}));

const OffersPage = () => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // 4 rows with 4 cards each = 16 items per page
  const itemsPerPage = 16;
  
  const totalPages = Math.ceil(OFFERS_DATA.length / itemsPerPage);
  
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return OFFERS_DATA.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClaimOffer = (offer) => {
    setSelectedCar({
      ...offer.car,
      image: offer.image
    });
    setShowBookingModal(true);
  };

  

  return (
    <>
      <section className="d_offers_page_section d_section_padding" style={{ background: 'var(--x-bg)', color: 'var(--x-text)' }}>
        {/* Header Section */}
        <Container>
          <div className="d_fleet_header d_mb_responsive" style={{ textAlign: 'center' }}>
            <span className="d_fleet_eyebrow" style={{ 
              display: 'block', 
              color: 'var(--x-primary)', 
              fontSize: '0.9rem', 
              fontWeight: 700, 
              textTransform: 'uppercase', 
              letterSpacing: '4px',
              marginBottom: '15px'
            }}>Exclusive Deals</span>
            <h1 className="d_fleet_title d_responsive_title" style={{ fontFamily: 'Bebas Neue', letterSpacing: '2px' }}>Limited Time <span style={{ color: 'var(--x-primary)' }}>Offers</span></h1>
            <div style={{ width: '80px', height: '3px', background: 'var(--x-primary)', margin: '20px auto' }}></div>
            <p className="d_responsive_subtitle" style={{ color: 'var(--x-text-muted)', maxWidth: '700px', margin: '15px auto 0', lineHeight: '1.8' }}>
              Premium performance shouldn't always come at a premium price. Explore our latest curated deals designed for your next extraordinary journey.
            </p>
          </div>

          <Row className="g-4">
            {currentItems.map((offer) => (
              <Col key={offer.id} xl={3} lg={4} md={6}>
                <div className="d_offer_card_premium" style={{ 
                  background: 'var(--x-surface)', 
                  borderRadius: '16px', 
                  border: '1px solid var(--x-border)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  height: '100%',
                  position: 'relative'
                }}>
                  {/* Image Section */}
                  <div style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
                    <img 
                      src={offer.image} 
                      alt={offer.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                      className="d_offer_img"
                    />
                    <div style={{ 
                      position: 'absolute', 
                      top: '12px', 
                      left: '12px', 
                      background: 'var(--x-primary)', 
                      padding: '6px 12px', 
                      borderRadius: '4px',
                      color: '#fff',
                      fontWeight: 800,
                      fontFamily: 'Bebas Neue',
                      fontSize: '1.2rem',
                      letterSpacing: '0.5px',
                      zIndex: 2
                    }}>
                      {offer.discount}
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'stretch', 
                      gap: '6px', 
                      color: 'var(--x-primary)', 
                      fontSize: '0.7rem', 
                      fontWeight: 700, 
                      textTransform: 'uppercase', 
                      letterSpacing: '1px',
                      marginBottom: '10px' 
                    }}>
                      <RiTimeLine size={14} style={{marginTop: '1px'}} /> {offer.validTill}
                    </div>
                    
                    <h2 style={{ 
                      fontFamily: 'Bebas Neue', 
                      fontSize: '1.6rem', 
                      marginBottom: '12px', 
                      letterSpacing: '0.5px',
                      color: 'var(--x-text)',
                      lineHeight: '1.2'
                    }}>
                      {offer.title}
                    </h2>
                    
                    <p style={{ 
                      color: 'var(--x-text-muted)', 
                      lineHeight: '1.5', 
                      fontSize: '0.85rem', 
                      marginBottom: '20px',
                      flex: 1
                    }}>
                      {offer.desc}
                    </p>
                    
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      gap: '10px',
                      marginTop: 'auto'
                    }}>
                      {/* Promo Code Box */}
                      <div style={{ 
                        background: 'rgba(221, 111, 39, 0.05)', 
                        border: '1px dashed rgba(221, 111, 39, 0.25)', 
                        padding: '10px 15px', 
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        position: 'relative'
                      }}>
                        <strong style={{ color: 'var(--x-text)', fontSize: '0.95rem', fontFamily: 'monospace', letterSpacing: '1px' }}>{offer.code}</strong>
                        <div 
                          style={{ 
                            fontSize: '0.6rem', 
                            color: 'var(--x-primary)', 
                            fontWeight: 700, 
                            textTransform: 'uppercase', 
                            cursor: 'pointer',
                            padding: '3px 8px',
                            background: 'rgba(221, 111, 39, 0.1)',
                            borderRadius: '4px',
                            transition: 'all 0.2s ease'
                          }}
                          className="d_copy_btn"
                          onClick={() => {
                            navigator.clipboard.writeText(offer.code);
                            toast.success("Code Copied!");
                          }}
                        >
                          Copy
                        </div>
                      </div>
                      
                      <button 
                        className="d_offer_claim_btn" 
                        onClick={() => handleClaimOffer(offer)}
                        style={{
                          background: 'linear-gradient(135deg, var(--x-primary) 0%, #b8551d 100%)',
                          color: '#fff',
                          border: 'none',
                          padding: '12px',
                          borderRadius: '8px',
                          fontFamily: 'DM Sans, sans-serif',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer'
                        }}
                      >
                        Claim Now
                        <RiArrowRightLine className="d_arrow_icon" size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>

          {/* Custom Pagination UI */}
          {totalPages > 1 && (
            <div style={{ 
              marginTop: '60px', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '12px' 
            }}>
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  background: 'var(--x-surface)',
                  border: '1px solid var(--x-border)',
                  color: currentPage === 1 ? 'var(--x-text-muted)' : 'var(--x-primary)',
                  width: '45px',
                  height: '45px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
                className="d_page_nav_btn"
              >
                <RiArrowLeftSLine size={24} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => handlePageChange(num)}
                  style={{
                    background: currentPage === num ? 'var(--x-primary)' : 'var(--x-surface)',
                    border: '1px solid ' + (currentPage === num ? 'var(--x-primary)' : 'var(--x-border)'),
                    color: currentPage === num ? '#fff' : 'var(--x-text)',
                    width: '45px',
                    height: '45px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontFamily: 'DM Sans, sans-serif',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  className={currentPage === num ? '' : 'd_page_num_btn'}
                >
                  {num}
                </button>
              ))}

              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  background: 'var(--x-surface)',
                  border: '1px solid var(--x-border)',
                  color: currentPage === totalPages ? 'var(--x-text-muted)' : 'var(--x-primary)',
                  width: '45px',
                  height: '45px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
                className="d_page_nav_btn"
              >
                <RiArrowRightSLine size={24} />
              </button>
            </div>
          )}

          {/* Benefits Section */}
          <div className="pt-5">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 className="d_fleet_title" style={{ fontSize: '2.5rem' }}>Why Book With <span>Offers?</span></h2>
            </div>
            <Row className="g-5 text-center justify-content-center mx-0">
              {[
                { icon: <RiVipCrownLine />, title: "Loyalty Rewards", desc: "Earn points on every discounted rental and unlock exclusive VIP-only perks." },
                { icon: <RiShieldFlashLine />, title: "Best Price Policy", desc: "Found a better rate? We'll match it and give you an extra 5% off your booking." },
                { icon: <RiCalendarCheckLine />, title: "Flexible Dates", desc: "Easily reschedule your discounted bookings at no extra cost to you." }
              ].map((item, i) => (
                <Col lg={4} md={6} key={i}>
                  <div style={{ 
                    padding: '40px', 
                    background: 'var(--x-surface)', 
                    borderRadius: '20px', 
                    border: '1px solid var(--x-border)',
                    height: '100%',
                    transition: 'transform 0.3s ease'
                  }} className="d_benefit_card">
                    <div style={{ color: 'var(--x-primary)', fontSize: '3rem', marginBottom: '25px' }}>{item.icon}</div>
                    <h4 style={{ fontFamily: 'Bebas Neue', letterSpacing: '1px', marginBottom: '18px', fontSize: '1.8rem' }}>{item.title}</h4>
                    <p style={{ color: 'var(--x-text-muted)', fontSize: '1rem', lineHeight: '1.6' }}>{item.desc}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </Container>
      </section>

      {/* Booking Modal */}
      <BookingModal
        show={showBookingModal}
        onHide={() => setShowBookingModal(false)}
        selectedCar={selectedCar}
      />

      <CTA />
      <Footer />
    </>
  );
};

export default OffersPage;
