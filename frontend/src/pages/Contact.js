import React, { useState } from 'react'
import { FaMapMarkerAlt, FaBuilding, FaPaperPlane } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useCreateContactMutation } from '../slices/contactApiSlice'
import Header from '../components/Header'
import Footer from './Footer'
import '../z_styles.css'
import '../style/d_style.css'

const Contact = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')

    const [createContact, { isLoading }] = useCreateContactMutation()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await createContact({ name, email, subject, message }).unwrap()
            toast.success('Message sent successfully!')
            setName('')
            setEmail('')
            setSubject('')
            setMessage('')
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    }

    return (
        <>
            <div className="z_cntct_wrapper" style={{ background: 'var(--x-bg)', color: 'var(--x-text)', fontFamily: '"DM Sans", sans-serif' }}>
            {/* Hero Section */}
            <div className="z_cntct_hero">
                <h1 style={{ fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '3px', textTransform: 'uppercase' }}>Contact Us</h1>
                <div style={{ width: '80px', height: '3px', background: 'var(--x-primary)', margin: '16px auto' }}></div>
                <p style={{ color: 'var(--x-text-muted)', maxWidth: '650px', margin: '0 auto', lineHeight: 1.8 }}>
                    Reach out for bookings, partnerships, or support. Our team responds quickly and is happy to help.
                </p>
            </div>

            {/* Main Content */}
            <div className="z_cntct_container">
                {/* Left Side - Info */}
                <div className="z_cntct_left">
                    <span style={{ display: 'inline-block', color: 'var(--x-primary)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '8px' }}>We’re here to help</span>
                    <h2 style={{ fontFamily: '"Bebas Neue", sans-serif' }}>Get In Touch</h2>
                    <p style={{ color: 'var(--x-text-muted)' }}>
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem 
                        accusantium doloremque laudantium, totam rem aperiam.
                    </p>

                    <div className="z_cntct_info_list">
                        <div className="z_cntct_info_item">
                            <div className="z_cntct_icon_box">
                                <FaMapMarkerAlt />
                            </div>
                            <div className="z_cntct_info_text">
                                <h4>Toronto, Ontario</h4>
                                <p>123 Yonge Street, Toronto, ON M5E 1W7</p>
                            </div>
                        </div>

                        <div className="z_cntct_info_item">
                            <div className="z_cntct_icon_box">
                                <FaBuilding />
                            </div>
                            <div className="z_cntct_info_text">
                                <h4>Vancouver, British Columbia</h4>
                                <p>456 Granville Street, Vancouver, BC V6C 1T2</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="z_cntct_right" style={{ background: 'var(--x-surface)', border: '1px solid var(--x-border)' }}>
                    <h3 style={{ fontFamily: '"Bebas Neue", sans-serif' }}>Your Detail</h3>
                    <form className="z_cntct_form" onSubmit={handleSubmit}>
                        <div className="z_cntct_form_row">
                            <div className="z_cntct_input_group">
                                <label style={{ color: 'var(--x-text-muted)' }}>Name <span>*</span></label>
                                <input 
                                    type="text" 
                                    className="z_cntct_input" 
                                    placeholder="Your Name" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required 
                                />
                            </div>
                            <div className="z_cntct_input_group">
                                <label style={{ color: 'var(--x-text-muted)' }}>Email Address <span>*</span></label>
                                <input 
                                    type="email" 
                                    className="z_cntct_input" 
                                    placeholder="Your Email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required 
                                />
                            </div>
                        </div>

                        <div className="z_cntct_input_group">
                            <label style={{ color: 'var(--x-text-muted)' }}>Subject <span>*</span></label>
                            <input 
                                type="text" 
                                className="z_cntct_input" 
                                placeholder="Message Subject" 
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required 
                            />
                        </div>

                        <div className="z_cntct_input_group">
                            <label style={{ color: 'var(--x-text-muted)' }}>Comments / Questions <span>*</span></label>
                            <textarea 
                                className="z_cntct_input z_cntct_textarea" 
                                placeholder="Your Message" 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className="z_cntct_btn" style={{ background: 'linear-gradient(135deg, var(--x-primary) 0%, #b8551d 100%)', border: 'none' }} disabled={isLoading}>
                            {isLoading ? 'Sending...' : 'Send Message'} <FaPaperPlane style={{marginLeft: '8px'}} />
                        </button>
                    </form>
                </div>
            </div>

            {/* Map Section */}
            <div className="z_cntct_map_container">
                <iframe 
                    title="location-map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d43025600.21898632!2d-135.51039342427097!3d48.83772273637934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4b0d03d337cc6ad9%3A0x9968b72aa2438fa5!2sCanada!5e0!3m2!1sen!2sin!4v1774351937683!5m2!1sen!2sin" 
                    width="100%" 
                    height="100%" 
                    style={{border: 0}} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
            </div>
            <Footer />
        </>
    )
}

export default Contact;
