import React, { useRef, useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiStarFill,
} from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import '../style/d_style.css';
import { useGetBrandsQuery } from '../slices/brandsApiSlice';
import { useGetCarsQuery } from '../slices/carsApiSlice';

/* ── Reusable Card ────────────────────────────── */
const BrandCard = ({ brand, carCount }) => {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate('/Fleet', { state: { activeBrand: brand.name } });
  };

  return (
    <div className="d_brand_card">
      {/* Top accent bar */}
      <span className="d_card_accent_bar" style={{ background: brand.accent }} />

      {/* Logo circle */}
      <div className="d_brand_logo_wrap">
        <div className="d_brand_logo" style={{ borderColor: brand.accent + '55' }}>
          <span className="d_logo_text">{brand.subtitle}</span>
        </div>
      </div>

      {/* Info */}
      <div className="d_brand_info">
        <div className="d_brand_tag_row">
          <span className="d_brand_tag" style={{ color: brand.accent, borderColor: brand.accent + '44' }}>
            {brand.tag}
          </span>
          <span className="d_brand_rating">
            <RiStarFill size={11} style={{ color: '#F5A200' }} />
            {/* Using 5.0 as default if rating not in backend */}
            {(brand.rating || 5.0).toFixed(1)}
          </span>
        </div>
        <h3 className="d_brand_name">{brand.name}</h3>
        <p className="d_brand_tagline">{brand.tagline}</p>
      </div>

      {/* Footer */}
      <div className="d_brand_footer">
        <span className="d_cars_count">{carCount} Cars Available</span>
        <button 
          className="d_brand_cta_btn" 
          style={{ '--accent': brand.accent }}
          onClick={handleExplore}
        >
          Explore <RiArrowRightLine size={14} />
        </button>
      </div>
    </div>
  );
};

/* ── Main Section ─────────────────────────────── */
const BrandSlider = () => {
  const { data: brands, isLoading: isBrandsLoading, error: brandsError } = useGetBrandsQuery();
  const { data: cars, isLoading: isCarsLoading } = useGetCarsQuery();
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const getCardWidth = () => {
    const track = trackRef.current;
    if (!track) return 260;
    const card = track.querySelector('.d_brand_card');
    if (!card) return 260;
    const style = window.getComputedStyle(track);
    const gap = parseInt(style.getPropertyValue('gap')) || 20;
    return card.offsetWidth + gap;
  };

  const checkBounds = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 10);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const cardW = getCardWidth();
    el.scrollBy({ left: dir * cardW * 1.5, behavior: 'smooth' });
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkBounds, { passive: true });
    checkBounds();
    return () => el.removeEventListener('scroll', checkBounds);
  }, [brands]); // Re-run when brands data is loaded

  // Function to get car count for a brand
  const getCarCount = (brandId) => {
    if (!cars) return 0;
    return cars.filter(car => {
      // Add check for car.brand being null
      if (!car.brand) return false;
      const carBrandId = typeof car.brand === 'object' ? car.brand._id : car.brand;
      return carBrandId === brandId;
    }).length;
  };

  if (isBrandsLoading || isCarsLoading) return <div className="d_section_padding text-center">Loading...</div>;
  if (brandsError) return <div className="d_section_padding text-center text-danger">Error loading brands.</div>;

  return (
    <section className="d_brand_section d_section_padding">
      <Container>
        {/* Header row */}
        <div className="d_brand_header_row d_mb_responsive">
          <div className="d_brand_heading">
            <span className="d_section_eyebrow">Top Manufactures</span>
            <h2 className="d_section_title d_responsive_title">Explore <span>Brands</span></h2>
          </div>

          <div className="d_slider_controls">
            <button
              className={`d_ctrl_btn ${!canPrev ? 'disabled' : ''}`}
              onClick={() => scroll(-1)}
              disabled={!canPrev}
              aria-label="Previous"
            >
              <RiArrowLeftLine size={18} />
            </button>
            <button
              className={`d_ctrl_btn ${!canNext ? 'disabled' : ''}`}
              onClick={() => scroll(1)}
              disabled={!canNext}
              aria-label="Next"
            >
              <RiArrowRightLine size={18} />
            </button>
          </div>
        </div>

        {/* Slider track */}
        <div className="d_slider_outer">
          <div className="d_slider_track" ref={trackRef}>
            {brands && brands.map((b) => (
              <BrandCard 
                key={b._id} 
                brand={b} 
                carCount={getCarCount(b._id)} 
              />
            ))}
          </div>

          {/* Edge fades */}
          <div className="d_fade_left"  style={{ opacity: canPrev ? 1 : 0 }} />
          <div className="d_fade_right" style={{ opacity: canNext ? 1 : 0 }} />
        </div>

      </Container>
    </section>
  );
};

export default BrandSlider;