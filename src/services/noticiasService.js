import {apiClientNoticias } from '../config/api-config';
/*NOTICIAS*/
export const obtenerNoticias = async () => {
  try {
    const response = await apiClientNoticias.get(`/api/Noticia/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const crearNoticia = async (data) => {
  try {
    const response = await apiClientNoticias.post(`/api/Noticia/`, data);    
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const actualizarNoticia = async (id, data) => {
  try {
    const response = await apiClientNoticias.put(`/api/Noticia/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const eliminarNoticia = async (id) => {
  try {
    const response = await apiClientNoticias.delete(`/api/Noticia/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const obtenerCategoria = async () => {
  try {
    const response = await apiClientNoticias.get(`/api/ParCategoria/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const obtenerRecursos = async () => {
  try {
    const response = await apiClientNoticias.get(`/api/Recurso/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const obtenerEstado = async () => {
  try {
    const response = await apiClientNoticias.get(`/api/ParEstado/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const obtenerDetallePorNoticia = async (id) => {
  try {
    const response = await apiClientNoticias.get(`api/Noticia/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};