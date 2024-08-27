import apiClient from '../config/api-config';
/*PAGINAS DINAMICAS*/
export const obtenerPaginas = async () => {
    try {
        const response = await apiClient.get(`/api/PaginasDinamicas/`);
        return response.data;
    } catch (error) {

        throw error;
    }
};
export const actualizarMenu = async (id, data) => {
    try {
        const response = await apiClient.put(`/api/PaginasDinamicas/${id}`, data);
        return response.data;
    } catch (error) {

        throw error;
    }
};
export const crearMenu = async (data) => {
    try {
        const response = await apiClient.post(`/api/PaginasDinamicas/`,data);
        return response.data;
    } catch (error) {

        throw error;
    }
};
/*SECCIONES*/
export const obtenerSecciones = async (id) => {
    try {
        const response = await apiClient.get(`/api/Secciones/paginadinamica/${id}`);    
        return response.data;
    } catch (error) {

        throw error;
    }
};

export const crearSeccion = async (data) => {
    try {
        const response = await apiClient.post(`/api/Secciones/`,data);    
        return response.data;
    } catch (error) {

        throw error;
    }
};
export const actualizarSeccion = async (id,data) => {
    try {
        const response = await apiClient.put(`/api/Secciones/${id}`,data);    
        return response.data;
    } catch (error) {

        throw error;
    }
};
/*DATOS*/
export const obtenerDatosPorSeccion = async (id) => {
    try {
        const response = await apiClient.get(`/api/Datos/ObtenerDatosPorSeccionArray/${id}`);    
        return response.data;
    } catch (error) {

        throw error;
    }
};
export const crearDatos = async (data) => {
    try {
        const response = await apiClient.post(`/api/Datos/`,data);    
        return response.data;
    } catch (error) {

        throw error;
    }
};
export const actualizarDatos = async (id,data) => {
    try {
        const response = await apiClient.put(`/api/Datos/${id}`,data);    
        return response.data;
    } catch (error) {

        throw error;
    }
};
export const eliminarDatos = async (id) => {
    try {
        const response = await apiClient.delete(`/api/Datos/${id}`);    
        return response.data;
    } catch (error) {

        throw error;
    }
};
/*MENU*/
export const obtenerMenu = async () => {
    try {
        const response = await apiClient.get(`/api/MenuPrincipal/`);
        return response.data;
    } catch (error) {

        throw error;
    }
};
/*PARAMETRICAS*/
export const obtenerTipoSeccion = async () => {
    try {
        const response = await apiClient.get(`/api/CatTipoSeccion/`);
        return response.data;
    } catch (error) {

        throw error;
    }
};
/*RECURSOS*/
export const obtenerRecursos = async () => {
    try {
        const response = await apiClient.get(`/api/Recurso/`);
        return response.data;
    } catch (error) {

        throw error;
    }
};