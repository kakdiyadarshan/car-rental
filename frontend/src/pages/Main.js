import React from 'react'
import Header from '../components/Header'
import HeroSlider from './HeroSlider'
import BookingSearch from './BookingSearch'
import BrandSlider from './BrandSlider'
import HowItWorks from './HowItWorks'
import FeaturedCars from './FeaturedCars'
import WhyChooseUs from './WhyChooseUs'
import Gallery from './Gallery'
import Reviews from './Reviews'
import CTA from './CTA'
import Footer from './Footer'

export default function Main() {
  return (
    <>
      <HeroSlider></HeroSlider>
      {/* <BookingSearch></BookingSearch> */}
      <BrandSlider></BrandSlider>
      <FeaturedCars></FeaturedCars>
      <HowItWorks></HowItWorks>
      <WhyChooseUs></WhyChooseUs>
      <Gallery></Gallery>
      <Reviews></Reviews>
      <CTA></CTA>
      <Footer></Footer>
    </>
  )
}
