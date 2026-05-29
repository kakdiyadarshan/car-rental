import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaCar, FaShieldAlt, FaClock, FaCheckCircle, FaAward, FaUsers } from 'react-icons/fa';
import { RiHistoryLine, RiTeamLine, RiFocus2Line, RiCarLine } from 'react-icons/ri';
import Header from '../components/Header';
import Footer from './Footer';
import CTA from './CTA';

const AboutUs = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <section className="flex-grow py-20 bg-x-bg text-x-text overflow-hidden">
                <Container>
                    {/* Header Section */}
                    <div className="mb-20 text-center animate-fadeIn">
                        <span className="block uppercase text-[0.75rem] tracking-[4px] text-x-primary font-bold mb-3">Our Story</span>
                        <h1 className="font-bebas text-5xl md:text-[4.5rem] text-x-text tracking-[2px] uppercase select-none">
                            The AutoX <span className="text-transparent !stroke-x-primary [-webkit-text-stroke:1px_#dd6f27]">Legacy</span>
                        </h1>
                        <p className="text-x-text-muted max-w-[700px] mt-6 mx-auto text-lg leading-relaxed font-dm">
                            Since 2010, we've been redefining the standards of luxury mobility, one extraordinary journey at a time.
                        </p>
                    </div>

                    {/* Mission Section */}
                    <div className="relative mb-32 group">
                        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                            <div className="w-full lg:w-1/2 relative">
                                <div className="relative z-10 overflow-hidden rounded-2xl shadow-premium aspect-[4/3]">
                                    <img 
                                        src="https://i.pinimg.com/736x/40/e3/1a/40e31aaec493afdb0b8cb0ba78dc0a61.jpg" 
                                        alt="Premium Service" 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                                <div className="absolute -bottom-6 -right-6 w-full h-full border border-x-primary/30 rounded-2xl -z-10 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-500" />
                            </div>
                            <div className="w-full lg:w-1/2">
                                <div className="space-y-6">
                                    <span className="block uppercase text-[0.7rem] tracking-[3px] text-x-primary font-bold">Our Mission</span>
                                    <h2 className="font-bebas text-4xl md:text-5xl text-x-text tracking-wider uppercase leading-tight">
                                        Redefining the <span className="text-x-primary">way you travel</span>
                                    </h2>
                                    <p className="text-x-text-muted text-lg leading-relaxed font-dm">
                                        We are committed to providing a seamless and premium car rental experience
                                        that empowers your journey. Whether it's a business trip, a family vacation,
                                        or just a weekend getaway, we have the perfect vehicle for you.
                                    </p>
                                    <ul className="space-y-4 pt-4">
                                        {[
                                            "24/7 Premium Roadside Assistance",
                                            "Zero Hidden Charges & Transparent Pricing",
                                            "Flexible Pickup & Drop-off Locations"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-4 text-x-text font-medium group/li">
                                                <div className="w-6 h-6 rounded-full bg-x-primary/10 flex items-center justify-center shrink-0 group-hover/li:bg-x-primary transition-colors">
                                                    <FaCheckCircle className="text-x-primary group-hover/li:text-white transition-colors" />
                                                </div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="py-20 mb-32 border-y border-white/[0.05]">
                        <Row className="g-5">
                            {[
                                { icon: <FaCar />, title: "Luxury Fleet", desc: "Access to the latest models from the world's most prestigious automotive brands." },
                                { icon: <FaShieldAlt />, title: "Full Protection", desc: "Drive with peace of mind with our comprehensive insurance and safety protocols." },
                                { icon: <FaAward />, title: "Award Winning", desc: "Recognized globally for our commitment to excellence and customer satisfaction." }
                            ].map((feat, i) => (
                                <Col md={4} key={i}>
                                    <div className="h-full text-center p-10 bg-white/[0.02] border border-white/[0.05] rounded-3xl hover:bg-white/[0.04] hover:border-x-primary/30 hover:-translate-y-2 transition-all duration-300">
                                        <div className="w-16 h-16 bg-x-primary/10 rounded-2xl flex items-center justify-center text-x-primary text-3xl mx-auto mb-6 transition-transform duration-500 hover:rotate-[360deg]">
                                            {feat.icon}
                                        </div>
                                        <h3 className="font-bebas text-2xl tracking-wider mb-4">{feat.title}</h3>
                                        <p className="text-x-text-muted text-sm leading-relaxed">{feat.desc}</p>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>

                    {/* Stats Banner */}
                    <div className="bg-x-surface border border-x-border rounded-[32px] p-10 md:p-16 mb-32 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-x-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <Row className="text-center g-5 relative z-10">
                            {[
                                { icon: <RiCarLine />, num: "120+", label: "Premium Models" },
                                { icon: <RiTeamLine />, num: "25k", label: "Happy Clients" },
                                { icon: <RiHistoryLine />, num: "15+", label: "Years in Market" },
                                { icon: <RiFocus2Line />, num: "100%", label: "Satisfaction" }
                            ].map((stat, i) => (
                                <Col xs={6} lg={3} key={i}>
                                    <div className="space-y-4">
                                        <div className="text-x-primary text-4xl mb-4 opacity-50 group-hover:opacity-100 transition-opacity flex justify-center">
                                            {stat.icon}
                                        </div>
                                        <h2 className="font-bebas text-5xl md:text-6xl text-white tracking-widest">{stat.num}</h2>
                                        <p className="text-x-text-muted uppercase tracking-[3px] text-[0.65rem] font-bold">{stat.label}</p>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>

                    {/* Vision Section */}
                    <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20 mb-20 group">
                        <div className="w-full lg:w-1/2 relative">
                            <div className="relative z-10 overflow-hidden rounded-2xl shadow-premium aspect-[4/3]">
                                <img 
                                    src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                                    alt="Future Vision" 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            <div className="absolute -bottom-6 -left-6 w-full h-full border border-x-primary/30 rounded-2xl -z-10 group-hover:-translate-x-3 group-hover:translate-y-3 transition-transform duration-500" />
                        </div>
                        <div className="w-full lg:w-1/2 text-left">
                            <div className="space-y-6">
                                <span className="block uppercase text-[0.7rem] tracking-[3px] text-x-primary font-bold">Our Vision</span>
                                <h2 className="font-bebas text-4xl md:text-5xl text-x-text tracking-wider uppercase leading-tight">
                                    Driving the <span className="text-x-primary">future of mobility</span>
                                </h2>
                                <p className="text-x-text-muted text-lg leading-relaxed font-dm">
                                    To be the most preferred car rental service provider globally,
                                    redefining mobility through innovation and customer-centricity.
                                </p>
                                <p className="text-x-text-muted text-lg leading-relaxed font-dm">
                                    We believe that every journey tells a story, and we're here to make
                                    sure yours is comfortable, safe, and unforgettable.
                                </p>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
            <CTA />
            <Footer />
        </div>
    );
}

export default AboutUs;

