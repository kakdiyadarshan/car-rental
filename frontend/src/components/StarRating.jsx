import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useGetMyRatingsQuery } from '../slices/ratingsApiSlice';

const StarRating = ({ bookingId, carId, onRatingSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch user's ratings to check if they've already rated this car
  const { data: myRatings } = useGetMyRatingsQuery();

  // Find the rating for this specific booking
  useEffect(() => {
    if (myRatings && myRatings.ratings && bookingId) {
      console.log('Looking for bookingId:', bookingId);
      console.log('Available ratings:', myRatings.ratings);
      
      // Find rating for this specific booking
      const bookingRating = myRatings.ratings.find(r => {
        console.log('Comparing:', r.bookingId, 'with', bookingId);
        // Handle both string bookingId and populated object bookingId
        const ratingBookingId = r.bookingId?._id || r.bookingId;
        return ratingBookingId === bookingId || ratingBookingId?.toString() === bookingId;
      });
      
      console.log('Found booking rating:', bookingRating);
      
      if (bookingRating) {
        setRating(bookingRating.rating);
      }
    }
  }, [myRatings, bookingId]);

  // Check if this booking has been rated
  const hasRated = myRatings && myRatings.ratings && bookingId && 
    myRatings.ratings.some(r => {
      const ratingBookingId = r.bookingId?._id || r.bookingId;
      return ratingBookingId === bookingId || ratingBookingId?.toString() === bookingId;
    });

  const handleRating = async (selectedRating) => {
    if (selectedRating === rating) return; // Don't submit if same rating
    
    setIsSubmitting(true);
    try {
      // Handle both string and Object carId
      const carIdString = typeof carId === 'object' ? carId._id : carId;
      await onRatingSubmit({ bookingId, carId: carIdString, rating: selectedRating });
      setRating(selectedRating);
      toast.success('Rating submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="d_star_rating-container">
      {hasRated ? (
        <div className="d_star_rating" style={{gap: "0px"}}>
          {[...Array(5)].map((star, index) => {
            const ratingValue = index + 1;
            return (
              <button
                key={index}
                type="button"
                className={`star-button ${ratingValue <= rating ? 'star-filled' : 'star-empty'}`}
                disabled={true}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'default',
                  fontSize: '20px',
                  color: ratingValue <= rating ? '#ffc107' : '#e4e5e9',
                  transition: 'color 0.2s',
                  marginRight: '5px'
                }}
              >
                {ratingValue <= rating ? <FaStar /> : <FaRegStar />}
              </button>
            );
          })}
          <span style={{ marginLeft: '10px', fontSize: '14px', color: '#666' }}>Rated</span>
        </div>
      ) : (
        <div className="d_star_rating" style={{gap: "0px"}}>
          {[...Array(5)].map((star, index) => {
            const ratingValue = index + 1;
            return (
              <button
                key={index}
                type="button"
                className={`star-button ${ratingValue <= (hover || rating) ? 'star-filled' : 'star-empty'}`}
                onClick={() => handleRating(ratingValue)}
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(0)}
                disabled={isSubmitting}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  fontSize: '20px',
                  color: ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9',
                  transition: 'color 0.2s',
                  marginRight: '5px'
                }}
              >
                {ratingValue <= (hover || rating) ? <FaStar /> : <FaRegStar />}
              </button>
            );
          })}
          {isSubmitting && <span style={{ marginLeft: '10px', fontSize: '14px' }}>Submitting...</span>}
        </div>
      )}
    </div>
  );
};

export default StarRating;
