import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetBookingByIdQuery } from '../slices/bookingsApiSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import {
  RiShieldCheckLine,
  RiBankCardLine,
  RiSecurePaymentLine,
  RiCalendarEventLine,
  RiCarLine
} from 'react-icons/ri';
import Footer from './Footer';
import '../style/d_style.css';
import { FaArrowRightLong } from 'react-icons/fa6';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51RlOtoG8rZDtxfXu76pLUjjstWAu2QvUOelhrqp5X7tNF25wbl2HfcSo7HMLcWbXnQlo80WHxs3rglAYRef9WwPL00NrSzdFWG');

const PaymentForm = ({
  bookingId,
  bookingData,
  userInfo,
  navigate,
  identityVerified,
  setIdentityVerified,
  paymentMeta,
  setPaymentMeta,
  clientSecret,
  setClientSecret,
  clientSecretLoading,
  setClientSecretLoading,
  isProcessing,
  setIsProcessing,
}) => {
  const stripeRef = useRef(null);
  const cardElementRef = useRef(null);
  const cardContainerRef = useRef(null);
  const [cardName, setCardName] = useState('');
  const [cardNameError, setCardNameError] = useState('');
  const [cardError, setCardError] = useState('');
  const [isCardComplete, setIsCardComplete] = useState(false);
  const [isStripeReady, setIsStripeReady] = useState(false);
  const [confirmedPaymentIntentId, setConfirmedPaymentIntentId] = useState('');

  const validateCardholderName = (value) => /^[A-Za-z\s]{2,60}$/.test(value.trim());

  const createPaymentIntent = async (showLoader = false) => {
    try {
      if (showLoader) setClientSecretLoading(true);
      const response = await axios.post(
        `/api/bookings/${bookingId}/pay`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );

      setClientSecret(response.data.clientSecret);
      setPaymentMeta({
        paymentAmount: response.data.paymentAmount,
        paymentPercentage: response.data.paymentPercentage,
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Unable to initialize payment. Please refresh.');
    } finally {
      if (showLoader) setClientSecretLoading(false);
    }
  };

  useEffect(() => {
    if (!userInfo?.token) return;
    createPaymentIntent(true);
  }, [bookingId, userInfo?.token]);

  const handleIdentityVerification = async (e) => {
    const isChecked = e.target.checked;
    setIdentityVerified(isChecked);

    try {
      await axios.put(
        `/api/bookings/${bookingId}/verify-identity`,
        { proofOfIdentity: isChecked },
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );

      // Payment percentage changes after identity verification, so regenerate PaymentIntent.
      await createPaymentIntent(true);
    } catch (err) {
      setIdentityVerified(!isChecked);
      toast.error(err?.response?.data?.message || 'Identity verification failed. Please try again.');
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setCardNameError('');
    setCardError('');

    if (!clientSecret) {
      toast.error('Payment form is not ready yet. Please wait a moment.');
      return;
    }

    setIsProcessing(true);

    try {
      let paymentIntentIdToFinalize = confirmedPaymentIntentId;

      // If Stripe payment is already confirmed but booking-finalize failed,
      // retry backend finalize without asking user to enter card again.
      if (!paymentIntentIdToFinalize) {
        if (!stripeRef.current || !cardElementRef.current) {
          toast.error('Payment form is not ready yet. Please wait a moment.');
          setIsProcessing(false);
          return;
        }

        if (!validateCardholderName(cardName)) {
          setCardNameError('Enter a valid cardholder name (letters and spaces only).');
          setIsProcessing(false);
          return;
        }

        if (!isCardComplete) {
          setCardError('Please enter complete card details.');
          setIsProcessing(false);
          return;
        }

        const { paymentIntent, error } = await stripeRef.current.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElementRef.current,
            billing_details: {
              name: cardName.trim(),
              email: userInfo?.email || undefined,
            },
          },
        });

        if (error) {
          setCardError(error.message || 'Card details are invalid.');
          throw new Error(error.message || 'Payment confirmation failed');
        }

        if (!paymentIntent || paymentIntent.status !== 'succeeded') {
          throw new Error('Payment not completed. Please try again.');
        }

        paymentIntentIdToFinalize = paymentIntent.id;
        setConfirmedPaymentIntentId(paymentIntent.id);
      }

      await axios.put(
        `/api/bookings/${bookingId}/paid`,
        { paymentIntentId: paymentIntentIdToFinalize },
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );

      navigate(`/invoice/${bookingId}`, {
        state: {
          bookingData,
          paymentCompleted: true,
          paidPercentage: paymentMeta.paymentPercentage || bookingData.paymentPercentage || 50,
        },
      });

      // Finalize succeeded, clear local retry state.
      setConfirmedPaymentIntentId('');
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const total = paymentMeta.paymentAmount || (bookingData.totalAmount * ((bookingData.paymentPercentage || 50) / 100));
  const currentPaymentPercentage = paymentMeta.paymentPercentage || bookingData.paymentPercentage || 50;
  const cardElementOptions = useMemo(
    () => ({
      hidePostalCode: true,
      style: {
        base: {
          fontSize: '16px',
          color: '#f0ede8',
          iconColor: '#374151',
          lineHeight: '24px',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          '::placeholder': {
            color: '#9ca3af',
          },
        },
        invalid: {
          color: '#ef4444',
          iconColor: '#ef4444',
        },
      },
    }),
    []
  );

  useEffect(() => {
    const mountCard = async () => {
      if (!clientSecret || !cardContainerRef.current) return;
  
      const stripe = await stripePromise;
      if (!stripe) return;
  
      stripeRef.current = stripe;
  
      const elements = stripe.elements();
      const card = elements.create("card", cardElementOptions);
  
      card.mount(cardContainerRef.current);
      cardElementRef.current = card;
  
      setIsStripeReady(true);
  
      card.on("change", (event) => {
        setIsCardComplete(event.complete);
  
        if (event.error) {
          setCardError(event.error.message);
        } else {
          setCardError("");
        }
      });
    };
  
    // clean previous instance first
    if (cardElementRef.current) {
      cardElementRef.current.unmount();
      cardElementRef.current.destroy();
      cardElementRef.current = null;
    }
  
    setIsStripeReady(false);
    mountCard();
  
    return () => {
      if (cardElementRef.current) {
        cardElementRef.current.destroy();
        cardElementRef.current = null;
      }
    };
  }, [clientSecret]);

  return (
    <Row className="row-rev g-4">
      <Col lg={7}>
        <div className="d_cd_info_card" style={{ padding: '40px' }}>
          <h3 style={{ fontFamily: 'Bebas Neue', letterSpacing: '1px', marginBottom: '30px' }}>
            <RiBankCardLine color="var(--x-primary)" /> Payment Method
          </h3>
          <Form onSubmit={handlePayment}>
            <div className="d_cd_input_group">
              <label>Cardholder Name</label>
              <div className="d_fname_input_wrapper">
                <input
                  type="text"
                  className="d_cd_input"
                  placeholder="Full Name"
                  value={cardName}
                  onChange={(e) => {
                    setCardName(e.target.value);
                    if (cardNameError) setCardNameError('');
                  }}
                  onBlur={() => {
                    if (!validateCardholderName(cardName)) {
                      setCardNameError('Enter a valid cardholder name (letters and spaces only).');
                    } else {
                      setCardNameError('');
                    }
                  }}
                  maxLength={60}
                  required
                />
              </div>
              {cardNameError && (
                <small style={{ color: '#ef4444', marginTop: '8px', display: 'block' }}>{cardNameError}</small>
              )}
            </div>

            <div className="d_cd_input_group">
              <label>Card Details</label>
              <div
                className="d_cd_input"
              >
                <div ref={cardContainerRef} style={{ width: '100%', minHeight: '22px' }} />
              </div>
              {cardError && (
                <small style={{ color: '#ef4444', marginTop: '8px', display: 'block' }}>{cardError}</small>
              )}
            </div>

            {/* <div className="d_cd_input_group">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="identityVerification"
                  checked={identityVerified}
                  onChange={handleIdentityVerification}
                  style={{ marginRight: '10px' }}
                />
                <label htmlFor="identityVerification" className="form-check-label">
                  I verify my identity and agree to the terms (required for full payment)
                </label>
              </div>
            </div> */}

            <div
              style={{
                background: 'rgba(5, 150, 105, 0.1)',
                border: '1px solid rgba(5, 150, 105, 0.3)',
                padding: '20px',
                borderRadius: '12px',
                display: 'flex',
                gap: '15px',
                alignItems: 'center',
                marginTop: '20px'
              }}
            >
              <RiSecurePaymentLine size={30} color="#059669" />
              <span
                style={{
                  fontSize: '0.85rem',
                  color: '#059669',
                  fontWeight: 500
                }}
              >
                Your payment is secured with Stripe test mode. Use test cards only (for example: 4242 4242 4242 4242).
              </span>
            </div>

            <button
              type="submit"
              className="d_car_btn_outline d-flex align-items-center justify-content-center"
              style={{ width: '100%', marginTop: '40px' }}
              disabled={isProcessing || clientSecretLoading || !clientSecret || !isStripeReady || !isCardComplete}
            >
              {isProcessing
                ? 'Processing...'
                : clientSecretLoading
                  ? 'Preparing Payment...'
                  : `Pay $${Number(total || 0).toLocaleString()} Now`}
              <FaArrowRightLong className="ms-2" />
            </button>
          </Form>
        </div>
      </Col>

      <Col lg={5}>
        <aside className="d_cd_booking_sidebar">
          <div className="d_cd_info_card" style={{ padding: '30px' }}>
            <h3 style={{ fontFamily: 'Bebas Neue', letterSpacing: '1px', marginBottom: '25px' }}>Booking Summary</h3>

            <div className="d-flex gap-3 mb-4" style={{ paddingBottom: '20px', borderBottom: '1px solid var(--x-border)' }}>
              <img src={bookingData.car.image} alt={bookingData.car.name} style={{ width: '100px', height: '70px', objectFit: 'cover', borderRadius: '8px' }} />
              <div>
                <h5 style={{ margin: 0, fontWeight: 700 }}>{bookingData.car.name}</h5>
                <span style={{ fontSize: '0.8rem', color: 'var(--x-primary)', textTransform: 'uppercase', fontWeight: 700 }}>{bookingData.car.category}</span>
              </div>
            </div>

            <div className="d_cd_extras_list mb-4">
              <div className="d_cd_extra_item">
                <RiCalendarEventLine /> <div><strong>Pickup:</strong> {bookingData.pickupDate} at {bookingData.pickupTime}</div>
              </div>
              <div className="d_cd_extra_item">
                <RiCarLine /> <div><strong>Rental Type:</strong> {bookingData.rentalType === 'hour' ? 'Per Hour' : 'Per Day'}</div>
              </div>
              <div className="d_cd_extra_item">
                <RiCalendarEventLine /> <div><strong>Return:</strong> {bookingData.returnDate} at {bookingData.returnTime}</div>
              </div>
            </div>

            <div style={{ padding: '20px', background: 'var(--x-surface2)', borderRadius: '12px' }}>
              <div className="d-flex justify-content-between mb-2">
                <span style={{ color: 'var(--x-text-muted)' }}>Total Rental Cost</span>
                <span>${Number(bookingData.totalAmount).toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span style={{ color: 'var(--x-text-muted)' }}>Payment Percentage</span>
                <span>{currentPaymentPercentage}%</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span style={{ color: 'var(--x-text-muted)' }}>Current Payment</span>
                <span>${Number(total).toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <strong style={{ fontSize: '1.2rem' }}>Total Amount Due</strong>
                <strong style={{ fontSize: '1.5rem', color: 'var(--x-primary)' }}>${Number(total).toLocaleString()}</strong>
              </div>
              {currentPaymentPercentage < 100 && (
                <div style={{ marginTop: '10px', fontSize: '0.85rem', color: 'var(--x-text-muted)' }}>
                  <em>Remaining ${(bookingData.totalAmount - total).toLocaleString()} will be due after identity verification</em>
                </div>
              )}
            </div>
          </div>

          <div className="d_cd_info_card" style={{ marginTop: '20px', padding: '25px', textAlign: 'center', border: '1px dashed var(--x-primary)' }}>
            <RiShieldCheckLine size={30} color="var(--x-primary)" style={{ marginBottom: '10px' }} />
            <h5 style={{ fontFamily: 'Bebas Neue', margin: 0 }}>Premium Protection Included</h5>
            <p style={{ fontSize: '0.8rem', color: 'var(--x-text-muted)', marginTop: '10px' }}>Full insurance coverage and 24/7 roadside assistance are included in your total price.</p>
          </div>
        </aside>
      </Col>
    </Row>
  );
};

const Payment = () => {
  const { id: bookingId } = useParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [clientSecretLoading, setClientSecretLoading] = useState(true);
  const [paymentMeta, setPaymentMeta] = useState({ paymentAmount: 0, paymentPercentage: 50 });
  
  // Fetch booking data by ID
  const { data: bookingData, isLoading, error } = useGetBookingByIdQuery(bookingId);
  const { userInfo } = useSelector((state) => state.auth);
  const [identityVerified, setIdentityVerified] = useState(false);

  useEffect(() => {
    if (bookingData) {
      setIdentityVerified(Boolean(bookingData.proofOfIdentity));
      setPaymentMeta({
        paymentAmount: (bookingData.totalAmount * (bookingData.paymentPercentage || 50)) / 100,
        paymentPercentage: bookingData.paymentPercentage || 50,
      });
    }
  }, [bookingData]);

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <h2>Loading booking details...</h2>
      </div>
    );
  }

  if (error || !bookingData) {
    return (
      <div className="text-center py-5">
        <h2>Booking not found.</h2>
        <button onClick={() => navigate('/Fleet')} className="d_btn_cta">Go Back to Fleet</button>
      </div>
    );
  }

  return (
    <>
      <section className="d_payment_section" style={{ background: 'var(--x-bg)', color: 'var(--x-text)', padding: '80px 0', minHeight: '100vh' }}>
        <Container>
          <div className="d_fleet_header" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="d_fleet_eyebrow">Secure Checkout</span>
            <h1 className="d_fleet_title">Complete Your <span>Booking</span></h1>
          </div>

          <PaymentForm
            bookingId={bookingId}
            bookingData={bookingData}
            userInfo={userInfo}
            navigate={navigate}
            identityVerified={identityVerified}
            setIdentityVerified={setIdentityVerified}
            paymentMeta={paymentMeta}
            setPaymentMeta={setPaymentMeta}
            clientSecret={clientSecret}
            setClientSecret={setClientSecret}
            clientSecretLoading={clientSecretLoading}
            setClientSecretLoading={setClientSecretLoading}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        </Container>
      </section>
      <Footer />
    </>
  );
};

export default Payment;
