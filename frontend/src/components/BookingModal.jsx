import React, { useState } from "react";
import { Modal, Form, Row, Col, Spinner } from "react-bootstrap";
import { FaArrowRightLong } from "react-icons/fa6";
import {
  RiCheckboxCircleLine,
  RiMapPin2Line,
  RiCalendarEventLine,
  RiTimeLine,
  RiCloseLine,
} from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreateBookingMutation } from "../slices/bookingsApiSlice";
import { useSelector } from "react-redux";

const BookingModal = ({ show, onHide, selectedCar }) => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [createBooking, { isLoading: isBookingLoading }] = useCreateBookingMutation();
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);

  // Get current date string (YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];
  // Get current time string (HH:MM)
  const currentTime = new Date().toTimeString().slice(0, 5);

  const [bookingForm, setBookingFields] = useState({
    pickupDate: today,
    pickupTime: "",
    returnDate: today,
    returnTime: "",
    rentalType: "day",
  });

  const validateBooking = () => {
    const { pickupDate, pickupTime, returnDate, returnTime } = bookingForm;
    const now = new Date();
    const pickupDateTime = new Date(`${pickupDate}T${pickupTime || "00:00"}`);
    const returnDateTime = new Date(`${returnDate}T${returnTime || "00:00"}`);

    // Check if pickup is in the past
    if (pickupDate === today && pickupTime && pickupTime < currentTime) {
      toast.error("Pickup time has already passed! Please select a new time.");
      return false;
    }

    if (pickupDateTime < now && pickupDate === today && pickupTime) {
      toast.error("Pickup time cannot be in the past!");
      return false;
    }

    // Check if return is before pickup
    if (returnDateTime <= pickupDateTime) {
      toast.error("Return time must be after the pickup time!");
      return false;
    }

    return true;
  };

  const calculateTotalAmount = () => {
    if (!selectedCar) return 0;

    const pickup = new Date(`${bookingForm.pickupDate}T${bookingForm.pickupTime}`);
    const returnD = new Date(`${bookingForm.returnDate}T${bookingForm.returnTime}`);

    const diffTime = Math.abs(returnD - pickup);

    if (bookingForm.rentalType === "hour") {
      const hours = Math.ceil(diffTime / (1000 * 60 * 60)) || 1;
      return hours * selectedCar.pricePerHour; // add this field in car
    } else {
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      return days * selectedCar.pricePerDay;
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!userInfo) {
      toast.error("Please log in to make a booking!");
      navigate("/Register");
      return;
    }

    if (!validateBooking()) return;

    try {
      const totalAmount = calculateTotalAmount();
      const res = await createBooking({
        carId: selectedCar._id,
        pickupDate: bookingForm.pickupDate,
        pickupTime: bookingForm.pickupTime,
        returnDate: bookingForm.returnDate,
        returnTime: bookingForm.returnTime,
        totalAmount,
        rentalType: bookingForm.rentalType, // NEW
        phoneNumber: userInfo.phoneNo || "1234567890",
      }).unwrap();
      navigate(`/payment/${res._id}`);
      setIsBookingSuccess(true);
      toast.success("Booking request has been submitted successfully!");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => !isBookingSuccess && onHide()}
      centered
      className="d_booking_modal p-0"
      size="lg"
    >
      <div
        style={{
          background: "var(--x-bg)",
          border: "1px solid var(--x-border)",
          borderRadius: "6px",
          overflow: "hidden",
        }}
      >
        {/* HEADER */}
        <Modal.Header
          style={{
            borderBottom: "1px solid var(--x-border)",
            padding: "25px",
            color: "var(--x-primary)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Modal.Title
            style={{
              fontFamily: "Bebas Neue",
              letterSpacing: "1px",
              color: "var(--x-text)",
            }}
          >
            {isBookingSuccess
              ? "Booking Confirmed!"
              : `Reserve ${selectedCar?.name}`}
          </Modal.Title>

          {!isBookingSuccess && (
            <RiCloseLine
              style={{
                fontSize: "30px",
                cursor: "pointer",
                color: "var(--x-primary)",
              }}
              onClick={onHide}
            />
          )}
        </Modal.Header>

        {/* BODY */}
        <Modal.Body className="d_booking_modal_body" style={{ padding: "40px" }}>
          {isBookingSuccess ? (
            <div className="text-center py-4">
              <div
                style={{
                  color: "#059669",
                  fontSize: "5rem",
                  marginBottom: "20px",
                }}
              >
                <RiCheckboxCircleLine />
              </div>

              <h2
                style={{
                  fontFamily: "Bebas Neue",
                  letterSpacing: "1px",
                  marginBottom: "15px",
                }}
              >
                Success!
              </h2>

              <p style={{ color: "var(--x-text-muted)" }}>
                Your reservation for the{" "}
                <strong>{selectedCar?.name}</strong> has been received. Our
                concierge will contact you shortly.
              </p>
            </div>
          ) : (
            <Form onSubmit={handleBookingSubmit}>
              <Row className="g-4">

                {/* PICKUP DATE TIME */}
                <Col lg={6}>
                  <Row className="g-3">
                    <Col xs={12} md={6} lg={6} className="g-3">
                      <div className="d_cd_input_group">
                        <label>Pickup Date</label>
                        <div className="d_cd_input_wrapper">
                          <RiCalendarEventLine className="d_cd_input_icon" />
                          <input
                            type="date"
                            className="d_cd_input"
                            required
                            min={today}
                            value={bookingForm.pickupDate}
                            onChange={(e) =>
                              setBookingFields({
                                ...bookingForm,
                                pickupDate: e.target.value,
                                // Reset return date if it becomes invalid
                                returnDate: e.target.value > bookingForm.returnDate ? e.target.value : bookingForm.returnDate
                              })
                            }
                          />
                        </div>
                      </div>
                    </Col>

                    <Col xs={12} md={6} lg={6}>
                      <div className="d_cd_input_group">
                        <label>Pickup Time</label>
                        <div className="d_cd_input_wrapper">
                          <RiTimeLine className="d_cd_input_icon" />
                          <input
                            type="time"
                            className="d_cd_input"
                            required
                            value={bookingForm.pickupTime}
                            onChange={(e) =>
                              setBookingFields({
                                ...bookingForm,
                                pickupTime: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>

                {/* RETURN DATE TIME */}
                <Col lg={6}>
                  <Row className="g-3">
                    <Col xs={12} md={6} lg={6}>
                      <div className="d_cd_input_group">
                        <label>Return Date</label>
                        <div className="d_cd_input_wrapper">
                          <RiCalendarEventLine className="d_cd_input_icon" />
                          <input
                            type="date"
                            className="d_cd_input"
                            required
                            min={bookingForm.pickupDate}
                            value={bookingForm.returnDate}
                            onChange={(e) =>
                              setBookingFields({
                                ...bookingForm,
                                returnDate: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </Col>

                    <Col xs={12} md={6} lg={6}>
                      <div className="d_cd_input_group">
                        <label>Return Time</label>
                        <div className="d_cd_input_wrapper">
                          <RiTimeLine className="d_cd_input_icon" />
                          <input
                            type="time"
                            className="d_cd_input"
                            required
                            value={bookingForm.returnTime}
                            onChange={(e) =>
                              setBookingFields({
                                ...bookingForm,
                                returnTime: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>

                <Col xs={12}>
                  <div className="d_cd_input_group">
                    <label>Rental Type</label>
                    <div className="d_cd_input_wrapper d_fname_input_wrapper">
                      <select
                        className="d_cd_input"
                        value={bookingForm.rentalType}
                        onChange={(e) =>
                          setBookingFields({
                            ...bookingForm,
                            rentalType: e.target.value,
                          })
                        }
                      >
                        <option value="day">Per Day</option>
                        <option value="hour">Per Hour</option>
                      </select>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* FOOTER */}
              <div className="mt-md-5 mt-3 d-md-flex justify-content-between align-items-center d-block">
                <div className="d_booking_price_summary">
                  <div
                    style={{
                      color: "var(--x-primary)",
                      fontWeight: 700,
                      fontSize: "1.2rem",
                    }}
                  >
                    ${selectedCar?.pricePerDay}
                    <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>/day</span>
                  </div>
                  {calculateTotalAmount() > 0 && (
                    <div style={{ color: "var(--x-text)", fontWeight: 600, fontSize: "1.4rem" }}>
                      Total: ${calculateTotalAmount()}
                    </div>
                  )}
                </div>

                <button
                  className="d_btn_cta d-flex align-items-center text-nowrap mt-md-0 mt-2"
                  type="submit"
                  disabled={isBookingLoading}
                  style={{
                    textDecoration: "none",
                    margin: 0,
                    maxWidth: "max-content",
                  }}
                >
                  {isBookingLoading ? (
                    <Spinner size="sm" animation="border" className="me-2" />
                  ) : (
                    "Confirm Booking"
                  )}
                  <FaArrowRightLong className="ms-2" />
                </button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default BookingModal;
