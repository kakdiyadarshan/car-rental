import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RiStarFill, RiFeedbackLine, RiSendPlaneFill, RiChatQuoteLine, RiUserSmileLine, RiEdit2Line } from 'react-icons/ri';
import { useCreateFeedbackMutation, useGetMyFeedbackQuery, useUpdateFeedbackMutation } from '../slices/feedbackApiSlice';
import '../style/d_style.css';
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
     <>
    <section className="d_feedback_page d_section_padding">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="d_feedback_card_wrapper">
              <div className="d_feedback_header">
                <div className="d_feedback_icon_box">
                  {isEditing ? <RiEdit2Line /> : <RiFeedbackLine />}
                </div>
                <h2 className="d_feedback_title">
                  {isEditing ? <>Update Your <span>Feedback</span></> : <>Share Your <span>Experience</span></>}
                </h2>
                <p className="d_feedback_subtitle">
                  {isEditing 
                    ? "Modify your previous experience to help us improve our services further."
                    : "Your feedback helps us improve our services and provide a better experience for everyone."
                  }
                </p>
              </div>

              <div className="d_feedback_form_container">
                <Form onSubmit={handleSubmit}>
                  <div className="d_rating_group mb-5">
                    <label className="d_field_label">How would you rate your overall experience?</label>
                    <div className="d_star_rating">
                      {[...Array(5)].map((_, index) => {
                        const starValue = index + 1;
                        return (
                          <button
                            type="button"
                            key={starValue}
                            className={`d_star_btn ${starValue <= (hover || rating) ? 'active' : ''}`}
                            onClick={() => setRating(starValue)}
                            onMouseEnter={() => setHover(starValue)}
                            onMouseLeave={() => setHover(0)}
                          >
                            <RiStarFill size={40} />
                          </button>
                        );
                      })}
                    </div>
                    <span className="d_rating_text">
                      {rating === 5 ? 'Excellent' : rating === 4 ? 'Very Good' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
                    </span>
                  </div>

                  <div className="d_feedback_fields">
                    <Form.Group className="mb-4">
                      <Form.Label className="d_field_label">Your Professional Role (Optional)</Form.Label>
                      <div className="d_input_with_icon_wrapper">
                        <RiUserSmileLine className="d_input_icon_inner" />
                        <Form.Control
                          type="text"
                          placeholder="e.g. Business Traveler, Car Enthusiast"
                          className="d_cd_input d_custom_input"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-5">
                      <Form.Label className="d_field_label">Tell us more about your experience</Form.Label>
                      <div className="d_textarea_wrapper d_custom_textarea_wrapper">
                        <RiChatQuoteLine className="d_textarea_icon" />
                        <Form.Control
                          as="textarea"
                          rows={6}
                          placeholder="What did you like? What can we improve?"
                          className="d_cd_input d_textarea d_custom_input"
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          required
                        />
                      </div>
                    </Form.Group>

                    <button className="d_btn_cta w-100 py-3" type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          {isEditing ? 'Update Feedback' : 'Submit Feedback'} 
                          {isEditing ? <RiEdit2Line className="ms-2" /> : <RiSendPlaneFill className="ms-2" />}
                        </>
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
   </>
  );
};

export default Feedback;
