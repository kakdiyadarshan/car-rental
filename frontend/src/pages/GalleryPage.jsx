import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { RiImageLine, RiSearchLine, RiArrowRightLine, RiZoomInLine } from 'react-icons/ri';
import Header from '../components/Header';
import Footer from './Footer';
import CTA from './CTA';
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
    <div className="flex justify-center items-center min-h-[80vh] bg-x-bg">
      <Spinner animation="border" variant="primary" />
    </div>
  );

  return (
    <div className="min-h-screen bg-x-bg text-x-text font-dm">
      <section className="py-32">
        <Container>
          <div className="mb-16 text-center animate-fadeIn">
            <span className="block uppercase text-[0.93rem] tracking-[5px] text-x-primary font-bold mb-4">Visual Excellence</span>
            <h1 className="font-bebas text-5xl md:text-7xl text-white tracking-[2px] uppercase">
              Our <span className="text-x-primary">Premium Gallery</span>
            </h1>
            <div className="w-20 h-1 bg-x-primary mx-auto my-6 rounded-full overflow-hidden">
                <div className="w-full h-full bg-white/20 animate-[ticker_2s_linear_infinite]" />
            </div>
            <p className="text-x-text-muted max-w-2xl mx-auto text-lg leading-relaxed">
              Explore our exclusive collection of luxury and exotic vehicles. Every car in our fleet is maintained to perfection and ready for your next journey.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="mb-12">
            <div className="flex justify-center flex-wrap gap-4">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 border ${
                    activeFilter === cat 
                      ? 'bg-x-primary border-x-primary text-white shadow-[0_10px_20px_rgba(221,111,39,0.3)]' 
                      : 'bg-x-surface border-x-border text-x-text-muted hover:border-x-primary hover:text-x-text'
                  }`}
                  onClick={() => setActiveFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car) => (
              <div key={car._id} className="group relative rounded-2xl overflow-hidden aspect-[4/3] border border-x-border bg-x-surface shadow-2xl animate-slideUp">
                <img 
                  src={car.image} 
                  alt={car.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="block text-x-primary text-[0.7rem] font-bold uppercase tracking-[3px] mb-2">{car.category}</span>
                    <h3 className="font-bebas text-3xl text-white tracking-widest uppercase">{car.name}</h3>
                  </div>
                </div>
                {/* Zoom Icon Effect */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-x-primary rounded-full flex items-center justify-center text-white text-xl shadow-lg translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 cursor-pointer" onClick={() => window.open(car.image, '_blank')}>
                    <RiZoomInLine />
                </div>
              </div>
            ))}
          </div>

          {filteredCars.length === 0 && (
            <div className="text-center py-24 animate-fadeIn">
              <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/20 mx-auto mb-6">
                <RiImageLine size={48} />
              </div>
              <h3 className="font-bebas text-3xl text-white tracking-widest mb-2">No images found</h3>
              <p className="text-x-text-muted">We couldn't find any vehicles in this category.</p>
            </div>
          )}
        </Container>
      </section>

      <CTA />
      <Footer />
    </div>
  );
};

export default GalleryPage;

