import React, { useRef, useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useGetBookingByIdQuery } from '../slices/bookingsApiSlice';
import {
  RiDownloadLine,
  RiPrinterLine,
  RiMailSendLine,
  RiCheckboxCircleLine,
  RiCarLine,
  RiMapPin2Line,
  RiCalendarEventLine,
  RiInformationLine
} from 'react-icons/ri';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from './Footer';
import '../style/d_style.css';
import { IoMdArrowRoundBack } from "react-icons/io";

const Invoice = () => {
  const location = useLocation();
  const { id: bookingId } = useParams();
  const navigate = useNavigate();
  const invoiceRef = useRef();
  const [isPdfLibraryLoaded, setIsPdfLibraryLoaded] = useState(false);
  const [countdown, setCountdown] = useState(10);

  const handleGoBack = () => {
    // If payment was just completed, prevent going back to payment page
    if (paymentCompleted) {
      navigate('/Fleet');
      return;
    }
    // Check if there's previous history to go back to
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // If no history, go to fleet page
      navigate('/Fleet');
    }
  };

  // Check if html2pdf library is loaded
  useEffect(() => {
    const checkLibrary = setInterval(() => {
      if (typeof window.html2pdf !== 'undefined') {
        setIsPdfLibraryLoaded(true);
        clearInterval(checkLibrary);
      }
    }, 100);

    // Cleanup after 10 seconds
    setTimeout(() => clearInterval(checkLibrary), 10000);

    return () => clearInterval(checkLibrary);
  }, []);

  // Use location state if available, otherwise fetch by ID
  const { bookingData: locationBookingData, paymentCompleted } = location.state || {};
  const { data: fetchedBookingData, isLoading, error } = useGetBookingByIdQuery(bookingId, { skip: !!locationBookingData });

  // Auto-redirect countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  // Prevent browser back navigation when payment is completed
  useEffect(() => {
    if (paymentCompleted) {
      const handlePopState = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        window.history.pushState(null, '', window.location.pathname);
        navigate('/Fleet');
      };

      window.history.pushState(null, '', window.location.pathname);
      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [paymentCompleted, navigate]);

  const bookingData = locationBookingData || fetchedBookingData;

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <h2>Loading invoice...</h2>
      </div>
    );
  }

  if (error || !bookingData) {
    return (
      <div className="text-center py-5">
        <h2>Invoice not found.</h2>
        <button onClick={() => navigate('/Fleet')} className="d_btn_cta">Go Back to Fleet</button>
      </div>
    );
  }

  // Format date to dd-mm-yyyy
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const { car, user } = bookingData;
  const paidAmount = (bookingData.totalAmount * (bookingData.paymentPercentage || 50)) / 100;
  const remainingAmount = bookingData.totalAmount - paidAmount;
  const total = paidAmount; // No service fee in invoice

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = (event) => {
    // Show loading state
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<RiDownloadLine /> Generating...';
    button.disabled = true;

    try {
      // Method 1: Try html2pdf first
      if (typeof window.html2pdf !== 'undefined') {
        const element = invoiceRef.current;
        const opt = {
          margin: 10,
          filename: `AutoX_Invoice_${bookingData._id}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: '#0a0a0a' },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        window.html2pdf().set(opt).from(element).save().then(() => {
          button.innerHTML = originalText;
          button.disabled = false;
        }).catch((error) => {
          console.error('html2pdf failed:', error);
          // Fallback to print method
          fallbackToPrint();
        });
      } else {
        // Fallback if html2pdf not loaded
        fallbackToPrint();
      }
    } catch (error) {
      console.error('PDF generation failed:', error);
      fallbackToPrint();
    }

    function fallbackToPrint() {
      // Use browser print as fallback
      setTimeout(() => {
        window.print();
        button.innerHTML = originalText;
        button.disabled = false;
        toast.info('Print dialog opened. You can save as PDF from the print dialog.');
      }, 500);
    }
  };

  return (
    <>
      <section className="d_invoice_section" style={{ background: 'var(--x-bg)', color: 'var(--x-text)', paddingTop: '40px', paddingBottom: '80px', minHeight: '100vh' }}>
        <Container>
          {/* Success Banner */}
          <div className="success-banner" style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ color: '#059669', fontSize: window.innerWidth <= 320 ? '3rem' : '4rem', marginBottom: '15px' }}>
              <RiCheckboxCircleLine />
            </div>
            <h1 className="d_fleet_title">Booking <span>Confirmed!</span></h1>
            <p className="success-text" style={{ color: 'var(--x-text-muted)', fontSize: '1.1rem' }}>Thank you for choosing AutoX. Your premium ride is waiting for you.</p>
            <div style={{ 
              background: 'rgba(5, 150, 105, 0.1)', 
              border: '1px solid rgba(5, 150, 105, 0.3)', 
              padding: '12px 20px', 
              borderRadius: '8px', 
              marginTop: '15px',
              display: 'inline-block'
            }}>
              <p style={{ margin: 0, color: '#059669', fontWeight: 500, fontSize: '0.9rem' }}>
                Auto-redirecting to home in <strong>{countdown}</strong> seconds...
              </p>
            </div>
          </div>

          {/* Action Bar */}
          {/* <div className="d-flex justify-content-center gap-3 mb-3 d-print-none" style={{ flexDirection: window.innerWidth <= 320 ? 'column' : 'row', gap: window.innerWidth <= 320 ? '10px' : '15px', alignItems: 'center' }}> */}
          <div className="d-flex justify-content-center gap-3 mb-3 d-print-none responsive-btn-group">
            <button onClick={handleGoBack} className="d_car_btn_outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', width: window.innerWidth <= 320 ? '100%' : 'auto', justifyContent: 'center', fontSize: window.innerWidth <= 320 ? '0.875rem' : '1rem', padding: window.innerWidth <= 320 ? '10px' : 'auto' }}>
              <IoMdArrowRoundBack /> Go Back
            </button>
            <button onClick={handlePrint} className="d_car_btn_outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', width: window.innerWidth <= 320 ? '100%' : 'auto', justifyContent: 'center', fontSize: window.innerWidth <= 320 ? '0.875rem' : '1rem', padding: window.innerWidth <= 320 ? '10px' : 'auto' }}>
              <RiPrinterLine /> Print Invoice
            </button>
            <button 
              onClick={handleDownloadPDF} 
              className="d_car_btn_outline" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                width: window.innerWidth <= 320 ? '100%' : 'auto', 
                justifyContent: 'center', 
                fontSize: window.innerWidth <= 320 ? '0.875rem' : '1rem', 
                padding: window.innerWidth <= 320 ? '10px' : 'auto'
              }}
            >
              <RiDownloadLine /> Download Invoice
            </button>
            <button onClick={() => navigate('/')} className="d_car_btn_outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', width: window.innerWidth <= 320 ? '100%' : 'auto', justifyContent: 'center', fontSize: window.innerWidth <= 320 ? '0.875rem' : '1rem', padding: window.innerWidth <= 320 ? '10px' : 'auto' }}>
              <IoMdArrowRoundBack /> Return Home Now
            </button>
          </div>

          {/* Invoice Document */}
          <div ref={invoiceRef} className="d_invoice_card" style={{
            background: '#0a0a0a',
            color: '#fff',
            borderRadius: '16px',
            padding: '20px',
            minHeight: '100%',
            maxWidth: '700px',
            margin: '0 auto',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            border: '1px solid #222'
          }}>
            {/* Header */}
            <div className="invoice-header d-flex justify-content-between align-items-start mb-3 pb-4" style={{ borderBottom: '2px solid #222' }}>
              <div className="header-left">
                <div className="header-logo d-flex align-items-center gap-2" style={{ marginBottom: '10px' }}>
                  <div className="car-icon" style={{ background: 'var(--x-primary)', color: '#fff', padding: '8px', borderRadius: '6px' }}><RiCarLine size={24} /></div>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-1px' }}>AUTO<span style={{ color: 'var(--x-primary)' }}>X</span></span>
                </div>
                <p className="header-text" style={{ color: '#aaa', margin: 0 }}>Premium Car Rental Services</p>
                <p className="header-text" style={{ color: '#aaa', margin: 0 }}>123 Luxury Drive, Beverly Hills, CA 90210</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h2 className="invoice-title" style={{ fontFamily: 'Bebas Neue', fontSize: '3rem', margin: 0, color: 'var(--x-primary)' }}>INVOICE</h2>
                <p className="invoice-meta" style={{ color: '#aaa', margin: '5px 0' }}># {bookingData._id}</p>
                <p className="invoice-meta" style={{ color: '#aaa', margin: 0 }}>Date: {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <Row className="mb-3">
              <Col sm={6} className="billing-to" style={{ marginBottom: window.innerWidth <= 320 ? '20px' : '0' }}>
                <h6 style={{ textTransform: 'uppercase', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '1px', color: 'var(--x-primary)', marginBottom: '15px' }}>Billed To</h6>
                <h5 style={{ fontWeight: 700, marginBottom: '5px', fontSize: '1.25rem' }}>{user?.firstname || 'Premium'} {user?.lastname || 'Customer'}</h5>
                <p style={{ color: '#aaa', margin: 0, fontSize: '0.875rem' }}>{user?.email || 'customer@example.com'}</p>
                <p style={{ color: '#aaa', margin: 0, fontSize: '0.875rem' }}>{bookingData.phoneNumber || '+1 (555) 987-6543'}</p>
              </Col>
              <Col sm={6} className="payment-status" style={{ textAlign: window.innerWidth > 576 ? 'right' : 'left', textAlign: "end", marginTop: window.innerWidth > 576 ? 0 : '0' }}>
                <h6 style={{ textTransform: 'uppercase', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '1px', color: 'var(--x-primary)', marginBottom: '15px' }}>Payment Status</h6>
                <div className="payment-badge" style={{ display: 'inline-block', background: 'rgba(5, 150, 105, 0.2)', color: '#10b981', padding: '8px 20px', borderRadius: '100px', fontWeight: 700, fontSize: '0.85rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  {bookingData.paymentPercentage === 100 ? 'PAID IN FULL' : `${bookingData.paymentPercentage}% PAID`}
                </div>
                {bookingData.paymentPercentage < 100 && (
                  <div className="remaining-amount" style={{ marginTop: '10px', fontSize: '0.75rem', color: '#aaa' }}>
                    Remaining: ${remainingAmount.toLocaleString()}
                  </div>
                )}
              </Col>
            </Row>

            {/* Rental Details Table */}
            <div className="mb-3" style={{ overflowX: 'auto' }}>
              <table className="invoice-table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: '280px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #222' }}>
                    <th style={{ padding: '15px 0', textAlign: 'left', color: '#aaa', textTransform: 'uppercase', fontSize: '0.75rem' }}>Vehicle Description</th>
                    {/* <th style={{ padding: '15px 0', textAlign: 'center', color: '#aaa', textTransform: 'uppercase', fontSize: '0.75rem' }}>Daily Rate</th> */}
                    <th style={{ padding: '15px 0', textAlign: 'right', color: '#aaa', textTransform: 'uppercase', fontSize: '0.75rem' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '10px 0' }}>
                      <div className="car-name" style={{ fontWeight: 700, fontSize: '1.2rem', color: '#fff' }}>{car.name}</div>
                      {/* <div className="car-details" style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '5px' }}>Category: {car.category}</div>
                      <div className="car-details" style={{ fontSize: '0.85rem', color: '#aaa' }}>Transmission: {car.specs?.transmission || 'N/A'} | Fuel: {car.specs?.fuel || 'N/A'}</div> */}
                    </td>
                    {/* <td style={{ padding: '10px 0', textAlign: 'center', color: '#fff' }}>${bookingData.rentalType === 'hour' ? car.pricePerHour?.toLocaleString() : car.pricePerDay?.toLocaleString()}</td> */}
                    <td className="amount-cell" style={{ padding: '10px 0', textAlign: 'right', fontWeight: 700, color: '#fff', fontSize: '1.1rem' }}>${bookingData.totalAmount.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Summary & Itinerary */}
            <Row className="g-4">
              <Col md={7}>
                <div className="itinerary-section" style={{ background: '#111', padding: '25px', borderRadius: '12px', border: '1px solid #222' }}>
                  <h6 className="itinerary-title" style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '20px', color: 'var(--x-primary)' }}>Rental Itinerary</h6>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="itinerary-item" style={{ display: 'flex', gap: '15px' }}>
                      <div className="itinerary-icon" style={{ background: 'rgba(221, 111, 39, 0.1)', padding: '10px', borderRadius: '8px', height: 'fit-content' }}>
                        <RiMapPin2Line color="var(--x-primary)" size={20} />
                      </div>
                      <div>
                        <div className="itinerary-label" style={{ fontSize: '0.75rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>PICKUP</div>
                        <div className="itinerary-time" style={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem' }}>{formatDate(bookingData.pickupDate)} at {bookingData.pickupTime}</div>
                      </div>
                    </div>
                    <div className="itinerary-item" style={{ display: 'flex', gap: '15px' }}>
                      <div className="itinerary-icon" style={{ background: 'rgba(221, 111, 39, 0.1)', padding: '10px', borderRadius: '8px', height: 'fit-content' }}>
                        <RiMapPin2Line color="var(--x-primary)" size={20} />
                      </div>
                      <div>
                        <div className="itinerary-label" style={{ fontSize: '0.75rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>RETURN</div>
                        <div className="itinerary-time" style={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem' }}>{formatDate(bookingData.returnDate)} at {bookingData.returnTime}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col md={5}>
                <div style={{ textAlign: 'right', padding: '10px' }}>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="summary-label" style={{ color: '#aaa', fontSize: '0.875rem' }}>Subtotal</span>
                    <span className="summary-value" style={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>${bookingData.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="summary-label" style={{ color: '#aaa', fontSize: '0.875rem' }}>Paid Amount ({bookingData.paymentPercentage}%)</span>
                    <span className="summary-value" style={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>${paidAmount.toLocaleString()}</span>
                  </div>
                  {bookingData.paymentPercentage < 100 && (
                    <div className="d-flex justify-content-between mb-4 pb-4" style={{ borderBottom: '1px solid #222' }}>
                      <span className="summary-label" style={{ color: '#aaa', fontSize: '0.875rem' }}>Remaining Amount</span>
                      <span className="summary-value" style={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>${remainingAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between align-items-center">
                    <strong className="total-label" style={{ fontSize: '1.2rem', color: '#fff' }}>Total Paid</strong>
                    <strong className="total-amount" style={{ fontSize: '2.5rem', color: 'var(--x-primary)', fontFamily: 'Bebas Neue', letterSpacing: '1px' }}>${total.toLocaleString()}</strong>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </section>
    </>
  );
};

export default Invoice;
