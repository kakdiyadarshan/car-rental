import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { RiPercentLine, RiArrowRightLine, RiTimeLine } from 'react-icons/ri';

const OFFERS = [
  {
    id: 1,
    title: "Weekend Getaway",
    discount: "20% OFF",
    desc: "Make your weekend memorable with our exclusive premium fleet. Valid for 3-day rentals.",
    code: "WEEK20",
    color: "#dd6f27",
    image: "https://inflection-studio.lon1.cdn.digitaloceanspaces.com/eleven-motors/reviews-hero_moiyaf.jpg"
  },
  {
    id: 2,
    title: "First-Time Renter",
    discount: "15% OFF",
    desc: "New to AutoX? Enjoy a special welcome discount on any car from our exotic collection.",
    code: "WELCOME15",
    color: "#e8c97a",
    image: "https://www.edmunds.com/assets/m/cs/blt7949358af3a004a7/63e16ddbef38d05093a9a8e8/2023_Hyundai_Ioniq_5_Front_1600.jpg"
  }
];

const Offers = () => {
  return (
    <section className="py-24 bg-x-bg">
      <Container>
        <div className="mb-16 text-center animate-fadeIn">
          <span className="block uppercase text-[0.7rem] tracking-[5px] text-x-primary font-bold mb-4">Exclusive Deals</span>
          <h2 className="font-bebas text-5xl md:text-7xl text-white tracking-widest uppercase">Limited Time <span className="text-x-primary">Offers</span></h2>
          <div className="w-20 h-1 bg-x-primary mx-auto my-6 rounded-full overflow-hidden">
                <div className="w-full h-full bg-white/20 animate-[ticker_2s_linear_infinite]" />
            </div>
        </div>

        <Row className="g-5">
          {OFFERS.map((offer) => (
            <Col key={offer.id} md={6}>
              <div className="group bg-x-surface border border-x-border rounded-[40px] overflow-hidden transition-all duration-500 hover:border-x-primary/40 hover:shadow-premium animate-slideUp">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img src={offer.image} alt={offer.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-x-primary text-white text-sm font-extrabold rounded-xl shadow-xl">
                    <RiPercentLine />
                    <span>{offer.discount}</span>
                  </div>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                </div>

                <div className="p-8 md:p-10 space-y-6">
                  <div className="flex items-center gap-2 text-x-primary text-[0.65rem] font-bold uppercase tracking-widest bg-x-primary/10 w-fit px-3 py-1 rounded-lg">
                    <RiTimeLine className="animate-pulse" /> Limited Time Only
                  </div>
                  <h3 className="font-bebas text-3xl md:text-4xl text-white tracking-widest uppercase mb-0 leading-tight group-hover:text-x-primary transition-colors">{offer.title}</h3>
                  <p className="text-x-text-muted text-base leading-relaxed font-dm opacity-80 group-hover:opacity-100 transition-opacity">{offer.desc}</p>
                  
                  <div className="pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3 px-6 py-3 bg-white/[0.03] border border-dashed border-x-primary/30 rounded-2xl group/promo transition-all hover:bg-white/[0.05] hover:border-x-primary">
                      <span className="text-[0.6rem] font-bold uppercase tracking-widest text-x-text-muted">Code:</span>
                      <strong className="text-white tracking-[2px] font-mono group-hover:text-x-primary transition-colors">{offer.code}</strong>
                    </div>
                    <button className="w-full sm:w-auto h-14 px-8 flex items-center justify-center gap-3 bg-white text-x-primary font-extrabold uppercase tracking-widest text-[0.7rem] rounded-xl transition-all hover:bg-x-primary hover:text-white hover:shadow-lg active:scale-95">
                      Claim Now <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Offers;

