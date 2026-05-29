import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import {
  RiPhoneLine,
  RiMailLine,
  RiMapPinLine,
  RiArrowRightSLine,
  RiAddLine,
  RiSubtractLine
} from 'react-icons/ri';
import Footer from './Footer';
import CTA from './CTA';

const Help = () => {
  const [openFaq, setOpenFaq] = useState(0);

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

  const channels = [
    {
      icon: <RiPhoneLine />,
      label: "Call Us",
      title: "24/7 Concierge",
      detail: "+1 (555) 123-4567",
      action: "Call Now",
      onClick: () => window.location.href = "tel:+15551234567"
    },
    {
      icon: <RiMailLine />,
      label: "Email",
      title: "Email Support",
      detail: "vip@autox.com",
      action: "Send Email",
      onClick: () => window.open("https://mail.google.com/mail/?view=cm&to=vip@autox.com", "_blank")
    },
    {
      icon: <RiMapPinLine />,
      label: "Visit",
      title: "Global HQ",
      detail: "Beverly Hills, CA",
      action: "Get Directions",
      onClick: () => window.open("https://www.google.com/maps?q=Beverly+Hills+CA", "_blank")
    }
  ];

  return (
    <div className="min-h-screen bg-x-bg text-x-text font-dm">

      {/* Hero */}
      <section className="relative pt-32 md:pt-36 pb-11 md:pb-24 overflow-hidden">
        {/* Diagonal accent strip */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(135deg,rgba(221,111,39,0.07)_0%,transparent_50%)]" />

        {/* Large faded watermark - Responsive sizing to prevent mobile overflow */}
        <span className="absolute right-4 sm:right-8 top-16 font-bebas text-[6rem] sm:text-[8rem] md:text-[10rem] lg:text-[12rem] leading-none select-none pointer-events-none text-[rgba(221,111,39,0.04)] tracking-[-4px]">
          FAQ
        </span>

        <Container>
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Left text */}
            <div className="w-full lg:w-1/2">
              <span className="inline-block text-[0.72rem] tracking-[6px] font-bold uppercase mb-6 text-x-primary">
                Support Center
              </span>
              <h1 className="font-bebas uppercase leading-none mb-6 text-5xl sm:text-6xl md:text-7xl lg:text-[6.5rem] tracking-[2px]">
                <span className="text-white">Got a</span>
                <br />
                <span className="text-x-primary">Question?</span>
                <br />
                <span className="text-white">We're Here.</span>
              </h1>
              <p className="text-lg leading-relaxed mb-8 text-white/45 max-w-[420px]">
                Our concierge team is available around the clock. Find answers below or reach us directly.
              </p>

              {/* Stat pills */}
              <div className="flex gap-6 flex-wrap">
                {[['24/7', 'Availability'], ['<2 min', 'Avg Response'], ['100%', 'Satisfaction']].map(([num, lbl], i) => (
                  <div key={i} className="flex flex-col">
                    <span className="font-bebas text-3xl text-x-primary tracking-[1px]">
                      {num}
                    </span>
                    <span className="text-xs uppercase tracking-widest text-white/35">{lbl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right image */}
            <div className="w-full lg:w-1/2">
              <div className="relative">
                {/* Offset accent frame */}
                <div className="absolute -bottom-4 -left-4 w-full h-full rounded-3xl bg-x-primary/[0.12]" />
                <img
                  src="https://demo.awaikenthemes.com/novaride/dark/wp-content/uploads/2024/08/post-1.jpg"
                  alt="Customer Support"
                  className="relative z-10 w-full rounded-3xl object-cover aspect-[4/3]"
                />
                {/* Badge overlay */}
                <div className="absolute bottom-6 left-6 z-20 px-3 sm:px-5 py-3 rounded-2xl flex items-center gap-3 bg-[rgba(10,10,10,0.85)] backdrop-blur-md border border-white/5">
                  <span className="text-2xl text-x-primary">
                    <RiPhoneLine />
                  </span>
                  <div>
                    <div className="text-white font-bold text-sm">Live Support</div>
                    <div className="text-xs text-white/45">Always online</div>
                  </div>
                  {/* Pulsing dot */}
                  <span className="relative ml-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                </div>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* Contact channels */}
      <section className="py-11 md:py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {channels.map((item, i) => (
              <button
                key={i}
                onClick={item.onClick}
                className="group text-left flex items-center justify-between p-4 sm:p-6 xl:p-8 rounded-3xl bg-white/[0.02]  border-white/[0.05] transition-all duration-300 hover:bg-white/[0.04] hover:border-x-primary/30 hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-center gap-3 sm:gap-4 xl:gap-5">
                  {/* Icon */}
                  <div className="w-12 h-12 xl:w-14 xl:h-14 rounded-2xl flex items-center justify-center text-xl xl:text-2xl flex-shrink-0 transition-all duration-300 group-hover:scale-110 bg-x-primary/[0.12] text-x-primary">
                    {item.icon}
                  </div>
                  {/* Text */}
                  <div>
                    <div className="text-[10px] xl:text-xs uppercase tracking-widest mb-1 text-white/30">{item.label}</div>
                    <div className="font-bold text-white text-base xl:text-lg mb-0.5 leading-tight whitespace-nowrap">{item.title}</div>
                    <div className="text-xs sm:text-sm text-white/50 font-medium tracking-wide whitespace-nowrap">{item.detail}</div>
                  </div>
                </div>
                {/* Arrow */}
                <RiArrowRightSLine className="text-xl xl:text-2xl flex-shrink-0 transition-all duration-300 group-hover:translate-x-1 text-white/20 group-hover:text-x-primary ml-2 hidden sm:block" />
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-11 md:py-24">
        <Container>
          <div className="flex flex-col lg:flex-row md:gap-16 items-start">

            {/* Section header */}
            <div className="w-full lg:w-2/5 lg:sticky top-32 mb-10 lg:mb-0">
              <span className="inline-block text-[0.72rem] tracking-[6px] font-bold uppercase mb-3 md:mb-5 text-x-primary">
                Knowledge Base
              </span>
              <h2 className="font-bebas uppercase text-white leading-none mb-4 md:mb-6 text-4xl sm:text-5xl md:text-6xl tracking-[2px]">
                Common
                <br />
                <span className="text-x-primary">Questions</span>
              </h2>
              <p className="leading-relaxed text-white/40">
                Everything you need to know about our premium rental experience. Can't find what you're looking for?
              </p>
              <button
                onClick={() => window.location.href = "tel:+15551234567"}
                className="mt-8 inline-flex items-center gap-2 font-bold text-sm uppercase tracking-widest transition-all duration-200 hover:gap-3 text-x-primary bg-none border-none cursor-pointer p-0"
              >
                Contact Support <RiArrowRightSLine />
              </button>
            </div>

            {/* FAQ list */}
            <div className="w-full lg:w-3/5">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="border-b border-white/[0.07]">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between gap-4 py-7 text-left bg-transparent border-none cursor-pointer"
                    >
                      <span className={`font-bold text-base md:text-lg transition-colors duration-200 ${isOpen ? 'text-x-primary' : 'text-white'}`}>
                        {faq.q}
                      </span>
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                          isOpen
                            ? 'bg-x-primary/[0.15] text-x-primary'
                            : 'bg-white/[0.06] text-white/40'
                        }`}
                      >
                        {isOpen ? <RiSubtractLine className="text-base" /> : <RiAddLine className="text-base" />}
                      </span>
                    </button>
                    <div
                      className="overflow-hidden transition-[max-height] duration-[350ms] ease-in-out"
                      style={{ maxHeight: isOpen ? '200px' : '0' }}
                    >
                      <p className="text-base leading-relaxed pb-7 text-white/45">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </Container>
      </section>

      {/* <CTA /> */}
      {/* <Footer /> */}
    </div>
  );
};

export default Help;