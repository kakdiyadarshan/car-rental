import React, { useState, useMemo, useEffect } from 'react';
import { Spinner, Modal } from 'react-bootstrap';
import { RiImageLine, RiArrowRightUpLine, RiCloseLine } from 'react-icons/ri';
import Header from '../components/Header';
import Footer from './Footer';
import CTA from './CTA';
import { useGetCarsQuery } from '../slices/carsApiSlice';
import bg from '../Assets/bm.jpg';

const GalleryPage = () => {
  const { data: cars, isLoading, error } = useGetCarsQuery();
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  const categories = useMemo(() => {
    if (!cars || cars.length === 0) return ['All'];
    const cats = new Set(cars.map(car => car.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [cars]);

  const filteredCars = useMemo(() => {
    if (!cars || cars.length === 0) return [];
    if (activeFilter === 'All') return cars;
    return cars.filter(car => car.category === activeFilter);
  }, [cars, activeFilter]);

  // Generate dynamic aspect ratios for a true staggered masonry look
  const getAspectRatio = (index) => {
    const patterns = ['aspect-[3/4]', 'aspect-[4/3]', 'aspect-square', 'aspect-[4/5]', 'aspect-[16/9]'];
    return patterns[index % patterns.length];
  };

  return (
    <div className="min-h-screen bg-x-bg text-x-text font-dm selection:bg-x-primary selection:text-white">
      <Header />

      {/* Avant-Garde Hero Section */}
      <div 
        className="relative w-full pt-40 pb-24 overflow-hidden bg-cover bg-center"
        style={{ 
            backgroundImage: `linear-gradient(to right, rgba(10, 11, 15, 0.98) 0%, rgba(10, 11, 15, 0.85) 50%, rgba(10, 11, 15, 0.2) 100%), url(${bg})` 
        }}
      >
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-bl from-x-surface/80 via-transparent to-transparent opacity-50 z-0"></div>
        <div className="absolute top-1/2 left-1/4 w-[800px] h-[800px] bg-x-primary-glow rounded-full blur-[200px] opacity-10 pointer-events-none -translate-y-1/2 z-0"></div>

        <div className="container mx-auto px-6 lg:px-16 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between gap-10 border-b border-x-border pb-12">
            <div className="max-w-3xl">
              <span className="inline-block px-4 py-1.5 rounded-full border border-x-primary text-x-primary text-xs font-bold uppercase tracking-[4px] mb-8 animate-fadeIn">
                The Collection
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-[7rem] font-bebas leading-[0.85] tracking-wide uppercase text-white animate-slideUp">
                Automotive <br />
                <span className="text-transparent !stroke-white [-webkit-text-stroke:2px_#333] hover:[-webkit-text-stroke:2px_#dd6f27] transition-colors duration-500 cursor-default">
                  Excellence
                </span>
              </h1>
            </div>
            <div className="max-w-sm pb-2 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <p className="text-x-text-muted text-base leading-relaxed border-l-2 border-x-primary pl-6">
                Discover our curated gallery of the world's most prestigious vehicles. Designed for those who demand nothing but the absolute best.
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="py-12 relative z-10 min-h-[500px]">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 animate-fadeIn">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-x-border rounded-full"></div>
                <div className="absolute inset-0 border-4 border-x-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="mt-8 text-x-text-muted font-bold tracking-[4px] uppercase text-xs">Curating Gallery...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-red-950/20 border border-red-900/50 rounded-3xl backdrop-blur-sm">
              <p className="text-red-500 font-bold uppercase tracking-widest">Unable to load the collection. Please try again.</p>
            </div>
          ) : (
            <>
              {/* Ultra-Modern Filter Tabs */}
              <div className="mb-16 overflow-x-auto no-scrollbar py-4">
                <div className="flex items-center justify-start md:justify-center gap-8 md:gap-12 min-w-max px-4">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      className="relative group pb-2 "
                      onClick={() => setActiveFilter(cat)}
                    >
                      <span className={`text-sm md:text-base font-bold uppercase tracking-[2px] transition-colors duration-300 ${
                        activeFilter === cat ? 'text-white' : 'text-x-text-muted group-hover:text-x-primary'
                      }`}>
                        {cat}
                        
                      </span>
                      {/* Animated underline */}
                      <span className={`absolute bottom-0 left-0 h-0.5 bg-x-primary transition-all duration-500 ease-out ${
                        activeFilter === cat ? 'w-full' : 'w-0 group-hover:w-1/2'
                      }`}></span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Masonry Layout Grid */}
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 pb-20">
                {filteredCars.map((car, index) => (
                  <div 
                    key={car._id} 
                    className={`break-inside-avoid group relative rounded-3xl overflow-hidden bg-x-surface cursor-pointer transform transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)] ${getAspectRatio(index)}`} 
                    onClick={() => setSelectedImage(car)}
                  >
                    {/* Image */}
                    <img 
                      src={car.image} 
                      alt={car.name} 
                      className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110" 
                    />
                    
                    {/* Glassmorphism Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    {/* Content Box (Glass effect) */}
                    <div className="absolute bottom-4 left-4 right-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out delay-100">
                      <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl relative overflow-hidden">
                        
                        <div className="flex justify-between items-end relative z-10">
                          <div>
                            <span className="block text-x-primary text-[0.65rem] font-bold uppercase tracking-[3px] mb-2">{car.category}</span>
                            <h3 className="font-bebas text-2xl md:text-3xl text-white tracking-widest uppercase leading-none">{car.name}</h3>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center transform -rotate-45 group-hover:rotate-0 transition-transform duration-500 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            <RiArrowRightUpLine size={20} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredCars.length === 0 && (
                <div className="flex flex-col items-center justify-center py-32 text-center animate-fadeIn">
                  <div className="w-32 h-32 bg-x-surface border border-x-border rounded-full flex items-center justify-center text-x-text-muted mb-8 shadow-2xl">
                    <RiImageLine size={64} className="opacity-50" />
                  </div>
                  <h3 className="font-bebas text-4xl text-white tracking-widest mb-4">Gallery Empty</h3>
                  <p className="text-x-text-muted text-lg max-w-md">The curator is currently updating this section. Please explore other categories.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Ultra-Premium Cinematic Dialog Modal */}
      <Modal 
        show={!!selectedImage} 
        onHide={() => setSelectedImage(null)}
        centered
        size="xl"
        contentClassName="bg-transparent border-0 mx-2 sm:mx-0"
      >
        <div className="relative w-full rounded-2xl sm:rounded-3xl lg:rounded-[2rem] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.8)] sm:shadow-[0_40px_80px_rgba(0,0,0,0.9)] bg-black ">
          
          {/* Floating Glassmorphism Close Button */}
          <button 
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white/70 hover:text-white hover:bg-x-primary transition-all duration-300 z-50 border border-white/20 hover:border-transparent hover:scale-110 shadow-lg"
            onClick={() => setSelectedImage(null)}
          >
            <RiCloseLine className="text-xl sm:text-2xl" />
          </button>

          {/* Modal Main Content Area */}
          <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[65vh] lg:h-[70vh] flex items-center justify-center bg-[#050505]">
            
            {/* Ambient Background Glow behind the image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full sm:w-3/4 h-3/4 bg-x-primary-glow rounded-full blur-[100px] sm:blur-[150px] pointer-events-none opacity-50 z-0"></div>
            
            {/* The Hero Image */}
            <img 
              src={selectedImage?.image} 
              alt={selectedImage?.name} 
              className="w-full h-full object-contain relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] sm:drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] p-4 sm:p-8 md:p-12 pb-24 sm:pb-32"
            />

            {/* Gradient Overlay & Details Footer */}
            <div className="absolute bottom-0 left-0 w-full pt-24 sm:pt-32 pb-6 sm:pb-8 md:pb-12 px-6 sm:px-8 md:px-12 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col md:flex-row items-end justify-between z-20">
              <div className="text-left animate-slideUp">
                <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-x-primary/20 text-x-primary border border-x-primary/30 text-[0.65rem] sm:text-xs font-bold uppercase tracking-[3px] sm:tracking-[4px] mb-2 sm:mb-4 backdrop-blur-sm">
                  {selectedImage?.category}
                </span>
                <h3 className="font-bebas text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white tracking-widest uppercase m-0 leading-none drop-shadow-xl sm:drop-shadow-2xl">
                  {selectedImage?.name}
                </h3>
              </div>
            </div>
            
          </div>
        </div>
      </Modal>

      {/* <CTA /> */}
      {/* <Footer /> */}
    </div>
  );
};

export default GalleryPage;
