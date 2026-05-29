import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { RiImageLine, RiArrowRightLine, RiZoomInLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import '../style/d_style.css';
import { useGetCarsQuery } from '../slices/carsApiSlice';

const Gallery = () => {
  const { data: cars, isLoading } = useGetCarsQuery();

  // Show only first 6 cars in home gallery
  const galleryItems = cars ? cars.slice(0, 6) : [];

  if (isLoading) return null;

  return (
    <section className="d_gallery_section d_section_padding" style={{ background: 'var(--x-bg)', color: 'var(--x-text)' }}>
      <Container>
        <div className="d_offers_header d_mb_responsive" style={{ textAlign: 'center' }}>
          <span className="d_offers_eyebrow" style={{ 
            display: 'block', 
            color: 'var(--x-primary)', 
            fontSize: '0.8rem', 
            fontWeight: 700, 
            textTransform: 'uppercase', 
            letterSpacing: '4px',
            marginBottom: '10px'
          }}>Visual Excellence</span>
          <h2 className="d_offers_title d_responsive_title" style={{ fontFamily: 'Bebas Neue', letterSpacing: '2px' }}>Car <span style={{ color: 'var(--x-primary)' }}>Gallery</span></h2>
          <div style={{ width: '80px', height: '3px', background: 'var(--x-primary)', margin: '15px auto' }}></div>
        </div>

        <Row className="g-4">
          {galleryItems.map((car) => (
            <Col key={car._id} md={4} sm={6}>
              <div className="d_gallery_home_card">
                <div className="d_gallery_home_img_box">
                  <img src={car.image} alt={car.name} className="d_gallery_home_img" />
                  <div className="d_gallery_home_overlay">
                    <div className="d_gallery_home_info">
                      <span className="d_gallery_home_cat">{car.category}</span>
                      <h3 className="d_gallery_home_name">{car.name}</h3>
                      <Link to="/Gallery" className="d_gallery_home_btn">
                        View More <RiArrowRightLine />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
        
        <div className="text-center mt-5">
          <Link to="/Gallery" className="d_btn_cta" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            Explore Full Gallery <RiArrowRightLine />
          </Link>
        </div>
      </Container>

      <style>
        {`
          .d_gallery_home_card {
            position: relative;
            border-radius: 16px;
            overflow: hidden;
            aspect-ratio: 4/3;
            border: 1px solid var(--x-border);
            transition: all 0.4s ease;
          }
          .d_gallery_home_img_box {
            position: relative;
            width: 100%;
            height: 100%;
          }
          .d_gallery_home_img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
          }
          .d_gallery_home_card:hover .d_gallery_home_img {
            transform: scale(1.1);
          }
          .d_gallery_home_overlay {
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
          .d_gallery_home_card:hover .d_gallery_home_overlay {
            opacity: 1;
          }
          .d_gallery_home_info {
            transform: translateY(20px);
            transition: transform 0.4s ease;
            width: 100%;
          }
          .d_gallery_home_card:hover .d_gallery_home_info {
            transform: translateY(0);
          }
          .d_gallery_home_cat {
            color: var(--x-primary);
            font-size: 0.7rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            display: block;
            margin-bottom: 5px;
          }
          .d_gallery_home_name {
            font-family: 'Bebas Neue', sans-serif;
            color: #fff;
            font-size: 1.6rem;
            letter-spacing: 1px;
            margin-bottom: 10px;
          }
          .d_gallery_home_btn {
            color: var(--x-primary);
            text-decoration: none;
            font-size: 0.8rem;
            font-weight: 700;
            text-transform: uppercase;
            display: flex;
            align-items: center;
            gap: 5px;
          }
        `}
      </style>
    </section>
  );
};

export default Gallery;
