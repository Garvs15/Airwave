import Cookies from 'js-cookie';
import React, { ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getUser } from '../../redux/user/userAction';
import { AppDispatch } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface MyComponentProps {
  children?: ReactNode;
}

const ProtectedRoute: React.FC<MyComponentProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');

    const authenticateUser = async () => {
      if (token) {
        try {
          await dispatch(getUser(token)).unwrap();
        } catch (error: any) {
          toast.error(error.response.data.message)
          Cookies.remove('token');
          navigate('/auth');
        }
      } else {
        navigate('/auth');
      }
    };

    authenticateUser();
  }, [dispatch, navigate]);

  return <>{children}</>;
};

export default ProtectedRoute;
