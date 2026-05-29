import React from 'react'
import Header from '../components/Header'
import RegisterComponent from '../components/Register'
import CTA from './CTA'
import Footer from './Footer'

export default function Register() {
  return (
    <>
      <RegisterComponent />
      <CTA />
      <Footer />
    </>
  )
}
