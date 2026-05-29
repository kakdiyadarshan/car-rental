import React from 'react';
import { Container, Row, Col, Accordion } from 'react-bootstrap';
import {
  RiPhoneLine,
  RiMailLine,
  RiMapPinLine,
  RiArrowRightLine
} from 'react-icons/ri';
import Header from '../components/Header';
import Footer from './Footer';
import CTA from './CTA';

const Help = () => {
  const FAQS = [
    {
      q: "How do I book a premium car?",
      a: "Simply browse our fleet, select your preferred vehicle, choose your dates and location, and complete the secure checkout process. You'll receive an instant confirmation email."
    },
    {
      q: "What is the minimum age for exotic rentals?",
      a: "For our exotic collection (Lamborghini, Ferrari, etc.), the minimum age is 25. For luxury and standard models, the minimum age is 21."
    },
    {
      q: "Are there any hidden charges?",
      a: "No. At AutoX, we pride ourselves on absolute transparency. The price you see during booking includes standard insurance and taxes."
    },
    {
      q: "Can I get the car delivered to my hotel?",
      a: "Yes! We offer concierge delivery to any hotel, airport, or residence within our service areas. This can be selected during the booking process."
    }
  ];

  return (
    <div className="min-h-screen bg-x-bg text-x-text font-dm">
      <section className="pt-32 pb-0">
        {/* Header */}
        <div className="mb-20 text-center animate-fadeIn">
          <span className="block uppercase text-[0.8rem] tracking-[5px] text-x-primary font-bold mb-4">Support Center</span>
          <h1 className="font-bebas text-5xl md:text-7xl text-white tracking-[2px] uppercase">
            How Can We <span className="text-x-primary">Help You?</span>
          </h1>
          <div className="w-20 h-1 bg-x-primary mx-auto my-6 rounded-full overflow-hidden">
                <div className="w-full h-full bg-white/20 animate-[ticker_2s_linear_infinite]" />
            </div>
          <p className="text-x-text-muted max-w-2xl mx-auto text-lg leading-relaxed">
            Find answers to common questions or reach out to our 24/7 concierge team.
          </p>
        </div>

        <Container>
          {/* Support Channels */}
          <Row className="g-4 mb-24">
            {[
              {
                icon: <RiPhoneLine />,
                title: "24/7 Concierge",
                detail: "+1 (555) 123-4567",
                action: "Call Now",
                onClick: () => window.location.href = "tel:+15551234567"
              },
              {
                icon: <RiMailLine />,
                title: "Email Support",
                detail: "vip@autox.com",
                action: "Send Email",
                onClick: () => window.open("https://mail.google.com/mail/?view=cm&to=vip@autox.com", "_blank")
              },
              {
                icon: <RiMapPinLine />,
                title: "Global HQ",
                detail: "Beverly Hills, CA",
                action: "Get Directions",
                onClick: () => window.open("https://www.google.com/maps?q=Beverly+Hills+CA", "_blank")
              }
            ].map((item, i) => (
              <Col md={4} key={i}>
                <div className="group h-full bg-x-surface border border-x-border p-10 rounded-[32px] text-center hover:border-x-primary/40 hover:-translate-y-2 transition-all duration-300 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-x-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                  
                  <div className="w-20 h-20 bg-x-primary/10 rounded-2xl flex items-center justify-center text-x-primary text-4xl mx-auto mb-8 transition-transform group-hover:scale-110">
                    {item.icon}
                  </div>

                  <h3 className="font-bebas text-2xl tracking-widest mb-3 uppercase text-white">
                    {item.title}
                  </h3>

                  <p className="text-x-text font-semibold mb-8">
                    {item.detail}
                  </p>

                  <button
                    className="w-full py-4 rounded-xl border border-x-primary/30 text-x-primary font-bold uppercase tracking-widest text-xs hover:bg-x-primary hover:text-white transition-all shadow-lg hover:shadow-x-primary/20"
                    onClick={item.onClick}
                  >
                    {item.action}
                  </button>
                </div>
              </Col>
            ))}
          </Row>

          {/* FAQs Section */}
          <div className="flex flex-col lg:flex-row items-center gap-16 mb-24 py-16 border-t border-white/[0.05]">
            <div className="w-full lg:w-1/2 space-y-8 animate-slideUp">
              <div>
                <span className="block uppercase text-[0.7rem] tracking-[3px] text-x-primary font-bold mb-3">Knowledge Base</span>
                <h2 className="font-bebas text-4xl md:text-5xl text-white tracking-widest uppercase leading-tight">Common <span className="text-x-primary">Questions</span></h2>
              </div>
              
              <Accordion defaultActiveKey="0" className="space-y-4 !border-none">
                {FAQS.map((faq, index) => (
                  <Accordion.Item 
                    eventKey={index.toString()} 
                    key={index} 
                    className="!bg-white/[0.03] !border !border-white/[0.05] !rounded-2xl overflow-hidden"
                  >
                    <Accordion.Header className="custom-accordion-header">{faq.q}</Accordion.Header>
                    <Accordion.Body className="text-x-text-muted leading-relaxed font-dm text-base">
                      {faq.a}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>
            <div className="w-full lg:w-1/2 animate-slideUp [animation-delay:200ms]">
              <div className="relative group">
                <div className="relative z-10 p-4 bg-x-surface border border-x-border rounded-[32px] overflow-hidden shadow-premium">
                    <img
                        src="https://demo.awaikenthemes.com/novaride/dark/wp-content/uploads/2024/08/post-1.jpg"
                        alt="Customer Support"
                        className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
                    />
                </div>
                <div className="absolute -bottom-6 -right-6 w-full h-full border border-x-primary/20 rounded-[32px] -z-10 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform" />
              </div>
            </div>
          </div>
        </Container>
      </section>
      <CTA />
      <Footer />

      <style>
        {`
          .custom-accordion-header .accordion-button {
            background-color: transparent !important;
            color: white !important;
            font-family: 'DM Sans', sans-serif;
            font-weight: 700;
            padding: 24px;
            box-shadow: none !important;
            border: none !important;
          }
          .custom-accordion-header .accordion-button:not(.collapsed) {
            color: var(--x-primary) !important;
            background-color: rgba(221, 111, 39, 0.05) !important;
          }
          .custom-accordion-header .accordion-button::after {
            filter: invert(1) brightness(2);
          }
          .accordion-item {
            margin-bottom: 12px;
            border: 1px solid rgba(255,255,255,0.05) !important;
            border-radius: 16px !important;
          }
          .accordion-button:focus {
            box-shadow: none;
            border-color: rgba(221, 111, 39, 0.5);
          }
        `}
      </style>
    </div>
  );
};

export default Help;

