import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const EmailVerification: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/verify-email/${token}`);
        console.log('Verification response:', response.data);
        setMessage(response.data.message);
        setTimeout(() => navigate('/signin'), 3000);
      } catch (error) {
        console.error('Verification error:', error);
        setMessage('Email verification failed. Please try again or contact support.');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div>
      <h2>Email Verification</h2>
      <p>{message}</p>
    </div>
  );
};

export default EmailVerification;
