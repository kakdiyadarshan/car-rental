import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import {
  RiCarLine,
  RiFacebookFill,
  RiTwitterFill,
  RiInstagramLine,
  RiLinkedinFill,
  RiMapPinLine,
  RiPhoneLine,
  RiMailLine
} from 'react-icons/ri';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-x-surface border-t border-x-border pt-20 pb-10 overflow-hidden relative">
      {/* Decorative element */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-x-primary/5 rounded-full blur-[120px] -translate-y-1/2" />
      
      <Container className="relative z-10">
        <Row className="gx-4 gy-5">
          <Col lg={4} md={12}>
            <div className="space-y-8 pr-0 lg:pr-12">
              <Link to="/" className="flex items-center gap-0 no-underline group">
                <div className="w-12 h-12 bg-x-primary flex items-center justify-center text-white text-2xl [clip-path:polygon(12%_0%,88%_0%,100%_12%,100%_88%,88%_100%,12%_100%,0%_88%,0%_12%)] transition-transform duration-500 group-hover:rotate-[360deg]">
                  <RiCarLine />
                </div>
                <div className="flex flex-col ml-3">
                  <span className="font-bebas text-3xl tracking-widest text-white leading-none uppercase">Auto<span className="text-x-primary">X</span></span>
                  <span className="text-[0.6rem] tracking-[4px] text-x-text-muted uppercase font-bold mt-1">Premium Rentals</span>
                </div>
              </Link>
              
              <p className="text-x-text-muted leading-relaxed font-dm text-base">
                Elevate your journey with AutoX. We provide the most exclusive collection of luxury and exotic vehicles for those who demand excellence in every mile.
              </p>
              
              <div className="flex gap-3">
                {[
                  { icon: <RiFacebookFill />, url: "https://facebook.com" },
                  { icon: <RiTwitterFill />, url: "https://twitter.com" },
                  { icon: <RiInstagramLine />, url: "https://instagram.com" },
                  { icon: <RiLinkedinFill />, url: "https://linkedin.com" }
                ].map((social, i) => (
                  <a 
                    key={i} 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-white text-lg hover:bg-x-primary hover:border-x-primary hover:-translate-y-1 transition-all duration-300"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </Col>

          <Col xs={6} lg={2}>
            <div className="space-y-6">
              <h4 className="font-bebas text-xl tracking-widest text-white uppercase relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-0.5 after:bg-x-primary">Quick Links</h4>
              <ul className="space-y-4 list-none p-0 mt-8">
                {[
                  { label: "Home", to: "/" },
                  { label: "Our Fleet", to: "/Fleet" },
                  { label: "Car Gallery", to: "/Gallery" },
                  { label: "About Us", to: "/AboutUs" },
                  { label: "Feedback", to: "/Feedback" }
                ].map((link, i) => (
                  <li key={i}>
                    <Link to={link.to} className="text-x-text-muted hover:text-x-primary transition-colors text-sm font-medium no-underline flex items-center gap-2 group/link">
                      <span className="w-1.5 h-1.5 rounded-full bg-x-primary/40 group-hover/link:bg-x-primary transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Col>

          <Col xs={6} lg={2}>
            <div className="space-y-6">
              <h4 className="font-bebas text-xl tracking-widest text-white uppercase relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-0.5 after:bg-x-primary">Support</h4>
              <ul className="space-y-4 list-none p-0 mt-8">
                {[
                  { label: "Help Center", to: "/Help" },
                  { label: "FAQs", to: "/FAQ" },
                  { label: "Privacy Policy", to: "/PrivacyPolicy" },
                  { label: "Terms of Service", to: "/TermsOfService" }
                ].map((link, i) => (
                  <li key={i}>
                    <Link to={link.to} className="text-x-text-muted hover:text-x-primary transition-colors text-sm font-medium no-underline flex items-center gap-2 group/link">
                      <span className="w-1.5 h-1.5 rounded-full bg-x-primary/40 group-hover/link:bg-x-primary transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Col>

          <Col lg={4} md={12}>
            <div className="space-y-6">
              <h4 className="font-bebas text-xl tracking-widest text-white uppercase relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-0.5 after:bg-x-primary">Get In Touch</h4>
              <div className="space-y-6 mt-8">
                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-x-primary/10 flex items-center justify-center text-x-primary shrink-0 group-hover:bg-x-primary group-hover:text-white transition-colors">
                    <RiMapPinLine size={20} />
                  </div>
                  <span className="text-x-text-muted text-sm leading-relaxed pt-2">123 Luxury Drive, Beverly Hills, CA 90210</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-x-primary/10 flex items-center justify-center text-x-primary shrink-0 group-hover:bg-x-primary group-hover:text-white transition-colors">
                    <RiPhoneLine size={20} />
                  </div>
                  <span className="text-x-text-muted text-sm group-hover:text-x-text transition-colors">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-x-primary/10 flex items-center justify-center text-x-primary shrink-0 group-hover:bg-x-primary group-hover:text-white transition-colors">
                    <RiMailLine size={20} />
                  </div>
                  <span className="text-x-text-muted text-sm group-hover:text-x-text transition-colors">support@autox.com</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <div className="mt-20 pt-10 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-x-text-muted text-xs font-medium">
            &copy; {currentYear} AutoX Premium Car Rentals. All rights reserved. Crafted for excellence.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-x-text-muted hover:text-white text-xs no-underline font-bold uppercase tracking-widest transition-colors">Sitemap</a>
            <a href="#" className="text-x-text-muted hover:text-white text-xs no-underline font-bold uppercase tracking-widest transition-colors">Cookies</a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

