import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { 
  RiShieldStarLine, 
  RiMoneyDollarCircleLine, 
  RiCustomerService2Line, 
  RiRoadMapLine 
} from 'react-icons/ri';

const FEATURES = [
  {
    id: 1,
    icon: <RiShieldStarLine />,
    title: "Premium Protection",
    desc: "Comprehensive insurance coverage for total peace of mind during your luxury drive."
  },
  {
    id: 2,
    icon: <RiMoneyDollarCircleLine />,
    title: "Best Price Guarantee",
    desc: "Unbeatable rates for the world's most exclusive automotive brands and models."
  },
  {
    id: 3,
    icon: <RiCustomerService2Line />,
    title: "24/7 VIP Support",
    desc: "Dedicated concierge service available around the clock for any assistance you need."
  },
  {
    id: 4,
    icon: <RiRoadMapLine />,
    title: "Anywhere Delivery",
    desc: "We bring the car to your doorstep, airport, or hotel. Your convenience is our priority."
  }
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-x-bg overflow-hidden relative">
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-x-primary/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
      
      <Container>
        <Row className="align-items-center gap-y-16">
          <Col lg={6}>
            <div className="space-y-8 animate-fadeIn">
              <span className="block uppercase text-[0.75rem] tracking-[5px] text-x-primary font-extrabold">The AutoX Advantage</span>
              <h2 className="font-bebas text-5xl md:text-7xl text-white tracking-[2px] uppercase leading-none">
                Why Choose Our <span className="text-x-primary">Service</span>
              </h2>
              <p className="text-x-text-muted text-lg md:text-xl leading-relaxed max-w-xl font-dm">
                We redefine the luxury car rental experience with a focus on quality, speed, and personalized service that exceeds expectations in every interaction.
              </p>
              
              <div className="grid grid-cols-3 gap-8 pt-6">
                {[
                  { num: "150+", label: "Luxury Cars" },
                  { num: "12k+", label: "Happy Clients" },
                  { num: "25+", label: "Locations" }
                ].map((stat, i) => (
                  <div key={i} className="space-y-1 group">
                    <span className="block font-bebas text-4xl text-white tracking-widest group-hover:text-x-primary transition-colors">{stat.num}</span>
                    <span className="block text-[0.65rem] font-bold uppercase tracking-widest text-x-text-muted">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Col>

          <Col lg={6}>
            <Row className="g-4">
              {FEATURES.map((feat) => (
                <Col key={feat.id} sm={6}>
                  <div className="group h-full bg-x-surface border border-x-border rounded-[32px] p-8 transition-all duration-300 hover:border-x-primary/40 hover:-translate-y-2 shadow-premium relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-x-primary/5 rounded-full blur-xl translate-x-1/2 -translate-y-1/2" />
                    
                    <div className="w-16 h-16 bg-x-primary/10 rounded-2xl flex items-center justify-center text-x-primary text-3xl mb-6 transition-transform group-hover:scale-110 group-hover:bg-x-primary group-hover:text-white duration-500">
                      {feat.icon}
                    </div>
                    <h3 className="font-bebas text-2xl tracking-widest text-white uppercase mb-3 transition-colors group-hover:text-x-primary">{feat.title}</h3>
                    <p className="text-x-text-muted text-sm leading-relaxed font-dm opacity-80 group-hover:opacity-100 transition-opacity">{feat.desc}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default WhyChooseUs;

