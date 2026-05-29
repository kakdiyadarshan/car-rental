import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaCar, FaShieldAlt, FaClock, FaCheckCircle, FaAward, FaUsers } from 'react-icons/fa';
import { RiHistoryLine, RiTeamLine, RiFocus2Line, RiCarLine } from 'react-icons/ri';
import Header from '../components/Header';
import Footer from './Footer';
import CTA from './CTA';
import '../style/d_style.css';

const AboutUs = () => {
    return (
        <>
            <section className="d_about_page_section d_section_padding" style={{ background: 'var(--x-bg)', color: 'var(--x-text)' }}>
                <Container>
                    {/* Header Section */}
                    <div className="d_fleet_header d_mb_responsive" style={{ textAlign: 'center' }}>
                        <span className="d_fleet_eyebrow">Our Story</span>
                        <h1 className="d_fleet_title d_responsive_title">The AutoX <span>Legacy</span></h1>
                        <p className="d_responsive_subtitle" style={{ color: 'var(--x-text-muted)', maxWidth: '700px', margin: '20px auto 0', lineHeight: '1.8' }}>
                            Since 2010, we've been redefining the standards of luxury mobility, one extraordinary journey at a time.
                        </p>
                    </div>

                    {/* Mission Section - Layered */}
                    <Row className="z_aboutus_section">
                            <div className="z_aboutus_image_wrapper">
                                <div className="z_aboutus_image_box">
                                    <img src="https://i.pinimg.com/736x/40/e3/1a/40e31aaec493afdb0b8cb0ba78dc0a61.jpg" alt="Premium Service" />
                                </div>
                                <div className="z_aboutus_image_decorator"></div>
                            </div>
                        <div className='z_aboutus_content'>
                            <div className="d_about_text_content">
                                <span className="d_fleet_eyebrow" style={{ textAlign: 'left' }}>Our Mission</span>
                                <h2 className="d_fleet_title" style={{ fontSize: '2.5rem', textAlign: 'left', marginBottom: '25px' }}>Redefining the <span>way you travel</span></h2>
                                <p style={{ color: 'var(--x-text-muted)', lineHeight: '1.8', marginBottom: '25px' }}>
                                    We are committed to providing a seamless and premium car rental experience
                                    that empowers your journey. Whether it's a business trip, a family vacation,
                                    or just a weekend getaway, we have the perfect vehicle for you.
                                </p>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {[
                                        "24/7 Premium Roadside Assistance",
                                        "Zero Hidden Charges & Transparent Pricing",
                                        "Flexible Pickup & Drop-off Locations"
                                    ].map((item, i) => (
                                        <li key={i} style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--x-text)' }}>
                                            <FaCheckCircle style={{ color: 'var(--x-primary)' }} /> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </Row>

                    {/* Features Section - Glassmorphism */}
                    <div className="d_inner_padding">
                        <Row className="g-4">
                            {[
                                { icon: <FaCar />, title: "Luxury Fleet", desc: "Access to the latest models from the world's most prestigious automotive brands." },
                                { icon: <FaShieldAlt />, title: "Full Protection", desc: "Drive with peace of mind with our comprehensive insurance and safety protocols." },
                                { icon: <FaAward />, title: "Award Winning", desc: "Recognized globally for our commitment to excellence and customer satisfaction." }
                            ].map((feat, i) => (
                                <Col md={4} key={i}>
                                    <div className="d_wcu_feature_card" style={{ height: '100%', textAlign: 'center', padding: '40px 30px' }}>
                                        <div className="d_wcu_icon_box" style={{ margin: '0 auto 20px', fontSize: '2rem' }}>{feat.icon}</div>
                                        <h3 style={{ fontFamily: 'Bebas Neue', letterSpacing: '1px', fontSize: '1.5rem', marginBottom: '15px' }}>{feat.title}</h3>
                                        <p style={{ color: 'var(--x-text-muted)', fontSize: '0.95rem' }}>{feat.desc}</p>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>

                    {/* Stats Section */}
                    <div className="d_aboutus_stats_banner" style={{ background: 'var(--x-surface)', padding: '30px', borderRadius: '20px', border: '1px solid var(--x-border)', marginBottom: '80px' }}>
                        <Row className="text-center g-4">
                            {[
                                { icon: <RiCarLine />, num: "120+", label: "Premium Models" },
                                { icon: <RiTeamLine />, num: "25k", label: "Happy Clients" },
                                { icon: <RiHistoryLine />, num: "15+", label: "Years in Market" },
                                { icon: <RiFocus2Line />, num: "100%", label: "Satisfaction" }
                            ].map((stat, i) => (
                                <Col xs={6} lg={3} key={i}>
                                    <div className="d_stat_item">
                                        <div style={{ color: 'var(--x-primary)', fontSize: '2rem', marginBottom: '10px' }}>{stat.icon}</div>
                                        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2.5rem', margin: 0 }}>{stat.num}</h2>
                                        <p style={{ color: 'var(--x-text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700 }}>{stat.label}</p>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>

                    {/* Vision Section */}
                    <Row className="z_aboutus_section reverse">
                        <div className="z_aboutus_image_wrapper">
                        <div className="z_aboutus_image_box">
                            <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Future Vision" />
                        </div>
                        <div className="z_aboutus_image_decorator"></div>
                    </div>
                        <div className="z_aboutus_content">
                            <div className="d_about_text_content">
                                <span className="d_fleet_eyebrow" style={{ textAlign: 'left' }}>Our Vision</span>
                                <h2 className="d_fleet_title" style={{ fontSize: '2.5rem', textAlign: 'left', marginBottom: '25px' }}>Driving the <span>future of mobility</span></h2>
                                <p style={{ color: 'var(--x-text-muted)', lineHeight: '1.8', marginBottom: '20px' }}>
                                    To be the most preferred car rental service provider globally,
                                    redefining mobility through innovation and customer-centricity.
                                </p>
                                <p style={{ color: 'var(--x-text-muted)', lineHeight: '1.8' }}>
                                    We believe that every journey tells a story, and we're here to make
                                    sure yours is comfortable, safe, and unforgettable.
                                </p>
                            </div>
                        </div>
                    </Row>
                </Container>
                <CTA />
            </section>
            <Footer />
        </>
    );
}

export default AboutUs;
