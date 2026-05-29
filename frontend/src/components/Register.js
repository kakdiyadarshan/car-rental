import React, { useState, useEffect } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { Container } from 'react-bootstrap'
import Footer from '../pages/Footer'
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

  useEffect(() => {
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
      <div className="flex flex-col min-h-screen">
        <section className="flex-grow flex items-center justify-center bg-x-bg py-20 px-4 text-x-text">
          <Container>
            <div className="max-w-[500px] mx-auto bg-x-surface border border-x-border rounded-xl p-10 text-center shadow-premium relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-gradient-to-r before:from-transparent before:via-x-primary before:to-transparent">
              <div className="mb-8">
                <div className="w-20 h-20 bg-x-primary text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-5 animate-scaleIn">✓</div>
                <h2 className="text-x-text font-bebas text-4xl tracking-widest mb-2">Email Sent!</h2>
                <p className="text-x-text-muted text-lg">We've sent a password reset link to <strong>{formData.email}</strong>. Please check your email.</p>
              </div>
              
              <div className="flex flex-col gap-4">
                <button 
                  type="button" 
                  className="w-full min-h-[60px] flex items-center justify-center gap-2 bg-x-primary text-white font-bold uppercase tracking-wider text-sm rounded-lg transition-all hover:bg-x-accent hover:text-x-bg hover:shadow-[0_8px_25px_rgba(232,201,122,0.2)]"
                  onClick={() => switchForm('login')}
                >
                  Back to Login
                </button>
              </div>
            </div>
          </Container>
        </section>
        <Footer />
      </div>
    )
  }

  // Login Form
  if (formType === 'login') {
    return (
      <div className="flex flex-col min-h-screen">
        <section className="flex-grow py-20 px-4 bg-x-bg text-x-text">
          <Container>
            <div className="mb-16 text-center">
              <span className="block uppercase text-[0.75rem] tracking-[3px] text-x-primary font-bold mb-2.5">Welcome Back</span>
              <h1 className="font-bebas text-[3.5rem] text-x-text tracking-[2px] uppercase select-none">Sign <span className="text-transparent !stroke-x-primary [-webkit-text-stroke:1px_#dd6f27]">In</span></h1>
              <p className="text-x-text-muted mt-2.5 text-lg">Sign in to your account</p>
            </div>
            
            <div className="max-w-[500px] mx-auto bg-x-surface border border-x-border rounded-xl p-10 shadow-premium relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-gradient-to-r before:from-transparent before:via-x-primary before:to-transparent">
              <form className="flex flex-col gap-5" onSubmit={handleLoginSubmit}>
                <div className="flex flex-col gap-2.5 mb-6">
                  <label htmlFor="email" className="text-sm font-semibold text-x-text-muted uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="bg-white/[0.03] border border-x-border rounded-xl p-[15px] pl-[18px] text-x-text transition-all duration-300 focus:bg-white/[0.05] focus:border-x-primary focus:shadow-x-glow focus:-translate-y-[2px] outline-none"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div className="flex flex-col gap-2.5 mb-6">
                  <label htmlFor="password" className="text-sm font-semibold text-x-text-muted uppercase tracking-wider">Password</label>
                  <div className="relative w-full">
                    <input
                      type={showPasswords.login ? "text" : "password"}
                      id="password"
                      name="password"
                      className="w-full bg-white/[0.03] border border-x-border rounded-xl p-[15px] pl-[18px] text-x-text transition-all duration-300 focus:bg-white/[0.05] focus:border-x-primary focus:shadow-x-glow focus:-translate-y-[2px] outline-none"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                    <span 
                      className="absolute right-[15px] top-1/2 -translate-y-1/2 cursor-pointer text-x-text-muted hover:text-x-primary transition-colors pr-2"
                      onClick={() => togglePasswordVisibility('login')}
                    >
                      {showPasswords.login ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center my-2.5">
                  <label className="flex items-center cursor-pointer text-[0.9rem] text-x-text-muted select-none">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      className="hidden peer"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                    />
                    <span className="w-5 h-5 border-2 border-x-border rounded-[4px] mr-2 relative transition-all bg-x-surface2 peer-checked:bg-x-primary peer-checked:border-x-primary peer-checked:after:content-['\2713'] peer-checked:after:absolute peer-checked:after:text-white peer-checked:after:text-sm peer-checked:after:top-1/2 peer-checked:after:left-1/2 peer-checked:after:-translate-x-1/2 peer-checked:after:-translate-y-1/2"></span>
                    <p className='mb-0'>Remember me</p>
                  </label>
                  <button 
                    type="button" 
                    className="bg-none border-none text-x-primary font-semibold cursor-pointer p-0 m-0 text-sm hover:text-x-accent hover:underline"
                    onClick={() => switchForm('forgot')}
                  >
                    Forgot Password?
                  </button>
                </div>
                
                <button type="submit" className="w-full min-h-[60px] flex items-center justify-center gap-2 bg-x-primary text-white font-bold uppercase tracking-wider text-sm rounded-lg transition-all hover:bg-x-accent hover:text-x-bg hover:shadow-[0_8px_25px_rgba(232,201,122,0.2)]">Sign In</button>
              </form>
              
              <div className="text-center mt-8 pt-5 border-t border-x-border">
                <p className="text-x-text-muted">Don't have an account? <button type="button" className="bg-none border-none text-x-primary font-semibold cursor-pointer p-0 m-0 hover:text-x-accent hover:underline" onClick={() => switchForm('register')}>Sign Up</button></p>
              </div>
            </div>
          </Container>
        </section>
        <Footer />
      </div>
    )
  }

  // Forgot Password Form (Email Input)
  if (formType === 'forgot') {
    return (
      <div className="flex flex-col min-h-screen">
        <section className="flex-grow py-20 px-4 bg-x-bg text-x-text">
          <Container>
            <div className="mb-16 text-center">
              <span className="block uppercase text-[0.75rem] tracking-[3px] text-x-primary font-bold mb-2.5">Recovery</span>
              <h1 className="font-bebas text-[3.5rem] text-x-text tracking-[2px] uppercase select-none">Forgot <span className="text-transparent !stroke-x-primary [-webkit-text-stroke:1px_#dd6f27]">Password?</span></h1>
              <p className="text-x-text-muted mt-2.5 text-lg">Enter your email address and we'll send you a link to reset your password.</p>
            </div>
            
            <div className="max-w-[500px] mx-auto bg-x-surface border border-x-border rounded-xl p-10 shadow-premium relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-gradient-to-r before:from-transparent before:via-x-primary before:to-transparent">
              <form className="flex flex-col gap-5" onSubmit={handleForgotSubmit}>
                <div className="flex flex-col gap-2.5 mb-6">
                  <label htmlFor="email" className="text-sm font-semibold text-x-text-muted uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="bg-white/[0.03] border border-x-border rounded-xl p-[15px] pl-[18px] text-x-text transition-all duration-300 focus:bg-white/[0.05] focus:border-x-primary focus:shadow-x-glow focus:-translate-y-[2px] outline-none"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your registered email"
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="w-full min-h-[60px] flex items-center justify-center gap-2 bg-x-primary text-white font-bold uppercase tracking-wider text-sm rounded-lg transition-all hover:bg-x-accent hover:text-x-bg hover:shadow-[0_8px_25px_rgba(232,201,122,0.2)] disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isForgotLoading}
                >
                  {isForgotLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              
              <div className="text-center mt-8 pt-5 border-t border-x-border">
                <p className="text-x-text-muted">Remember your password? <button type="button" className="bg-none border-none text-x-primary font-semibold cursor-pointer p-0 m-0 hover:text-x-accent hover:underline" onClick={() => switchForm('login')}>Back to Login</button></p>
              </div>
            </div>
          </Container>
        </section>
        <Footer />
      </div>
    )
  }

  // Register Form (Default)
  return (
    <div className="flex flex-col min-h-screen">
      <section className="flex-grow py-20 px-4 bg-x-bg text-x-text">
        <Container>
          <div className="mb-16 text-center">
            <span className="block uppercase text-[0.75rem] tracking-[3px] text-x-primary font-bold mb-2.5">Join CarRental</span>
            <h1 className="font-bebas text-[3.5rem] text-x-text tracking-[2px] uppercase select-none">Create <span className="text-transparent !stroke-x-primary [-webkit-text-stroke:1px_#dd6f27]">Account</span></h1>
            <p className="text-x-text-muted mt-2.5 text-lg">Join CarRental to book your dream car</p>
          </div>

          <div className="max-w-[600px] mx-auto bg-x-surface border border-x-border rounded-xl p-10 shadow-premium relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-gradient-to-r before:from-transparent before:via-x-primary before:to-transparent">
            <form className="flex flex-col gap-5" onSubmit={handleRegisterSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2.5 mb-2">
                  <label htmlFor="firstName" className="text-sm font-semibold text-x-text-muted uppercase tracking-wider">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="bg-white/[0.03] border border-x-border rounded-xl p-[15px] pl-[18px] text-x-text transition-all duration-300 focus:bg-white/[0.05] focus:border-x-primary focus:shadow-x-glow focus:-translate-y-[2px] outline-none"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    required
                    minLength="2"
                    maxLength="50"
                  />
                </div>
                
                <div className="flex flex-col gap-2.5 mb-2">
                  <label htmlFor="lastName" className="text-sm font-semibold text-x-text-muted uppercase tracking-wider">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="bg-white/[0.03] border border-x-border rounded-xl p-[15px] pl-[18px] text-x-text transition-all duration-300 focus:bg-white/[0.05] focus:border-x-primary focus:shadow-x-glow focus:-translate-y-[2px] outline-none"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    required
                    minLength="2"
                    maxLength="50"
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2.5 mb-2">
                <label htmlFor="email" className="text-sm font-semibold text-x-text-muted uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="bg-white/[0.03] border border-x-border rounded-xl p-[15px] pl-[18px] text-x-text transition-all duration-300 focus:bg-white/[0.05] focus:border-x-primary focus:shadow-x-glow focus:-translate-y-[2px] outline-none"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="flex flex-col gap-2.5 mb-2">
                <label htmlFor="phone" className="text-sm font-semibold text-x-text-muted uppercase tracking-wider">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="bg-white/[0.03] border border-x-border rounded-xl p-[15px] pl-[18px] text-x-text transition-all duration-300 focus:bg-white/[0.05] focus:border-x-primary focus:shadow-x-glow focus:-translate-y-[2px] outline-none"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number (10 digits)"
                  required
                  maxLength="10"
                  pattern="\d{10}"
                />
              </div>
              
              <div className="flex flex-col gap-2.5 mb-2">
                <label htmlFor="drivingLicense" className="text-sm font-semibold text-x-text-muted uppercase tracking-wider">Driving License Number</label>
                <input
                  type="text"
                  id="drivingLicense"
                  name="drivingLicense"
                  className="bg-white/[0.03] border border-x-border rounded-xl p-[15px] pl-[18px] text-x-text transition-all duration-300 focus:bg-white/[0.05] focus:border-x-primary focus:shadow-x-glow focus:-translate-y-[2px] outline-none"
                  value={formData.drivingLicense}
                  onChange={handleChange}
                  placeholder="Enter your driving license number"
                  required
                  minLength="5"
                  maxLength="20"
                />
              </div>
              
              <div className="flex flex-col gap-2.5 mb-2">
                <label htmlFor="password" className="text-sm font-semibold text-x-text-muted uppercase tracking-wider">Password</label>
                <div className="relative w-full">
                  <input
                    type={showPasswords.register ? "text" : "password"}
                    id="password"
                    name="password"
                    className="w-full bg-white/[0.03] border border-x-border rounded-xl p-[15px] pl-[18px] text-x-text transition-all duration-300 focus:bg-white/[0.05] focus:border-x-primary focus:shadow-x-glow focus:-translate-y-[2px] outline-none"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password (min 6 characters)"
                    required
                    minLength="6"
                  />
                  <span 
                    className="absolute right-[15px] top-1/2 -translate-y-1/2 cursor-pointer text-x-text-muted hover:text-x-primary transition-colors pr-2"
                    onClick={() => togglePasswordVisibility('register')}
                  >
                    {showPasswords.register ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2.5 mb-2">
                <label htmlFor="confirmPassword" className="text-sm font-semibold text-x-text-muted uppercase tracking-wider">Confirm Password</label>
                <div className="relative w-full">
                  <input
                    type={showPasswords.confirmRegister ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    className="w-full bg-white/[0.03] border border-x-border rounded-xl p-[15px] pl-[18px] text-x-text transition-all duration-300 focus:bg-white/[0.05] focus:border-x-primary focus:shadow-x-glow focus:-translate-y-[2px] outline-none"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                  />
                  <span 
                    className="absolute right-[15px] top-1/2 -translate-y-1/2 cursor-pointer text-x-text-muted hover:text-x-primary transition-colors pr-2"
                    onClick={() => togglePasswordVisibility('confirmRegister')}
                  >
                    {showPasswords.confirmRegister ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center my-2.5">
                <label className="flex items-center cursor-pointer text-[0.9rem] text-x-text-muted select-none">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    className="hidden peer"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    required
                  />
                  <span className="w-5 h-5 border-2 border-x-border rounded-[4px] mr-2 relative transition-all bg-x-surface2 peer-checked:bg-x-primary peer-checked:border-x-primary peer-checked:after:content-['\2713'] peer-checked:after:absolute peer-checked:after:text-white peer-checked:after:text-sm peer-checked:after:top-1/2 peer-checked:after:left-1/2 peer-checked:after:-translate-x-1/2 peer-checked:after:-translate-y-1/2"></span>
                  <p className='mb-0'>I agree to the <a href="#" className="text-x-primary hover:text-x-accent hover:underline">Terms of Service</a> and <a href="#" className="text-x-primary hover:text-x-accent hover:underline">Privacy Policy</a></p>
                </label>
              </div>
              
              <button type="submit" className="w-full min-h-[60px] flex items-center justify-center gap-2 bg-x-primary text-white font-bold uppercase tracking-wider text-sm rounded-lg transition-all hover:bg-x-accent hover:text-x-bg hover:shadow-[0_8px_25px_rgba(232,201,122,0.2)]">Create Account</button>
            </form>
            
            <div className="text-center mt-8 pt-5 border-t border-x-border">
              <p className="text-x-text-muted">Already have an account? <button type="button" className="bg-none border-none text-x-primary font-semibold cursor-pointer p-0 m-0 hover:text-x-accent hover:underline" onClick={() => switchForm('login')}>Sign In</button></p>
            </div>
          </div>
        </Container>
      </section>
      <Footer />
    </div>
  )
}

export default Register

