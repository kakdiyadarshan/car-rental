import React, { useRef, useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiStarFill,
} from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { useGetBrandsQuery } from '../slices/brandsApiSlice';
import { useGetCarsQuery } from '../slices/carsApiSlice';

/* ── Reusable Card ────────────────────────────── */
const BrandCard = ({ brand, carCount }) => {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate('/Fleet', { state: { activeBrand: brand.name } });
  };

  return (
    <div className="group relative min-w-[300px] md:min-w-[340px] bg-[#111318]/40 backdrop-blur-md border border-white/[0.06] rounded-[32px] p-8 overflow-hidden">
      {/* Brand-specific Neon Backlight Glow */}
      <div 
        className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none" 
        style={{ background: brand.accent }} 
      />

      {/* Top accent bar */}
      <span 
        className="absolute top-0 left-0 w-full h-[3px] scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-500" 
        style={{ background: `linear-gradient(90deg, transparent, ${brand?.accent}, transparent)` }} 
      />

      {/* Logo wrapper */}
      <div 
        className="relative w-24 h-24 rounded-[24px] bg-white/[0.02] border border-white/[0.06] flex items-center justify-center p-5 mb-6 mx-auto transition-all duration-500 group-hover:bg-white/[0.04] group-hover:border-x-primary/20 group-hover:scale-105" 
        style={{ boxShadow: `inset 0 0 20px rgba(255,255,255,0.02)` }}
      >
        <img 
          src={brand?.logo} 
          alt={brand?.name} 
          className="w-14 h-14 object-contain brightness-0 invert opacity-45 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" 
        />
      </div>

      {/* Info */}
      <div className="text-center space-y-2">
        <span className="block text-[0.65rem] tracking-[2px] uppercase text-x-text-muted/60 group-hover:text-x-text-muted transition-colors font-medium">
          {brand?.subtitle || "Exclusive Maker"}
        </span>
        <h3 className="font-bebas text-3xl md:text-4xl text-white tracking-[2px] uppercase leading-none mt-2 mb-1 group-hover:text-x-primary transition-colors">
          {brand?.name}
        </h3>
        <p className="text-x-text-muted text-xs font-dm leading-relaxed italic opacity-75 group-hover:opacity-100 transition-opacity max-w-[240px] mx-auto">
          "{brand.tagline}"
        </p>

        {/* Tag & Rating row */}
        <div className="flex items-center justify-center gap-2.5 pt-3">
          <span 
            className="px-2.5 py-0.5 bg-x-primary/10 border border-x-primary/20 rounded-md text-[0.55rem] font-bold uppercase tracking-wider text-x-primary"
            style={{ color: brand.accent, borderColor: brand.accent + '33', backgroundColor: brand.accent + '11' }}
          >
            {brand.tag}
          </span>
          <span className="flex items-center gap-1 px-2 py-0.5 bg-white/[0.03] border border-white/[0.05] rounded-md text-[0.55rem] font-bold text-white/50">
            <RiStarFill size={10} className="text-x-accent" />
            {(brand.rating || 5.0).toFixed(1)}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-white/[0.04] flex items-center justify-between">
        <div className="flex flex-col text-left">
          <span className="text-[0.6rem] font-bold uppercase tracking-widest text-x-text-muted/50">Fleet Size</span>
          <span className="text-xs font-bold text-white font-dm">{carCount} Supercars</span>
        </div>
        <button 
          className="flex items-center gap-2 text-white font-bold uppercase tracking-widest text-[0.65rem] py-2.5 px-4.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-x-primary hover:border-x-primary hover:text-white transition-all duration-300 active:scale-95 shadow-sm"
          onClick={handleExplore}
        >
          Explore <RiArrowRightLine size={12} className="group-hover:translate-x-1 transition-transform" />
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
    if (!track) return 340;
    const card = track.querySelector('div'); // Get first child div
    if (!card) return 340;
    const style = window.getComputedStyle(track);
    const gap = parseInt(style.getPropertyValue('gap')) || 32;
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
    el.scrollBy({ left: dir * cardW, behavior: 'smooth' });
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkBounds, { passive: true });
    checkBounds();
    return () => el.removeEventListener('scroll', checkBounds);
  }, [brands]);

  const getCarCount = (brandId) => {
    if (!cars) return 0;
    return cars.filter(car => {
      if (!car.brand) return false;
      const carBrandId = typeof car.brand === 'object' ? car.brand._id : car.brand;
      return carBrandId === brandId;
    }).length;
  };

  if (isBrandsLoading || isCarsLoading) return (
    <div className="py-24 text-center bg-x-bg">
      <div className="w-12 h-12 border-4 border-x-primary border-t-transparent rounded-full animate-spin mx-auto" />
    </div>
  );
  
  if (brandsError) return <div className="py-24 text-center text-red-500 font-bold uppercase tracking-widest bg-x-bg">Error loading brands.</div>;

  return (
    <section 
      className="py-32 bg-x-bg overflow-hidden relative"
      style={{ 
        backgroundImage: 'radial-gradient(rgba(221, 111, 39, 0.02) 1.5px, transparent 1.5px)', 
        backgroundSize: '48px 48px' 
      }}
    >
      {/* Luxurious Ambient Glows */}
      <div className="absolute top-1/4 -left-48 w-[40rem] h-[40rem] bg-x-primary/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-[40rem] h-[40rem] bg-x-accent/3 rounded-full blur-[140px] pointer-events-none" />
      
      <Container className="relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8 animate-fadeIn">
          <div className="space-y-3 text-center md:text-left">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-x-primary/10 border border-x-primary/20 text-[0.65rem] tracking-[4px] uppercase font-bold text-x-primary mb-1">
              Top Manufacturers
            </span>
            <h2 className="font-bebas text-5xl md:text-7xl text-white tracking-widest uppercase mb-0 leading-none">
              Explore <span className="text-transparent !stroke-white [-webkit-text-stroke:1.5px_rgba(255,255,255,0.85)]">Brands</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-300 ${
                !canPrev 
                  ? 'border-white/5 text-white/10 cursor-not-allowed' 
                  : 'border-white/10 text-white hover:bg-x-primary hover:border-x-primary hover:shadow-[0_8px_24px_rgba(221,111,39,0.25)] hover:-translate-y-0.5'
              }`}
              onClick={() => scroll(-1)}
              disabled={!canPrev}
            >
              <RiArrowLeftLine size={24} />
            </button>
            <button
              className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-300 ${
                !canNext 
                  ? 'border-white/5 text-white/10 cursor-not-allowed' 
                  : 'border-white/10 text-white hover:bg-x-primary hover:border-x-primary hover:shadow-[0_8px_24px_rgba(221,111,39,0.25)] hover:-translate-y-0.5'
              }`}
              onClick={() => scroll(1)}
              disabled={!canNext}
            >
              <RiArrowRightLine size={24} />
            </button>
          </div>
        </div>

        <div className="relative group">
          <div 
            className="flex gap-8 overflow-x-auto no-scrollbar pb-10 px-4 -mx-4 scroll-smooth" 
            ref={trackRef}
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {brands && brands.map((b) => (
              <div key={b._id} style={{ scrollSnapAlign: 'start' }}>
                <BrandCard 
                  brand={b} 
                  carCount={getCarCount(b._id)} 
                />
              </div>
            ))}
          </div>

          {/* Edge Fades */}
          <div className={`absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-x-bg to-transparent z-10 pointer-events-none transition-opacity duration-500 ${canPrev ? 'opacity-100' : 'opacity-0'}`} />
          <div className={`absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-x-bg to-transparent z-10 pointer-events-none transition-opacity duration-500 ${canNext ? 'opacity-100' : 'opacity-0'}`} />
        </div>
      </Container>
    </section>
  );
};

export default BrandSlider;
