import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RiStarFill, RiFeedbackLine, RiSendPlaneFill, RiChatQuoteLine, RiUserSmileLine, RiEdit2Line } from 'react-icons/ri';
import { useCreateFeedbackMutation, useGetMyFeedbackQuery, useUpdateFeedbackMutation } from '../slices/feedbackApiSlice';
import Footer from './Footer';

const Feedback = () => {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState('');
  const [role, setRole] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [feedbackId, setFeedbackId] = useState(null);

  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const { data: myFeedback, isLoading: isFetchingMyFeedback } = useGetMyFeedbackQuery(undefined, {
    skip: !userInfo,
  });

  const [createFeedback, { isLoading: isCreating }] = useCreateFeedbackMutation();
  const [updateFeedback, { isLoading: isUpdating }] = useUpdateFeedbackMutation();

  useEffect(() => {
    if (myFeedback) {
      setRating(myFeedback.rating);
      setText(myFeedback.text);
      setRole(myFeedback.role);
      setFeedbackId(myFeedback._id);
      setIsEditing(true);
    }
  }, [myFeedback]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      toast.info('Please login to provide feedback');
      navigate('/Register');
      return;
    }

    if (!text.trim()) {
      toast.error('Please enter your feedback message');
      return;
    }

    try {
      if (isEditing) {
        await updateFeedback({ id: feedbackId, rating, text, role }).unwrap();
        toast.success('Feedback updated successfully!');
      } else {
        await createFeedback({ rating, text, role }).unwrap();
        toast.success('Thank you for your feedback!');
      }
      navigate('/');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const isLoading = isCreating || isUpdating || isFetchingMyFeedback;

  return (
    <div className="min-h-screen bg-x-bg text-x-text font-dm">
      <section className="py-32">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <div className="bg-x-surface border border-x-border rounded-[40px] p-8 md:p-16 shadow-premium relative overflow-hidden animate-slideUp">
                {/* Decorative backgrounds */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-x-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-x-primary/5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 space-y-12">
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-x-primary/10 rounded-2xl flex items-center justify-center text-x-primary text-4xl mx-auto shadow-lg transition-transform hover:scale-110">
                      {isEditing ? <RiEdit2Line /> : <RiFeedbackLine />}
                    </div>
                    <div className="space-y-4">
                        <h2 className="font-bebas text-4xl md:text-6xl text-white tracking-widest uppercase">
                        {isEditing ? <>Update Your <span className="text-x-primary">Feedback</span></> : <>Share Your <span className="text-x-primary">Experience</span></>}
                        </h2>
                        <p className="text-x-text-muted text-lg max-w-xl mx-auto leading-relaxed">
                        {isEditing 
                            ? "Modify your previous experience to help us improve our services further."
                            : "Your feedback helps us improve our services and provide a better experience for everyone."
                        }
                        </p>
                    </div>
                  </div>

                  <Form onSubmit={handleSubmit} className="space-y-10">
                    <div className="text-center space-y-6">
                      <label className="block text-xs font-bold uppercase tracking-[3px] text-x-text-muted">How would you rate your overall experience?</label>
                      <div className="flex justify-center gap-3">
                        {[...Array(5)].map((_, index) => {
                          const starValue = index + 1;
                          const isActive = starValue <= (hover || rating);
                          return (
                            <button
                              type="button"
                              key={starValue}
                              className={`transition-all duration-300 transform ${isActive ? 'text-x-primary scale-110' : 'text-white/10 hover:text-x-primary/40'}`}
                              onClick={() => setRating(starValue)}
                              onMouseEnter={() => setHover(starValue)}
                              onMouseLeave={() => setHover(0)}
                            >
                              <RiStarFill size={48} className={isActive ? 'drop-shadow-[0_0_15px_rgba(221,111,39,0.5)]' : ''} />
                            </button>
                          );
                        })}
                      </div>
                      <div className="inline-block px-6 py-2 bg-x-primary/10 rounded-full border border-x-primary/20">
                        <span className="text-x-primary font-bold uppercase tracking-widest text-xs">
                          {rating === 5 ? 'Excellent' : rating === 4 ? 'Very Good' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="block text-[0.65rem] font-bold uppercase tracking-[2px] text-x-text-muted ml-2">Your Professional Role <span className="text-white/20">(Optional)</span></label>
                        <div className="relative group">
                          <RiUserSmileLine className="absolute left-5 top-1/2 -translate-y-1/2 text-x-text-muted text-xl transition-colors group-focus-within:text-x-primary" />
                          <Form.Control
                            type="text"
                            placeholder="e.g. Business Traveler, Car Enthusiast"
                            className="w-full bg-white/[0.03] border border-x-border rounded-2xl p-5 pl-14 text-white focus:bg-white/[0.05] focus:border-x-primary outline-none transition-all placeholder:text-white/10"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-[0.65rem] font-bold uppercase tracking-[2px] text-x-text-muted ml-2">Tell us more about your experience</label>
                        <div className="relative group">
                          <RiChatQuoteLine className="absolute left-5 top-6 text-x-text-muted text-xl transition-colors group-focus-within:text-x-primary" />
                          <Form.Control
                            as="textarea"
                            rows={6}
                            placeholder="What did you like? What can we improve?"
                            className="w-full bg-white/[0.03] border border-x-border rounded-2xl p-5 pl-14 text-white focus:bg-white/[0.05] focus:border-x-primary outline-none transition-all placeholder:text-white/10 min-h-[180px] resize-none"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <button 
                        className="w-full h-18 bg-gradient-to-r from-x-primary to-x-accent text-white font-bold uppercase tracking-widest text-sm rounded-2xl py-5 shadow-xl transition-all hover:shadow-[0_15px_40px_rgba(221,111,39,0.3)] hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed group" 
                        type="submit" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center gap-3">
                            <Spinner animation="border" size="sm" />
                            <span>Processing...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-3">
                            <span>{isEditing ? 'Update Feedback' : 'Submit Feedback'}</span>
                            {isEditing ? <RiEdit2Line className="text-xl group-hover:rotate-12 transition-transform" /> : <RiSendPlaneFill className="text-xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                          </div>
                        )}
                      </button>
                    </div>
                  </Form>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <Footer />
    </div>
  );
};

export default Feedback;

