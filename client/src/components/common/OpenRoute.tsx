import Cookies from 'js-cookie';
import React, { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface MyComponentProps {
  children?: ReactNode;
}

const OpenRoute = ({ children }: MyComponentProps): JSX.Element => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      navigate('/home');
    }
  }, [navigate]);

  return <>{children}</>;
};

export default OpenRoute