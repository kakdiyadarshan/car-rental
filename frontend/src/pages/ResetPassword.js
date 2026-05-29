import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useResetPasswordMutation } from '../slices/usersApiSlice';
import { toast } from 'react-toastify';
import Footer from './Footer';
import '../style/d_style.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    try {
      await resetPassword({ token, password }).unwrap();
      toast.success('Password changed successfully!');
      navigate('/Register');
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Something went wrong!');
    }
  };

  return (
    <>
      <section className="d_faq_page_section d_registration_page_section" style={{ background: 'var(--x-bg)', minHeight: '100vh', color: 'var(--x-text)' }}>
        <Container>
          <div className="d_faq_header" style={{ marginBottom: '60px', textAlign: 'center' }}>
            <span className="d_fleet_eyebrow">Security</span>
            <h1 className="d_fleet_title">New <span>Password</span></h1>
            <p style={{ color: 'var(--x-text-muted)', marginTop: '10px' }}>Please enter your new password.</p>
          </div>
          
          <div className="d_cd_form_card" style={{ maxWidth: '500px', margin: '0 auto', borderRadius: '12px', borderTop: '1px solid var(--x-border)' }}>
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="d_cd_input_group">
                <label htmlFor="password">New Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="d_cd_input"
                    style={{ paddingLeft: '18px' }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                  <span 
                    className="password-toggle-icon" 
                    style={{ color: 'var(--x-text-muted)' }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              
              <div className="d_cd_input_group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    className="d_cd_input"
                    style={{ paddingLeft: '18px' }}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                  />
                  <span 
                    className="password-toggle-icon" 
                    style={{ color: 'var(--x-text-muted)' }}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="d_cd_btn_book"
                disabled={isLoading}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </div>
        </Container>
      </section>
      <Footer />
    </>
  );
};

export default ResetPassword;
