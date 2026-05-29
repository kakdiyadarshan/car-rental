import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { RiImageLine, RiSearchLine, RiArrowRightLine, RiZoomInLine } from 'react-icons/ri';
import Header from '../components/Header';
import Footer from './Footer';
import CTA from './CTA';
import '../style/d_style.css';
import { useGetCarsQuery } from '../slices/carsApiSlice';

const GalleryPage = () => {
  const { data: cars, isLoading, error } = useGetCarsQuery();
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = useMemo(() => {
    if (!cars) return ['All'];
    const cats = new Set(cars.map(car => car.category));
    return ['All', ...Array.from(cats)];
  }, [cars]);

  const filteredCars = useMemo(() => {
    if (!cars) return [];
    if (activeFilter === 'All') return cars;
    return cars.filter(car => car.category === activeFilter);
  }, [cars, activeFilter]);

  if (isLoading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Spinner animation="border" variant="primary" />
    </div>
  );

  return (
    <>
      <section className="d_gallery_page_section d_section_padding" style={{ background: 'var(--x-bg)', color: 'var(--x-text)' }}>
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
            }}>Visual Excellence</span>
            <h1 className="d_fleet_title d_responsive_title" style={{ fontFamily: 'Bebas Neue', letterSpacing: '2px' }}>Our <span style={{ color: 'var(--x-primary)' }}>Premium Gallery</span></h1>
            <div style={{ width: '80px', height: '3px', background: 'var(--x-primary)', margin: '20px auto' }}></div>
            <p className="d_responsive_subtitle" style={{ color: 'var(--x-text-muted)', maxWidth: '700px', margin: '15px auto 0', lineHeight: '1.8' }}>
              Explore our exclusive collection of luxury and exotic vehicles. Every car in our fleet is maintained to perfection and ready for your next journey.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="d_gallery_filters mb-5">
            <div className="d-flex justify-content-center flex-wrap gap-3">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`d_gallery_filter_btn ${activeFilter === cat ? 'active' : ''}`}
                  onClick={() => setActiveFilter(cat)}
                  style={{
                    background: activeFilter === cat ? 'var(--x-primary)' : 'var(--x-surface)',
                    border: '1px solid ' + (activeFilter === cat ? 'var(--x-primary)' : 'var(--x-border)'),
                    color: activeFilter === cat ? '#fff' : 'var(--x-text)',
                    padding: '10px 25px',
                    borderRadius: '30px',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Grid */}
          <Row className="g-4">
            {filteredCars.map((car) => (
              <Col key={car._id} lg={4} md={6}>
                <div className="d_gallery_card">
                  <div className="d_gallery_img_wrapper">
                    <img src={car.image} alt={car.name} className="d_gallery_img" />
                    <div className="d_gallery_overlay">
                      <div className="d_gallery_info">
                        <span className="d_gallery_cat">{car.category}</span>
                        <h3 className="d_gallery_title">{car.name}</h3>
                        {/* <div className="d_gallery_actions">
                          <button className="d_gallery_zoom" onClick={() => window.open(car.image, '_blank')}>
                            <RiZoomInLine />
                          </button>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
            
            {filteredCars.length === 0 && (
              <Col xs={12} className="text-center py-5">
                <RiImageLine size={64} style={{ color: 'var(--x-border)', marginBottom: '20px' }} />
                <h3>No images found</h3>
                <p className="text-muted">We couldn't find any vehicles in this category.</p>
              </Col>
            )}
          </Row>
        </Container>
      </section>

      <CTA />
      <Footer />

      <style>
        {`
          .d_gallery_img_wrapper {
            position: relative;
            border-radius: 16px;
            overflow: hidden;
            aspect-ratio: 4/3;
            border: 1px solid var(--x-border);
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          }
          .d_gallery_img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
          }
          .d_gallery_card:hover .d_gallery_img {
            transform: scale(1.1);
          }
          .d_gallery_overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%);
            display: flex;
            align-items: flex-end;
            padding: 25px;
            opacity: 0;
            transition: opacity 0.4s ease;
          }
          .d_gallery_card:hover .d_gallery_overlay {
            opacity: 1;
          }
          .d_gallery_info {
            transform: translateY(20px);
            transition: transform 0.4s ease;
            width: 100%;
          }
          .d_gallery_card:hover .d_gallery_info {
            transform: translateY(0);
          }
          .d_gallery_cat {
            color: var(--x-primary);
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            display: block;
            margin-bottom: 5px;
          }
          .d_gallery_title {
            font-family: 'Bebas Neue', sans-serif;
            color: #fff;
            font-size: 1.8rem;
            letter-spacing: 1px;
            margin: 0;
          }
          .d_gallery_zoom {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background: var(--x-primary);
            border: none;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            cursor: pointer;
            box-shadow: 0 5px 15px rgba(221, 111, 39, 0.4);
            transform: scale(0.8);
            opacity: 0;
            transition: all 0.3s ease;
          }
          .d_gallery_card:hover .d_gallery_zoom {
            transform: scale(1);
            opacity: 1;
          }
        `}
      </style>
    </>
  );
};

export default GalleryPage;
