import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { 
  RiMapPinLine, 
  RiCalendarCheckLine, 
  RiCarLine, 
  RiArrowRightLine 
} from 'react-icons/ri';

const STEPS = [
  {
    id: 1,
    icon: <RiMapPinLine size={32} />,
    title: "Choose Location",
    desc: "Select your preferred pickup point from our extensive network of premium outlets across the city.",
    color: "#dd6f27"
  },
  {
    id: 2,
    icon: <RiCalendarCheckLine size={32} />,
    title: "Pick-Up Date",
    desc: "Flexible scheduling options that fit your timeline. Book instantly with our real-time availability system.",
    color: "#e8c97a"
  },
  {
    id: 3,
    icon: <RiCarLine size={32} />,
    title: "Book Your Car",
    desc: "Confirm your reservation with a few clicks. No hidden fees, just pure performance at your fingertips.",
    color: "#dd6f27"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-x-bg overflow-hidden relative">
      <Container>
        {/* Header */}
        <div className="mb-20 text-center animate-fadeIn">
          <span className="block uppercase text-[0.7rem] tracking-[5px] text-x-primary font-bold mb-4">Seamless Process</span>
          <h2 className="font-bebas text-5xl md:text-7xl text-white tracking-widest uppercase">
            How It <span className="text-x-primary">Works</span>
          </h2>
          <div className="w-20 h-1 bg-x-primary mx-auto my-6 rounded-full overflow-hidden">
                <div className="w-full h-full bg-white/20 animate-[ticker_2s_linear_infinite]" />
            </div>
          <p className="text-x-text-muted max-w-2xl mx-auto text-lg leading-relaxed">
            Experience the future of car rentals with our streamlined three-step booking process designed for speed and convenience.
          </p>
        </div>

        {/* Steps Grid */}
        <Row className="relative">
          {STEPS.map((step, index) => (
            <Col key={step.id} lg={4} md={6} className="mb-12 lg:mb-0">
              <div className="relative group px-4">
                {/* Connection Line (Hidden on mobile) */}
                {index < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/4 -right-8 z-10 text-white/10 group-hover:text-x-primary transition-colors duration-500 translate-y-4">
                    <RiArrowRightLine size={48} className="animate-pulse" />
                  </div>
                )}

                <div className="relative z-10 bg-x-surface border border-x-border rounded-[40px] p-10 h-full transition-all duration-500 hover:border-x-primary/40 hover:-translate-y-3 shadow-premium overflow-hidden group/card">
                  {/* Icon Box */}
                  <div className="relative w-24 h-24 mb-8">
                    <div className="absolute inset-0 bg-x-primary/10 rounded-[28px] rotate-6 group-hover/card:rotate-12 transition-transform duration-500" />
                    <div className="relative w-full h-full bg-x-surface border border-white/5 rounded-[28px] flex items-center justify-center text-x-primary shadow-xl group-hover/card:scale-110 transition-transform duration-500">
                      {step.icon}
                    </div>
                    <span className="absolute -bottom-2 -right-2 w-10 h-10 bg-x-primary text-white font-bebas text-xl rounded-full flex items-center justify-center border-4 border-x-surface animate-bounce select-none">
                      0{step.id}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-bebas text-2xl tracking-widest text-white uppercase group-hover/card:text-x-primary transition-colors">{step.title}</h3>
                    <p className="text-x-text-muted font-dm leading-relaxed text-base opacity-80 group-hover/card:opacity-100 transition-opacity">{step.desc}</p>
                  </div>

                  {/* Aesthetic Glow */}
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-[60px] opacity-0 group-hover/card:opacity-20 transition-opacity duration-500" style={{ background: step.color }} />
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default HowItWorks;

