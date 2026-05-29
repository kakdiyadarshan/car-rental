import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { RiPercentLine, RiArrowRightLine, RiTimeLine } from 'react-icons/ri';
import '../style/d_style.css';

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
    <section className="d_offers_section d_section_padding">
      <Container>
        <div className="d_offers_header d_mb_responsive">
          <span className="d_offers_eyebrow">Exclusive Deals</span>
          <h2 className="d_offers_title d_responsive_title">Limited Time <span>Offers</span></h2>
        </div>

        <Row className="g-4">
          {OFFERS.map((offer) => (
            <Col key={offer.id} md={6}>
              <div className="d_offer_card" style={{ '--accent-color': offer.color }}>
                <div className="d_offer_img_box">
                  <img src={offer.image} alt={offer.title} className="d_offer_img" />
                  <div className="d_offer_badge">
                    <RiPercentLine />
                    <span>{offer.discount}</span>
                  </div>
                </div>

                <div className="d_offer_content">
                  <div className="d_offer_timer">
                    <RiTimeLine /> Limited Time Only
                  </div>
                  <h3 className="d_offer_name">{offer.title}</h3>
                  <p className="d_offer_desc">{offer.desc}</p>
                  
                  <div className="d_offer_footer">
                    <div className="d_promo_code">
                      <span>Code:</span>
                      <strong>{offer.code}</strong>
                    </div>
                    <button className="d_offer_btn">
                      Claim Now <RiArrowRightLine />
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
