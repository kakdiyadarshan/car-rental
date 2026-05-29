import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import {
  RiMapPin2Line,
  RiCalendarCheckLine,
  RiSteering2Line,
  RiSearchLine,
  RiArrowRightLine,
  RiArrowDownSLine,
  RiCheckLine
} from 'react-icons/ri';
import '../style/d_style.css';

/* ── Reusable Custom Dropdown ─────────────────────── */
const CustomSelect = ({ options, placeholder }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const choose = (val) => { setSelected(val); setOpen(false); };

  return (
    <div className="d_custom_select" ref={ref}>
      <button
        type="button"
        className={`d_select_trigger ${open ? 'active' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <span className={selected ? 'selected' : 'placeholder'}>
          {selected || placeholder}
        </span>
        <RiArrowDownSLine className={`d_select_arrow ${open ? 'rotated' : ''}`} size={18} />
      </button>

      {open && (
        <ul className="d_select_dropdown">
          {options.map((opt) => (
            <li
              key={opt}
              className={`d_select_option ${selected === opt ? 'active' : ''}`}
              onClick={() => choose(opt)}
            >
              {selected === opt && <RiCheckLine size={14} className="d_check_icon" />}
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ── Main Component ───────────────────────────────── */
const BookingSearch = () => {
  return (
    <section className="d_standalone_booking_section">
      <Container>
        <div className="d_booking_container_inner">

          {/* Header */}
          <div className="d_booking_header">
            <h2 className="d_booking_title">Find Your <span>Perfect Ride</span></h2>
            <p className="d_booking_subtitle">Rent premium cars for your next journey in just a few clicks.</p>
          </div>

          {/* Form Card */}
          <div className="d_booking_form_card">
            <Row className="g-0">

              {/* Location */}
              <Col xl={3} lg={3} md={6} className="d_search_field_col">
                <div className="d_field_wrapper">
                  <div className="d_field_icon"><RiMapPin2Line size={22} /></div>
                  <div className="d_field_data">
                    <label>Location</label>
                    <CustomSelect
                      placeholder="Select City"
                      options={['Ahmedabad', 'Surat', 'Mumbai', 'Vadodara']}
                    />
                  </div>
                </div>
              </Col>

              {/* Pickup Date */}
              <Col xl={3} lg={3} md={6} className="d_search_field_col">
                <div className="d_field_wrapper">
                  <div className="d_field_icon"><RiCalendarCheckLine size={22} /></div>
                  <div className="d_field_data">
                    <label>Pickup Date</label>
                    <div className="d_date_wrapper">
                      <input
                        type="date"
                        className="d_date_input"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                </div>
              </Col>

              {/* Vehicle Type */}
              <Col xl={3} lg={3} md={6} className="d_search_field_col">
                <div className="d_field_wrapper">
                  <div className="d_field_icon"><RiSteering2Line size={22} /></div>
                  <div className="d_field_data">
                    <label>Vehicle Type</label>
                    <CustomSelect
                      placeholder="All Types"
                      options={['Luxury', 'Sports', 'SUV', 'Sedan', 'Convertible']}
                    />
                  </div>
                </div>
              </Col>

              {/* CTA */}
              <Col xl={3} lg={3} md={6} className="d_search_field_col p-0">
                <button className="d_booking_submit_btn">
                  <RiSearchLine size={20} />
                  <span>Check Availability</span>
                  <RiArrowRightLine className="d_arrow_icon" />
                </button>
              </Col>

            </Row>
          </div>

          {/* Quick Filters */}
          <div className="d_fast_filters d-none d-md-flex">
            <span>Quick Select:</span>
            <button className="d_filter_chip">Limo</button>
            <button className="d_filter_chip">Coupe</button>
            <button className="d_filter_chip">Convertible</button>
          </div>

        </div>
      </Container>
    </section>
  );
};

export default BookingSearch;