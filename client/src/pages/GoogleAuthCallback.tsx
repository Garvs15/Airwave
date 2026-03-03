import Cookies from 'js-cookie';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleLoader from '../components/common/SimpleLoader';

const GoogleAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleAuth = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
          Cookies.set('token', token, {expires: 7});
          navigate('/home');
        } else {
          console.error('Token is missing or invalid');
          navigate('/auth');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    handleGoogleAuth();
  }, [navigate]);

  return <SimpleLoader />;
};

export default GoogleAuthCallback;
