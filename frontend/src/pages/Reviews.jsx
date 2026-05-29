import React, { useRef, useState, useEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { RiDoubleQuotesL, RiStarFill, RiCheckboxCircleFill, RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri';
import { useGetFeedbackQuery } from '../slices/feedbackApiSlice';

const ReviewCard = ({ review }) => (
  <div className="group relative min-w-[340px] md:min-w-[450px] bg-x-surface border border-x-border rounded-[40px] p-8 md:p-12 transition-all duration-500 hover:border-x-primary/40 hover:-translate-y-2 shadow-premium flex flex-col justify-between overflow-hidden">
    {/* Quote Icon */}
    <div className="absolute top-8 right-8 text-white/[0.03] group-hover:text-x-primary/10 transition-colors duration-700">
      <RiDoubleQuotesL size={120} />
    </div>

    <div className="relative z-10 space-y-8">
        <div className="flex items-center gap-1.5">
        {[...Array(5)].map((_, i) => (
            <RiStarFill key={i} className={`text-xl transition-all duration-500 ${i < review.rating ? "text-[#F5A200] drop-shadow-[0_0_8px_rgba(245,162,0,0.3)]" : "text-white/10"}`} />
        ))}
        </div>

        <p className="text-x-text-muted text-lg md:text-xl leading-relaxed italic font-dm">
            "{review.text}"
        </p>

        <div className="flex items-center gap-5 pt-4 border-t border-white/[0.05]">
            <div className="relative">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 shadow-lg group-hover:border-x-primary/30 transition-colors">
                    {review.image ? (
                        <img src={review.image} alt={review.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    ) : (
                        <div className="w-full h-full bg-x-primary/10 flex items-center justify-center text-x-primary text-2xl font-bebas">
                            {review.name.charAt(0)}
                        </div>
                    )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-x-primary text-white rounded-full flex items-center justify-center border-2 border-x-surface text-xs shadow-lg">
                    <RiCheckboxCircleFill />
                </div>
            </div>
            <div>
                <h4 className="font-bebas text-2xl text-white tracking-widest uppercase mb-1 leading-none group-hover:text-x-primary transition-colors">
                    {review.name}
                </h4>
                <span className="text-[0.7rem] font-bold uppercase tracking-widest text-[#F5A200]">{review.role || "Verified Customer"}</span>
            </div>
        </div>
    </div>
  </div>
);

const Reviews = () => {
  const { data: reviews, isLoading, error } = useGetFeedbackQuery();
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const getCardWidth = () => {
    const track = trackRef.current;
    if (!track) return 450;
    const card = track.querySelector('div'); 
    if (!card) return 450;
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
    window.addEventListener('resize', checkBounds);
    return () => {
      el.removeEventListener('scroll', checkBounds);
      window.removeEventListener('resize', checkBounds);
    };
  }, [reviews]);

  return (
    <section className="py-24 bg-x-bg overflow-hidden relative">
        {/* Dynamic Background */}
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-x-primary/5 rounded-full blur-[140px] translate-x-1/3 translate-y-1/3" />
      
      <Container>
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8 animate-fadeIn">
          <div className="space-y-4 text-center md:text-left">
            <span className="block uppercase text-[0.7rem] tracking-[5px] text-x-primary font-bold">Client Feedback</span>
            <h2 className="font-bebas text-5xl md:text-6xl text-white tracking-widest uppercase mb-0">
                What They <span className="text-transparent !stroke-white [-webkit-text-stroke:1px_#fff]">Say</span>
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

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center animate-fadeIn">
            <div className="w-12 h-12 border-4 border-x-primary border-t-transparent rounded-full animate-spin mb-6" />
            <p className="text-x-text-muted font-dm tracking-widest uppercase text-xs">Loading client reviews...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-bold uppercase tracking-widest">Error loading reviews.</div>
        ) : reviews && reviews.length > 0 ? (
          <div className="relative group">
            <div 
                className="flex gap-8 overflow-x-auto no-scrollbar pb-12 px-4 -mx-4 scroll-smooth" 
                ref={trackRef}
                style={{ scrollSnapType: 'x mandatory' }}
            >
              {reviews.map((review) => (
                <div key={review._id} style={{ scrollSnapAlign: 'start' }}>
                   <ReviewCard review={review} />
                </div>
              ))}
            </div>

            {/* Edge Fades */}
            <div className={`absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-x-bg to-transparent z-10 pointer-events-none transition-opacity duration-500 ${canPrev ? 'opacity-100' : 'opacity-0'}`} />
            <div className={`absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-x-bg to-transparent z-10 pointer-events-none transition-opacity duration-500 ${canNext ? 'opacity-100' : 'opacity-0'}`} />
          </div>
        ) : (
          <div className="text-center py-32 bg-x-surface border border-dashed border-x-border rounded-[40px] animate-fadeIn">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-white/30 mx-auto mb-6 text-3xl">
                <RiDoubleQuotesL />
            </div>
            <h3 className="font-bebas text-2xl text-white tracking-widest mb-2">No reviews yet</h3>
            <p className="text-x-text-muted max-w-sm mx-auto">Be the first to share your experience and help others choose the perfect car!</p>
          </div>
        )}
      </Container>
    </section>
  );
};

export default Reviews;

