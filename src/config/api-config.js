import axios from 'axios';
import { openGlobalSnackbar } from '@/contexts/SnackbarContext'; // Asegúrate de que la ruta sea correcta




const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // URL base de tu API
    timeout: 10000, // tiempo de espera de 10 segundos
});

// apiClient.interceptors.request.use(
//   config => {
//     // Puedes agregar configuraciones adicionales aquí, como headers
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   }
// );

// Interceptor global para manejar errores
apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            // El servidor respondió con un código de estado fuera del rango 2xx            
            switch (error.response.status) {
                case 400:
                    // Manejar error 400 (Bad Request)

                    openGlobalSnackbar(error.response.data.mensaje, 'warning');
                    return Promise.reject({ status: 400, message: error.response.data });
                case 401:
                    // Manejar error 401 (Unauthorized)

                    openGlobalSnackbar(error.response.data.mensaje, 'warning');
                    return Promise.reject({ status: 401, message: error.response.data });
                case 404:
                    // Manejar error 404 (Not Found)
                    openGlobalSnackbar(error.response.data.mensaje, 'warning');
                    return Promise.reject({ status: 404, message: error.response.data });
                default:

                    // Otros errores de respuesta no manejados específicamente
                    openGlobalSnackbar(error.response.data.mensaje,'warning');
                    return Promise.reject({ status: error.response.status, message: 'Error en la solicitud.' });
            }
        } else if (error.request) {
            // La solicitud fue hecha pero no se recibió respuesta
            openGlobalSnackbar('Error de red. Inténtalo de nuevo más tarde.');
            return Promise.reject({ status: 500, message: 'Error de red. Inténtalo de nuevo más tarde.' });
        } else {
            // Error antes de hacer la solicitud
            openGlobalSnackbar('Error en la solicitud. Inténtalo de nuevo más tarde.');
            return Promise.reject({ status: 500, message: 'Error en la solicitud. Inténtalo de nuevo más tarde.' });
        }
    }
);
export default apiClient;
