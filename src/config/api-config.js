import axios from 'axios';
import { openGlobalSnackbar } from '@/contexts/SnackbarContext';


const apiClientCms = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL_CMS,
    timeout: 10000,
});


const apiClientNoticias = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL_NOTICIAS,
    timeout: 10000,
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
// Interceptor de manejo de errores utilizando un switch
const errorHandler = (error) => {
    console.error(error)
    if (error.response) {
        const { status, data } = error.response;
        console.log(data)
        const mensaje = data.mensaje || 'Error en la solicitud';
        
        switch (status) {
            case 400:
                openGlobalSnackbar(mensaje, 'warning');
                break;
            case 401:
                openGlobalSnackbar(mensaje, 'error');
                break;
            case 404:
                openGlobalSnackbar(mensaje, 'info');
                break;
            case 500:
                openGlobalSnackbar(mensaje, 'error');
                break;
            default:
                openGlobalSnackbar(mensaje, 'warning');
                break;
        }
        
        return Promise.reject({ status, message: mensaje });
    } else if (error.request) {
     
        openGlobalSnackbar('Error de red. Inténtalo de nuevo más tarde.', 'error');
        return Promise.reject({ status: 500, message: 'Error de red. Inténtalo de nuevo más tarde.' });
    } else {
      
        openGlobalSnackbar('Error en la solicitud. Inténtalo de nuevo más tarde.', 'warning');
        return Promise.reject({ status: 500, message: 'Error en la solicitud. Inténtalo de nuevo más tarde.' });
    }
};


apiClientCms.interceptors.response.use(
    response => response,
    error => errorHandler(error) 
);

apiClientNoticias.interceptors.response.use(
    response => response,
    error => errorHandler(error) 
);




export { apiClientCms, apiClientNoticias };