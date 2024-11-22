import Cookies from 'js-cookie';
import { apiClientCms } from './axiosConfig';

export const login = async (email, password) => {
  try {
    const response = await apiClientCms.post('/auth/login', {
      email,
      password,
    });

    const { token } = response.data;

    
    Cookies.set('jwt', token, {
      expires: 7, 
      secure: process.env.NODE_ENV === 'production', // Solo en HTTPS en producción
      sameSite: 'strict',
    });

    return token;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const logout = () => {
  Cookies.remove('jwt');
};
