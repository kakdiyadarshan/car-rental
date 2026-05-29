import React, { useState, useEffect } from 'react'
import { FaEye, FaEyeSlash, FaUser, FaPhoneAlt, FaEnvelope, FaIdCard, FaLock } from 'react-icons/fa'
import { Container } from 'react-bootstrap'
import tharCarImage from '../Assets/car-image.png'
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

  const renderFormContent = () => {
    if (formType === 'register') {
      return (
        <form className="flex flex-col gap-6" onSubmit={handleRegisterSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5 group relative">
              <label htmlFor="firstName" className="text-xs font-semibold text-x-text-muted uppercase tracking-wider transition-colors duration-300 group-focus-within:text-x-primary">
                First Name
              </label>
              <div className="flex items-center gap-3 pb-2 border-b border-x-border transition-all duration-300 group-focus-within:border-x-primary">
                <FaUser className="text-x-text-muted transition-colors duration-300 group-focus-within:text-x-primary text-base flex-shrink-0" />
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="w-full bg-transparent text-x-text placeholder-x-text-muted/30 outline-none text-base transition-colors duration-300"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Saurav"
                  required
                  minLength="2"
                  maxLength="50"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 group relative">
              <label htmlFor="lastName" className="text-xs font-semibold text-x-text-muted uppercase tracking-wider transition-colors duration-300 group-focus-within:text-x-primary">
                Last Name
              </label>
              <div className="flex items-center gap-3 pb-2 border-b border-x-border transition-all duration-300 group-focus-within:border-x-primary">
                <FaUser className="text-x-text-muted transition-colors duration-300 group-focus-within:text-x-primary text-base flex-shrink-0" />
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="w-full bg-transparent text-x-text placeholder-x-text-muted/30 outline-none text-base transition-colors duration-300"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Hull"
                  required
                  minLength="2"
                  maxLength="50"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5 group relative">
              <label htmlFor="phone" className="text-xs font-semibold text-x-text-muted uppercase tracking-wider transition-colors duration-300 group-focus-within:text-x-primary">
                Phone Number
              </label>
              <div className="flex items-center gap-3 pb-2 border-b border-x-border transition-all duration-300 group-focus-within:border-x-primary">
                <FaPhoneAlt className="text-x-text-muted transition-colors duration-300 group-focus-within:text-x-primary text-base flex-shrink-0" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full bg-transparent text-x-text placeholder-x-text-muted/30 outline-none text-base transition-colors duration-300"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+919316195470"
                  required
                  maxLength="10"
                  pattern="\d{10}"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 group relative">
              <label htmlFor="email" className="text-xs font-semibold text-x-text-muted uppercase tracking-wider transition-colors duration-300 group-focus-within:text-x-primary">
                E-mail Address
              </label>
              <div className="flex items-center gap-3 pb-2 border-b border-x-border transition-all duration-300 group-focus-within:border-x-primary">
                <FaEnvelope className="text-x-text-muted transition-colors duration-300 group-focus-within:text-x-primary text-base flex-shrink-0" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full bg-transparent text-x-text placeholder-x-text-muted/30 outline-none text-base transition-colors duration-300"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="suviart1234@gmail.com"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 group relative">
            <label htmlFor="drivingLicense" className="text-xs font-semibold text-x-text-muted uppercase tracking-wider transition-colors duration-300 group-focus-within:text-x-primary">
              Driving License Number
            </label>
            <div className="flex items-center gap-3 pb-2 border-b border-x-border transition-all duration-300 group-focus-within:border-x-primary">
              <FaIdCard className="text-x-text-muted transition-colors duration-300 group-focus-within:text-x-primary text-base flex-shrink-0" />
              <input
                type="text"
                id="drivingLicense"
                name="drivingLicense"
                className="w-full bg-transparent text-x-text placeholder-x-text-muted/30 outline-none text-base transition-colors duration-300"
                value={formData.drivingLicense}
                onChange={handleChange}
                placeholder="Enter driving license"
                required
                minLength="5"
                maxLength="20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5 group relative">
              <label htmlFor="password" className="text-xs font-semibold text-x-text-muted uppercase tracking-wider transition-colors duration-300 group-focus-within:text-x-primary">
                Create Password
              </label>
              <div className="flex items-center gap-3 pb-2 border-b border-x-border transition-all duration-300 group-focus-within:border-x-primary">
                <FaLock className="text-x-text-muted transition-colors duration-300 group-focus-within:text-x-primary text-base flex-shrink-0" />
                <input
                  type={showPasswords.register ? "text" : "password"}
                  id="password"
                  name="password"
                  className="w-full bg-transparent text-x-text placeholder-x-text-muted/30 outline-none text-base transition-colors duration-300"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  className="text-x-text-muted hover:text-x-primary transition-colors flex-shrink-0 outline-none"
                  onClick={() => togglePasswordVisibility('register')}
                >
                  {showPasswords.register ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 group relative">
              <label htmlFor="confirmPassword" className="text-xs font-semibold text-x-text-muted uppercase tracking-wider transition-colors duration-300 group-focus-within:text-x-primary">
                Confirm Password
              </label>
              <div className="flex items-center gap-3 pb-2 border-b border-x-border transition-all duration-300 group-focus-within:border-x-primary">
                <FaLock className="text-x-text-muted transition-colors duration-300 group-focus-within:text-x-primary text-base flex-shrink-0" />
                <input
                  type={showPasswords.confirmRegister ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  className="w-full bg-transparent text-x-text placeholder-x-text-muted/30 outline-none text-base transition-colors duration-300"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="text-x-text-muted hover:text-x-primary transition-colors flex-shrink-0 outline-none"
                  onClick={() => togglePasswordVisibility('confirmRegister')}
                >
                  {showPasswords.confirmRegister ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center my-1">
            <label className="flex items-center gap-3 cursor-pointer text-sm text-x-text-muted select-none">
              <input
                type="checkbox"
                name="agreeToTerms"
                className="hidden peer"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                required
              />
              <span className="w-5 h-5 border border-x-border rounded-md flex items-center justify-center transition-all bg-x-surface2 peer-checked:bg-x-primary peer-checked:border-x-primary">
                <span className="text-white text-xs scale-0 peer-checked:scale-100 transition-transform duration-200">✓</span>
              </span>
              <span className="leading-tight">
                I agree to the <a href="#" className="text-x-primary hover:text-x-accent hover:underline transition-all">Terms of Service</a> and <a href="#" className="text-x-primary hover:text-x-accent hover:underline transition-all">Privacy Policy</a>
              </span>
            </label>
          </div>

          <div className="flex justify-center mt-2">
            <button
              type="submit"
              className="w-full sm:w-auto min-w-[200px] h-[52px] bg-x-primary text-white font-bold uppercase tracking-wider text-sm rounded-full transition-all duration-300 hover:bg-x-accent hover:text-x-bg hover:shadow-[0_8px_25px_rgba(221,111,39,0.35)] hover:-translate-y-[2px] active:translate-y-0 flex items-center justify-center gap-2"
              disabled={isRegisterLoading}
            >
              {isRegisterLoading ? 'Creating...' : 'Sign up'}
            </button>
          </div>

          <div className="text-center mt-2 pt-4 border-t border-x-border">
            <p className="text-x-text-muted text-sm">
              Already have an account?
              <button
                type="button"
                className="text-x-primary font-semibold cursor-pointer hover:text-x-accent hover:underline ml-1.5 transition-colors"
                onClick={() => switchForm('login')}
              >
                Log in
              </button>
            </p>
          </div>
        </form>
      );
    }

    if (formType === 'login') {
      return (
        <form className="flex flex-col gap-6" onSubmit={handleLoginSubmit}>
          <div className="flex flex-col gap-1.5 group relative">
            <label htmlFor="email" className="text-xs font-semibold text-x-text-muted uppercase tracking-wider transition-colors duration-300 group-focus-within:text-x-primary">
              Email Address
            </label>
            <div className="flex items-center gap-3 pb-2 border-b border-x-border transition-all duration-300 group-focus-within:border-x-primary">
              <FaEnvelope className="text-x-text-muted transition-colors duration-300 group-focus-within:text-x-primary text-base flex-shrink-0" />
              <input
                type="email"
                id="email"
                name="email"
                className="w-full bg-transparent text-x-text placeholder-x-text-muted/30 outline-none text-base transition-colors duration-300"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 group relative">
            <label htmlFor="password" className="text-xs font-semibold text-x-text-muted uppercase tracking-wider transition-colors duration-300 group-focus-within:text-x-primary">
              Password
            </label>
            <div className="flex items-center gap-3 pb-2 border-b border-x-border transition-all duration-300 group-focus-within:border-x-primary">
              <FaLock className="text-x-text-muted transition-colors duration-300 group-focus-within:text-x-primary text-base flex-shrink-0" />
              <input
                type={showPasswords.login ? "text" : "password"}
                id="password"
                name="password"
                className="w-full bg-transparent text-x-text placeholder-x-text-muted/30 outline-none text-base transition-colors duration-300"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="text-x-text-muted hover:text-x-primary transition-colors flex-shrink-0 outline-none"
                onClick={() => togglePasswordVisibility('login')}
              >
                {showPasswords.login ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center my-1 text-sm">
            <label className="flex items-center gap-3 cursor-pointer text-x-text-muted select-none">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                className="hidden peer"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <span className="w-5 h-5 border border-x-border rounded-md flex items-center justify-center transition-all bg-x-surface2 peer-checked:bg-x-primary peer-checked:border-x-primary">
                <span className="text-white text-xs scale-0 peer-checked:scale-100 transition-transform duration-200">✓</span>
              </span>
              <span className="leading-tight">Remember me</span>
            </label>

            <button
              type="button"
              className="text-x-primary font-semibold hover:text-x-accent hover:underline transition-colors outline-none"
              onClick={() => switchForm('forgot')}
            >
              Forgot Password?
            </button>
          </div>

          <div className="flex justify-center mt-2">
            <button
              type="submit"
              className="w-full sm:w-auto min-w-[200px] h-[52px] bg-x-primary text-white font-bold uppercase tracking-wider text-sm rounded-full transition-all duration-300 hover:bg-x-accent hover:text-x-bg hover:shadow-[0_8px_25px_rgba(221,111,39,0.35)] hover:-translate-y-[2px] active:translate-y-0 flex items-center justify-center gap-2"
              disabled={isLoginLoading}
            >
              {isLoginLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>

          <div className="text-center mt-2 pt-4 border-t border-x-border">
            <p className="text-x-text-muted text-sm">
              Don't have an account?
              <button
                type="button"
                className="text-x-primary font-semibold cursor-pointer hover:text-x-accent hover:underline ml-1.5 transition-colors"
                onClick={() => switchForm('register')}
              >
                Sign Up
              </button>
            </p>
          </div>
        </form>
      );
    }

    if (formType === 'forgot') {
      if (otpSent) {
        return (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-x-primary/20 border border-x-primary text-x-primary rounded-full flex items-center justify-center text-3xl mx-auto mb-6 animate-scaleIn">
              ✓
            </div>
            <h2 className="text-x-text font-bebas text-3xl tracking-wider mb-3">Email Sent!</h2>
            <p className="text-x-text-muted text-base mb-8">
              We've sent a password reset link to <strong className="text-x-text">{formData.email}</strong>. Please check your inbox.
            </p>

            <div className="flex justify-center">
              <button
                type="button"
                className="w-full sm:w-auto min-w-[200px] h-[52px] bg-x-primary text-white font-bold uppercase tracking-wider text-sm rounded-full transition-all duration-300 hover:bg-x-accent hover:text-x-bg hover:shadow-[0_8px_25px_rgba(221,111,39,0.35)]"
                onClick={() => switchForm('login')}
              >
                Back to Login
              </button>
            </div>
          </div>
        );
      }

      return (
        <form className="flex flex-col gap-6" onSubmit={handleForgotSubmit}>
          <div className="flex flex-col gap-1.5 group relative">
            <label htmlFor="email" className="text-xs font-semibold text-x-text-muted uppercase tracking-wider transition-colors duration-300 group-focus-within:text-x-primary">
              Email Address
            </label>
            <div className="flex items-center gap-3 pb-2 border-b border-x-border transition-all duration-300 group-focus-within:border-x-primary">
              <FaEnvelope className="text-x-text-muted transition-colors duration-300 group-focus-within:text-x-primary text-base flex-shrink-0" />
              <input
                type="email"
                id="email"
                name="email"
                className="w-full bg-transparent text-x-text placeholder-x-text-muted/30 outline-none text-base transition-colors duration-300"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your registered email"
                required
              />
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="w-full sm:w-auto min-w-[200px] h-[52px] bg-x-primary text-white font-bold uppercase tracking-wider text-sm rounded-full transition-all duration-300 hover:bg-x-accent hover:text-x-bg hover:shadow-[0_8px_25px_rgba(221,111,39,0.35)] hover:-translate-y-[2px] disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={isForgotLoading}
            >
              {isForgotLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>

          <div className="text-center mt-4 pt-4 border-t border-x-border">
            <p className="text-x-text-muted text-sm">
              Remember your password?
              <button
                type="button"
                className="text-x-primary font-semibold cursor-pointer hover:text-x-accent hover:underline ml-1.5 transition-colors"
                onClick={() => switchForm('login')}
              >
                Back to Login
              </button>
            </p>
          </div>
        </form>
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-x-bg overflow-x-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-gradient-to-br from-x-primary/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] rounded-full bg-gradient-to-tl from-x-primary/10 to-transparent blur-[150px] pointer-events-none" />

      <section className="flex-grow flex items-center justify-center py-16 md:py-24 px-4 z-10 relative overflow-hidden">
        <div className="absolute left-[-180px] top-[-120px] w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] md:w-[700px] md:h-[700px] rounded-full bg-x-primary/55 pointer-events-none" />
        <div className="absolute right-[-60px] top-[-70px] w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] md:w-[180px] md:h-[180px] rounded-full bg-x-primary/55 pointer-events-none" />
        <div className="absolute left-[-70px] bottom-[-70px] w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] md:w-[180px] md:h-[180px] rounded-full bg-x-primary/55 pointer-events-none" />
        <div className="absolute right-[-70px] bottom-[-70px] w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] md:w-[180px] md:h-[180px] rounded-full bg-x-primary/55 pointer-events-none" />
        <div className="absolute top-[70px] left-[38%] w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full bg-x-primary/70 pointer-events-none" />
        <div className="absolute top-[38%] left-[44%] w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-x-primary/70 pointer-events-none" />
        <div className="absolute top-[34%] right-[40px] w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-x-primary/70 pointer-events-none" />
        <div className="absolute bottom-[110px] left-[24%] w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-x-primary/70 pointer-events-none" />
        <div className="absolute bottom-[80px] left-[60%] w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-x-primary/70 pointer-events-none" />
        <div className="absolute bottom-[140px] right-[20px] w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-x-primary/70 pointer-events-none" />

        <Container>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 xl:gap-24 max-w-[1200px] mx-auto w-full mt-10">

            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative min-h-[300px] md:h-[600px] hidden lg:block">
              <div className="absolute w-[260px] h-[260px] md:w-[400px] md:h-[400px] bg-gradient-to-tr from-x-primary/30 to-x-accent/5 rounded-full blur-[70px] -z-10 animate-pulse duration-[8000ms]" />

              <img
                src={tharCarImage}
                alt="Thar Jeep"
                className="relative z-10 w-full w-[800px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)]"
              />
            </div>

            <div className="w-full lg:w-1/2 max-w-[580px] z-10">
              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,#0f172a_0%,#111827_40%,#0b1120_100%)] backdrop-blur-2xl p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.65)] transition-all duration-500 hover:shadow-[0_25px_80px_rgba(129,68,28,0.45)] hover:border-[#81441c]/40">

                {/* Glow Effect */}
                <div className="absolute -top-20 -right-20 w-52 h-52 bg-[#81441c]/25 blur-3xl rounded-full" />

                <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-orange-500/10 blur-3xl rounded-full" />

                {/* Top Gradient Line */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#d97706] to-transparent" />

                {/* Small Glass Overlay */}
                <div className="absolute inset-0 bg-white/[0.02] pointer-events-none" />

                {/* Content */}
                <div className="relative z-10">

                  <div className="mb-8">
                    <h2 className="text-4xl md:text-5xl font-bebas tracking-[3px] text-white uppercase leading-none">
                      {formType === 'register'
                        ? 'Welcome'
                        : formType === 'login'
                          ? 'Welcome Back'
                          : 'Recovery'}
                    </h2>

                    <p className="text-gray-400 text-sm md:text-base font-medium mt-2">
                      {formType === 'register'
                        ? "Let's get you started !"
                        : formType === 'login'
                          ? 'Sign in to your account'
                          : 'Reset your password'}
                    </p>
                  </div>

                  {renderFormContent()}
                </div>
              </div>
            </div>

          </div>
        </Container>
      </section>
      <Footer />
    </div>
  )
}

export default Register

