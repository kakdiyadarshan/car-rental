import React, { useRef, useState, useEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { RiDoubleQuotesL, RiStarFill, RiCheckboxCircleFill, RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri';
import { useGetFeedbackQuery } from '../slices/feedbackApiSlice';
import '../style/d_style.css';

const ReviewCard = ({ review }) => (
  <div className="d_review_card">
    <div className="d_review_quote">
      <RiDoubleQuotesL />
    </div>

    <div className="d_review_stars">
      {[...Array(5)].map((_, i) => (
        <RiStarFill key={i} className={i < review.rating ? "active" : ""} />
      ))}
    </div>

    <p className="d_review_text">{review.text}</p>

    <div className="d_review_footer">
      <div className="d_reviewer_img">
        {review.image ? (
          <img src={review.image} alt={review.name} />
        ) : (
          <div className="d_reviewer_placeholder">
            {review.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="d_reviewer_info">
        <h4 className="d_reviewer_name">
          {review.name} <RiCheckboxCircleFill title="Verified Customer" />
        </h4>
        <span className="d_reviewer_role">{review.role}</span>
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
    if (!track) return 400;
    const card = track.querySelector('.d_review_card');
    if (!card) return 400;
    const style = window.getComputedStyle(track);
    const gap = parseInt(style.getPropertyValue('gap')) || 24;
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
    // Re-check on window resize
    window.addEventListener('resize', checkBounds);
    return () => {
      el.removeEventListener('scroll', checkBounds);
      window.removeEventListener('resize', checkBounds);
    };
  }, [reviews]); // Re-check bounds when reviews data changes

  return (
    <section className="d_reviews_section d_section_padding">
      <Container>
        <div className="d_reviews_header_row d_mb_responsive">
          <div className="d_reviews_heading">
            <span className="d_reviews_eyebrow">Client Feedback</span>
            <h2 className="d_reviews_title d_responsive_title">What They <span>Say</span></h2>
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

        {isLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Loading reviews...</p>
          </div>
        ) : error ? (
          <div className="text-center py-5 text-danger">
            <p>Error loading reviews.</p>
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div className="d_slider_outer">
            <div className="d_slider_track" ref={trackRef}>
              {reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>

            <div className="d_fade_left" style={{ opacity: canPrev ? 1 : 0 }} />
            <div className="d_fade_right" style={{ opacity: canNext ? 1 : 0 }} />
          </div>
        ) : (
          <div className="text-center py-5 text-muted">
            <p>No reviews yet. Be the first to share your experience!</p>
          </div>
        )}
      </Container>
    </section>
  );
};

export default Reviews;
