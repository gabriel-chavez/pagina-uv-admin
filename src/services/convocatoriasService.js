import apiClient from '../config/api-config';
/* Convocatorias */
export const obtenerConvocatorias = async () => {
  try {
    const response = await apiClient.get(`/api/Convocatoria`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const agregarConvocatoria = async (convocatoria) => {
    try {
      const response = await apiClient.post('/api/Convocatoria', convocatoria);
      return response.data;
    } catch (error) {
      console.error("Error al agregar convocatoria:", error.response?.data || error.message);
      throw error;
    }
  };
  export const eliminarConvocatoria = async (id) => {
    try {
      const response = await apiClient.delete(`/api/Convocatoria/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar convocatoria:", error.response?.data || error.message);
      throw error;
    }
  };
  export const actualizarConvocatoria = async (id, convocatoria) => {
    try {
      const response = await apiClient.put(`/api/Convocatoria/${id}`, convocatoria);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar convocatoria:", error.response?.data || error.message);
      throw error;
    }
  };

  /* Postulantes */
  export const obtenerPostulantes = async (id) => {
    try {
      const response = await apiClient.get(`/api/Postulacion/ObtenerPorConvocatoria/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  export const obtenerPostulante = async () => {
    try {
      const response = await apiClient.get(`/api/Convocatoria`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };