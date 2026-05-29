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
    <div className="group relative min-w-[280px] md:min-w-[320px] bg-x-surface border border-x-border rounded-3xl p-8 transition-all duration-500 hover:border-x-primary/40 hover:shadow-premium hover:-translate-y-2">
      {/* Top accent bar */}
      <span className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 rounded-b-full transition-all duration-500 group-hover:w-32 group-hover:h-1.5" style={{ background: brand.accent }} />

      {/* Logo circle */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center transition-all duration-700 group-hover:rotate-[360deg] group-hover:bg-white/[0.05]" style={{ borderColor: brand.accent + '33' }}>
          <span className="font-bebas text-2xl tracking-[2px] text-white opacity-40 group-hover:opacity-100 transition-opacity">{brand.subtitle}</span>
        </div>
      </div>

      {/* Info */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <span className="px-3 py-1 bg-white/[0.03] border border-white/[0.05] rounded-lg text-[0.65rem] font-bold uppercase tracking-widest transition-colors group-hover:text-white" style={{ color: brand.accent, borderColor: brand.accent + '33' }}>
            {brand.tag}
          </span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.03] rounded-lg">
            <RiStarFill size={11} className="text-[#F5A200]" />
            <span className="text-[0.7rem] font-bold text-white/60">{(brand.rating || 5.0).toFixed(1)}</span>
          </div>
        </div>
        <h3 className="font-bebas text-3xl text-white tracking-widest uppercase">{brand.name}</h3>
        <p className="text-x-text-muted text-sm font-dm leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">{brand.tagline}</p>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-white/[0.05] flex items-center justify-between">
        <span className="text-[0.65rem] font-bold uppercase tracking-widest text-x-text-muted">{carCount} Cars Available</span>
        <button 
          className="flex items-center gap-2 text-white font-bold uppercase tracking-widest text-[0.65rem] py-2 px-4 rounded-lg bg-white/[0.05] border border-white/[0.1] hover:bg-x-primary hover:border-x-primary transition-all active:scale-95" 
          onClick={handleExplore}
          style={{ '--accent-color': brand.accent }}
        >
          Explore <RiArrowRightLine size={14} className="group-hover:translate-x-1 transition-transform" />
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
    if (!track) return 320;
    const card = track.querySelector('div'); // Get first child div
    if (!card) return 320;
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
    <section className="py-24 bg-x-bg overflow-hidden relative">
      {/* Decorative element */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-x-primary/5 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2" />
      
      <Container className="relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-8 animate-fadeIn">
          <div className="space-y-4 text-center md:text-left">
            <span className="block uppercase text-[0.7rem] tracking-[4px] text-x-primary font-bold">Top Manufactures</span>
            <h2 className="font-bebas text-5xl md:text-6xl text-white tracking-widest uppercase mb-0 leading-none">
              Explore <span className="text-transparent !stroke-white [-webkit-text-stroke:1px_#fff]">Brands</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-300 ${
                !canPrev 
                  ? 'border-white/5 text-white/10 cursor-not-allowed' 
                  : 'border-white/10 text-white hover:bg-x-primary hover:border-x-primary hover:shadow-lg'
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
                  : 'border-white/10 text-white hover:bg-x-primary hover:border-x-primary hover:shadow-lg'
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