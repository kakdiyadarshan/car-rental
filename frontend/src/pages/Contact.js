import React, { useState } from 'react'
import { FaMapMarkerAlt, FaBuilding, FaPaperPlane } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useCreateContactMutation } from '../slices/contactApiSlice'
import Header from '../components/Header'
import Footer from './Footer'

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
        <div className="flex flex-col min-h-screen bg-x-bg text-x-text font-dm">
            {/* Hero Section */}
            <div className="pt-32 pb-20 px-4 text-center">
                <h1 className="font-bebas text-5xl md:text-7xl tracking-widest text-white uppercase mb-4 animate-fadeIn">Contact <span className="text-x-primary">Us</span></h1>
                <div className="w-20 h-1 bg-x-primary mx-auto mb-8 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-white/20 animate-[ticker_2s_linear_infinite]" />
                </div>
                <p className="text-x-text-muted max-w-2xl mx-auto text-lg leading-relaxed animate-fadeIn">
                    Reach out for bookings, partnerships, or support. Our team responds quickly and is happy to help.
                </p>
            </div>

            {/* Main Content */}
            <div className="max-w-[1240px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
                {/* Left Side - Info */}
                <div className="space-y-10 animate-slideUp">
                    <div className="space-y-4">
                        <span className="inline-block text-x-primary text-xs font-bold uppercase tracking-[3px]">We’re here to help</span>
                        <h2 className="font-bebas text-4xl md:text-5xl text-white tracking-wider">Get In <span className="text-x-primary">Touch</span></h2>
                        <p className="text-x-text-muted text-lg leading-relaxed">
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem 
                            accusantium doloremque laudantium, totam rem aperiam.
                        </p>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-start gap-5 group">
                            <div className="w-14 h-14 bg-x-surface border border-x-border rounded-xl flex items-center justify-center text-x-primary text-2xl shrink-0 group-hover:bg-x-primary group-hover:text-white transition-all shadow-lg">
                                <FaMapMarkerAlt />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-white font-bold text-lg">Toronto, Ontario</h4>
                                <p className="text-x-text-muted">123 Yonge Street, Toronto, ON M5E 1W7</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-5 group">
                            <div className="w-14 h-14 bg-x-surface border border-x-border rounded-xl flex items-center justify-center text-x-primary text-2xl shrink-0 group-hover:bg-x-primary group-hover:text-white transition-all shadow-lg">
                                <FaBuilding />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-white font-bold text-lg">Vancouver, British Columbia</h4>
                                <p className="text-x-text-muted">456 Granville Street, Vancouver, BC V6C 1T2</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="bg-x-surface border border-x-border rounded-3xl p-8 md:p-12 shadow-premium animate-slideUp [animation-delay:200ms]">
                    <h3 className="font-bebas text-3xl text-white tracking-widest mb-8">Your Detail</h3>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-x-text-muted">Name <span className="text-x-primary">*</span></label>
                                <input 
                                    type="text" 
                                    className="w-full bg-white/[0.03] border border-x-border rounded-xl p-4 text-white focus:border-x-primary focus:bg-white/[0.05] outline-none transition-all placeholder:text-white/10" 
                                    placeholder="Your Name" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-x-text-muted">Email Address <span className="text-x-primary">*</span></label>
                                <input 
                                    type="email" 
                                    className="w-full bg-white/[0.03] border border-x-border rounded-xl p-4 text-white focus:border-x-primary focus:bg-white/[0.05] outline-none transition-all placeholder:text-white/10" 
                                    placeholder="Your Email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required 
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-x-text-muted">Subject <span className="text-x-primary">*</span></label>
                            <input 
                                type="text" 
                                className="w-full bg-white/[0.03] border border-x-border rounded-xl p-4 text-white focus:border-x-primary focus:bg-white/[0.05] outline-none transition-all placeholder:text-white/10" 
                                placeholder="Message Subject" 
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-x-text-muted">Comments / Questions <span className="text-x-primary">*</span></label>
                            <textarea 
                                className="w-full bg-white/[0.03] border border-x-border rounded-xl p-4 text-white focus:border-x-primary focus:bg-white/[0.05] outline-none transition-all placeholder:text-white/10 min-h-[150px] resize-none" 
                                placeholder="Your Message" 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            ></textarea>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full h-16 flex items-center justify-center gap-3 bg-gradient-to-r from-x-primary to-x-accent text-white font-bold uppercase tracking-widest text-sm rounded-xl transition-all hover:shadow-[0_10px_30px_rgba(221,111,39,0.3)] hover:-translate-y-1 active:translate-y-0 disabled:opacity-50" 
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sending...' : 'Send Message'} <FaPaperPlane className={isLoading ? '' : 'animate-bounce'} />
                        </button>
                    </form>
                </div>
            </div>

            {/* Map Section */}
            <div className="w-full h-[500px] relative border-t border-x-border overflow-hidden">
                <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
                <iframe 
                    title="location-map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d43025600.21898632!2d-135.51039342427097!3d48.83772273637934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4b0d03d337cc6ad9%3A0x9968b72aa2438fa5!2sCanada!5e0!3m2!1sen!2sin!4v1774351937683!5m2!1sen!2sin" 
                    className="w-full h-full grayscale invert opacity-70 contrast-[1.2]" 
                    style={{border: 0}} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
            <Footer />
        </div>
    )
}

export default Contact;

