import { apiClientCms } from '../config/api-config';

export const login = async (UserName, Password) => {
  try {
    const response = await apiClientCms.post('/api/auth/login', {
      UserName,
      Password,
    }, {
      withCredentials: true // Habilita el envío de cookies
    });

    console.log('Response:', response);
    console.log('Response Data:', response.data);
    console.log('Response Headers:', response.headers);

    return response.data;

  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};
export const cerrarSesion = async () => {
  try {
    const response = await apiClientCms.post('/api/auth/logout');
    console.log(response.data.message); 

  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};
