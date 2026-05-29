import React, { useState, useEffect } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { Container } from 'react-bootstrap'
import Footer from '../pages/Footer'
import '../style/d_style.css'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginMutation, useRegisterMutation, useForgotPasswordMutation, useResetPasswordMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

const Register = ({ isModal, closeModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [forgotPassword, { isLoading: isForgotLoading }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetLoading }] = useResetPasswordMutation();

  const [formType, setFormType] = useState('register') // 'login', 'register', 'forgot'

  const [showPasswords, setShowPasswords] = useState({
    login: false,
    register: false,
    confirmRegister: false,
    new: false,
    confirmNew: false
  })
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    drivingLicense: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    rememberMe: false,
    otp: '',
    newPassword: '',
    confirmNewPassword: ''
  })
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    // Character only validation for names
    if (name === 'firstName' || name === 'lastName') {
      if (value !== '' && !/^[A-Za-z]+$/.test(value)) {
        return;
      }
    }

    // Number only validation for phone
    if (name === 'phone') {
      if (value !== '' && !/^\d+$/.test(value)) {
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()

    // Validation checks
    if (formData.firstName.length < 2) {
      toast.error('First Name must be at least 2 characters!')
      return
    }
    if (formData.lastName.length < 2) {
      toast.error('Last Name must be at least 2 characters!')
      return
    }
    if (formData.phone.length !== 10) {
      toast.error('Phone Number must be exactly 10 digits!')
      return
    }
    if (formData.drivingLicense.length < 5) {
      toast.error('Driving License must be at least 5 characters!')
      return
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters!')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!')
      return
    }

    try {
      const res = await register({
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        phoneNo: formData.phone,
        licenceNo: formData.drivingLicense,
        password: formData.password
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Account Created!");
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Registration failed!");
    }
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await login({
        email: formData.email,
        password: formData.password
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }

  React.useEffect(() => {
    const rememberedUser = localStorage.getItem('rememberedUser')
    if (rememberedUser) {
      setFormData((prev) => ({ ...prev, email: rememberedUser, rememberMe: true }))
    }
  }, [])

  const handleForgotSubmit = async (e) => {
    e.preventDefault()
    try {
      await forgotPassword({ email: formData.email }).unwrap();
      toast.success("Password reset link sent to your email!");
      setOtpSent(true) // Using this state to show success message
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }

  const handleVerifyOtpSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate OTP verification (e.g., check if OTP is '123456')
    setTimeout(() => {
      if (formData.otp === '123456') {
        console.log('OTP verified successfully')
        setOtpVerified(true)
      } else {
        toast.error('Invalid OTP! Please try again.');
      }
      setIsLoading(false)
    }, 1500)
  }

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault()
    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error('Passwords do not match!')
      return
    }
    try {
      await resetPassword({ token: formData.otp, password: formData.newPassword }).unwrap();
      toast.success("Password reset successfully!");
      setIsSubmitted(true)
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }

  const handleReset = () => {
    setOtpSent(false)
    setFormData({ ...formData, email: '' })
  }

  const switchForm = (type) => {
    setFormType(type)
    setIsSubmitted(false)
    setOtpSent(false)
    setOtpVerified(false)
    // Reset form data when switching
    if (type === 'login') {
      setFormData({ email: '', password: '', rememberMe: false })
    } else if (type === 'register') {
      setFormData({
        firstName: '', lastName: '', email: '', phone: '', drivingLicense: '', 
        password: '', confirmPassword: '', agreeToTerms: false
      })
    } else if (type === 'forgot') {
      setFormData({ email: '', otp: '', newPassword: '', confirmNewPassword: '' })
    }
  }

  // Forgot Password: Success View (Link Sent)
  if (formType === 'forgot' && otpSent) {
    return (
      <>
        <section className="d_faq_page_section d_registration_page_section" style={{ background: 'var(--x-bg)', minHeight: '100vh', color: 'var(--x-text)' }}>
          <Container>
            <div className="d_cd_form_card" style={{ maxWidth: '500px', margin: '0 auto', borderRadius: '12px', borderTop: '1px solid var(--x-border)', textAlign: 'center' }}>
              <div className="auth-header" style={{ marginBottom: '30px' }}>
                <div className="success-icon" style={{ 
                  width: '80px', 
                  height: '80px', 
                  background: 'var(--x-primary)', 
                  color: '#fff', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '2rem', 
                  margin: '0 auto 20px' 
                }}>✓</div>
                <h2 style={{ color: 'var(--x-text)', fontFamily: 'Bebas Neue', letterSpacing: '2px' }}>Email Sent!</h2>
                <p style={{ color: 'var(--x-text-muted)' }}>We've sent a password reset link to <strong>{formData.email}</strong>. Please check your email.</p>
              </div>
              
              <div className="auth-actions">
                <button 
                  type="button" 
                  className="d_cd_btn_book"
                  onClick={() => switchForm('login')}
                >
                  Back to Login
                </button>
              </div>
            </div>
          </Container>
        </section>
        <Footer />
      </>
    )
  }

  // Login Form
  if (formType === 'login') {
    return (
      <>
        <section className="d_faq_page_section d_registration_page_section" style={{ background: 'var(--x-bg)', minHeight: '100vh', color: 'var(--x-text)' }}>
          <Container>
            <div className="d_faq_header" style={{ marginBottom: '60px', textAlign: 'center' }}>
              <span className="d_fleet_eyebrow">Welcome Back</span>
              <h1 className="d_fleet_title">Sign <span>In</span></h1>
              <p style={{ color: 'var(--x-text-muted)', marginTop: '10px' }}>Sign in to your account</p>
            </div>
            
            <div className="d_cd_form_card" style={{ maxWidth: '500px', margin: '0 auto', borderRadius: '12px', borderTop: '1px solid var(--x-border)' }}>
              <form className="auth-form" onSubmit={handleLoginSubmit}>
                <div className="d_cd_input_group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="d_cd_input"
                    style={{ paddingLeft: '18px' }}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div className="d_cd_input_group">
                  <label htmlFor="password">Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPasswords.login ? "text" : "password"}
                      id="password"
                      name="password"
                      className="d_cd_input"
                      style={{ paddingLeft: '18px' }}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                    <span 
                      className="password-toggle-icon" 
                      style={{ color: 'var(--x-text-muted)' }}
                      onClick={() => togglePasswordVisibility('login')}
                    >
                      {showPasswords.login ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
                
                <div className="form-options">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                    />
                    <span className="checkmark"></span>
                    <p className='mb-0' style={{ color: 'var(--x-text-muted)' }}>Remember me</p>
                  </label>
                  <button 
                    type="button" 
                    className="link-btn"
                    style={{ color: 'var(--x-primary)' }}
                    onClick={() => switchForm('forgot')}
                  >
                    Forgot Password?
                  </button>
                </div>
                
                <button type="submit" className="d_cd_btn_book">Sign In</button>
              </form>
              
              <div className="auth-footer" style={{ borderTopColor: 'var(--x-border)' }}>
                <p style={{ color: 'var(--x-text-muted)' }}>Don't have an account? <button type="button" className="link-btn" style={{ color: 'var(--x-primary)' }} onClick={() => switchForm('register')}>Sign Up</button></p>
              </div>
            </div>
          </Container>
        </section>
        <Footer />
      </>
    )
  }

  // Forgot Password Form (Email Input)
  if (formType === 'forgot') {
    return (
      <>
        <section className="d_faq_page_section d_registration_page_section" style={{ background: 'var(--x-bg)', minHeight: '100vh', color: 'var(--x-text)' }}>
          <Container>
            <div className="d_faq_header" style={{ marginBottom: '60px', textAlign: 'center' }}>
              <span className="d_fleet_eyebrow">Recovery</span>
              <h1 className="d_fleet_title">Forgot <span>Password?</span></h1>
              <p style={{ color: 'var(--x-text-muted)', marginTop: '10px' }}>Enter your email address and we'll send you a link to reset your password.</p>
            </div>
            
            <div className="d_cd_form_card" style={{ maxWidth: '500px', margin: '0 auto', borderRadius: '12px', borderTop: '1px solid var(--x-border)' }}>
              <form className="auth-form" onSubmit={handleForgotSubmit}>
                <div className="d_cd_input_group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="d_cd_input"
                    style={{ paddingLeft: '18px' }}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your registered email"
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="d_cd_btn_book"
                  disabled={isForgotLoading}
                >
                  {isForgotLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              
              <div className="auth-footer" style={{ borderTopColor: 'var(--x-border)' }}>
                <p style={{ color: 'var(--x-text-muted)' }}>Remember your password? <button type="button" className="link-btn" style={{ color: 'var(--x-primary)' }} onClick={() => switchForm('login')}>Back to Login</button></p>
              </div>
            </div>
          </Container>
        </section>
        <Footer />
      </>
    )
  }

  // Register Form (Default)
  return (
    <>
      <section className="d_faq_page_section d_registration_page_section" style={{ background: 'var(--x-bg)', minHeight: '100vh', color: 'var(--x-text)' }}>
        <Container>
          <div className="d_faq_header" style={{ marginBottom: '60px', textAlign: 'center' }}>
            <span className="d_fleet_eyebrow">Join CarRental</span>
            <h1 className="d_fleet_title">Create <span>Account</span></h1>
            <p style={{ color: 'var(--x-text-muted)', marginTop: '10px' }}>Join CarRental to book your dream car</p>
          </div>

          <div className="d_cd_form_card" style={{ maxWidth: '600px', margin: '0 auto', borderRadius: '12px', borderTop: '1px solid var(--x-border)' }}>
            <form className="auth-form" onSubmit={handleRegisterSubmit}>
              <div className="form-row">
                <div className="d_cd_input_group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="d_cd_input"
                    style={{ paddingLeft: '18px' }}
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    required
                    minLength="2"
                    maxLength="50"
                  />
                </div>
                
                <div className="d_cd_input_group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="d_cd_input"
                    style={{ paddingLeft: '18px' }}
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    required
                    minLength="2"
                    maxLength="50"
                  />
                </div>
              </div>
              
              <div className="d_cd_input_group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="d_cd_input"
                  style={{ paddingLeft: '18px' }}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="d_cd_input_group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="d_cd_input"
                  style={{ paddingLeft: '18px' }}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number (10 digits)"
                  required
                  maxLength="10"
                  pattern="\d{10}"
                />
              </div>
              
              <div className="d_cd_input_group">
                <label htmlFor="drivingLicense">Driving License Number</label>
                <input
                  type="text"
                  id="drivingLicense"
                  name="drivingLicense"
                  className="d_cd_input"
                  style={{ paddingLeft: '18px' }}
                  value={formData.drivingLicense}
                  onChange={handleChange}
                  placeholder="Enter your driving license number"
                  required
                  minLength="5"
                  maxLength="20"
                />
              </div>
              
              <div className="d_cd_input_group">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPasswords.register ? "text" : "password"}
                    id="password"
                    name="password"
                    className="d_cd_input"
                    style={{ paddingLeft: '18px' }}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password (min 6 characters)"
                    required
                    minLength="6"
                  />
                  <span 
                    className="password-toggle-icon" 
                    style={{ color: 'var(--x-text-muted)' }}
                    onClick={() => togglePasswordVisibility('register')}
                  >
                    {showPasswords.register ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              
              <div className="d_cd_input_group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPasswords.confirmRegister ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    className="d_cd_input"
                    style={{ paddingLeft: '18px' }}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                  />
                  <span 
                    className="password-toggle-icon" 
                    style={{ color: 'var(--x-text-muted)' }}
                    onClick={() => togglePasswordVisibility('confirmRegister')}
                  >
                    {showPasswords.confirmRegister ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              
              <div className="form-options">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    required
                  />
                  <span className="checkmark"></span>
                  <p className='mb-0' style={{ color: 'var(--x-text-muted)' }}>I agree to the <a href="#" style={{ color: 'var(--x-primary)' }}>Terms of Service</a> and <a href="#" style={{ color: 'var(--x-primary)' }}>Privacy Policy</a></p>
                </label>
              </div>
              
              <button type="submit" className="d_cd_btn_book">Create Account</button>
            </form>
            
            <div className="auth-footer" style={{ borderTopColor: 'var(--x-border)' }}>
              <p style={{ color: 'var(--x-text-muted)' }}>Already have an account? <button type="button" className="link-btn" style={{ color: 'var(--x-primary)' }} onClick={() => switchForm('login')}>Sign In</button></p>
            </div>
          </div>
        </Container>
      </section>
      <Footer />
    </>
  )
}

export default Register