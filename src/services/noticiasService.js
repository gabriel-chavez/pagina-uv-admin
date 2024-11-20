import {apiClientNoticias } from '../config/api-config';
/*NOTICIAS*/
export const obtenerNoticias = async () => {
  try {
    const response = await apiClientNoticias.get(`/api/Noticia`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const crearNoticia = async (data) => {
  try {
    const response = await apiClientNoticias.post(`/api/Noticia`, data);    
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
    const response = await apiClientNoticias.get(`/api/ParCategoria`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const obtenerEstado = async () => {
  try {
    const response = await apiClientNoticias.get(`/api/ParEstado`);
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

/*Recursos noticias*/
export const obtenerRecursosNoticias = async () => {
  try {
      const response = await apiClientNoticias.get(`/api/Recursov2`);
      console.log(response)
      return response.data;
  } catch (error) {

      throw error;
  }
};
export const eliminarRecursoNoticias = async (id) => {
  try {
      const response = await apiClientNoticias.delete(`/api/Recursov2/${id}`);    
      return response.data;
  } catch (error) {

      throw error;
  }
};

export const cargarRecursoNoticias = async (data) => {
  try {
      const formData = new FormData();            
      Object.keys(data).forEach((key) => {
          if (data[key] instanceof File || data[key] instanceof Blob) {
              formData.append(key, data[key]); // Agregar archivos
          } else {
              formData.append(key, data[key]); // Agregar otros campos
          }
      });        
      const response = await apiClientNoticias.post(`/api/Recursov2`, formData, {
          headers: {
              "Content-Type": "multipart/form-data",
          },
      });
      return response.data; 
  } catch (error) {
      throw error; 
  }
};