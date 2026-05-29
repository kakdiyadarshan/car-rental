import React from 'react';
import { Container, Accordion } from 'react-bootstrap';
import Footer from './Footer';

const FAQ = () => {
  const FAQS = [
    {
      q: "What do I need to rent a car?",
      a: "You will need a valid driver's license (with at least 2 years of experience), a valid passport or ID card, and a credit card for the security deposit. International renters may require an International Driving Permit (IDP)."
    },
    {
      q: "Can I cancel my reservation?",
      a: "Yes, you can cancel your reservation through our Help Center. Cancellations made more than 48 hours before the pickup time are free. Cancellations within 48 hours will incur a one-day rental fee."
    },
    {
      q: "Is there a mileage limit?",
      a: "Most of our standard luxury and SUV rentals include unlimited mileage. However, exotic vehicles like Lamborghini and Ferrari models have a daily mileage limit. Please check the vehicle details page for specific limits."
    },
    {
      q: "What happens if I return the car late?",
      a: "A grace period of 59 minutes is typically allowed. Beyond that, a late return fee of one full rental day may apply. Please contact us immediately if you anticipate being late."
    },
    {
      q: "Are the vehicles insured?",
      a: "Yes, all our vehicles include comprehensive insurance with a standard deductible. You can also opt for additional coverage during the booking process to reduce your liability."
    },
    {
      q: "Can I add an additional driver?",
      a: "Yes, you can add up to two additional drivers during the booking process or at the time of pickup. Additional drivers must meet the same age and licensing requirements as the primary renter."
    },
    {
      q: "What is the policy for fuel?",
      a: "Our standard policy is 'Full-to-Full'. We provide the car with a full tank, and we expect it to be returned full. If not, a refueling fee plus the cost of fuel will be charged."
    }
  ];

  return (
    <>
      <section className="py-24 bg-x-bg min-h-screen">
        <Container>
          {/* Header */}
          <div className="mb-20 text-center space-y-6 animate-fadeIn">
            <span className="block uppercase text-[0.7rem] tracking-[5px] text-x-primary font-bold">Everything you need to know</span>
            <h1 className="font-bebas text-5xl md:text-7xl text-white tracking-widest uppercase leading-none">
              Frequently Asked <span className="text-transparent !stroke-white [-webkit-text-stroke:1px_#fff]">Questions</span>
            </h1>
            <p className="text-x-text-muted max-w-2xl mx-auto text-lg leading-relaxed font-dm">
              Got questions? We've got answers. Explore our knowledge base for everything from booking details to rental policies.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto animate-slideUp">
            <Accordion defaultActiveKey="0" className="space-y-6">
              {FAQS.map((faq, index) => (
                <Accordion.Item 
                    eventKey={index.toString()} 
                    key={index} 
                    className="!bg-x-surface border !border-x-border !rounded-[32px] overflow-hidden group/item transition-all duration-500 hover:border-x-primary/40"
                >
                  <Accordion.Header className="group [&>.accordion-button]:!bg-transparent [&>.accordion-button]:!text-white [&>.accordion-button]:!shadow-none [&>.accordion-button]:!p-8 [&>.accordion-button]:after:!invert [&>.accordion-button:not(.collapsed)]:!border-b [&>.accordion-button:not(.collapsed)]:!border-white/5">
                    <span className="font-bebas text-2xl tracking-[2px] uppercase group-hover/item:text-x-primary transition-colors">{faq.q}</span>
                  </Accordion.Header>
                  <Accordion.Body className="!bg-white/[0.01] !text-x-text-muted !p-10 !leading-relaxed font-dm text-lg opacity-80">
                    {faq.a}
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </div>
        </Container>
      </section>
      <Footer />
    </>
  );
};

export default FAQ;

