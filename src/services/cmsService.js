import { apiClientCms } from '../config/api-config';
/*PAGINAS DINAMICAS*/
export const obtenerPaginas = async () => {
    try {
        const response = await apiClientCms.get(`/api/PaginasDinamicas`);        
        console.log(response)
        return response.data;
    } catch (error) {        
        throw error;
    }
};
export const obtenerPagina = async (id) => {
    try {
        const response = await apiClientCms.get(`/api/PaginasDinamicas/${id}`);
        return response.data;
    } catch (error) {

        throw error;
    }
};
export const actualizarPagina = async (id, data) => {
    try {
        const response = await apiClientCms.put(`/api/PaginasDinamicas/${id}`, data);
        return response.data;
    } catch (error) {

        throw error;
    }
};
export const crearPagina = async (data) => {
    try {
        const response = await apiClientCms.post(`/api/PaginasDinamicas/`,data);
        return response.data;
    } catch (error) {

        throw error;
    }
};
export const eliminarPagina = async (id) => {
    try {
        const response = await apiClientCms.delete(`/api/PaginasDinamicas/${id}`);    
        return response.data;
    } catch (error) {

        throw error;
    } 
};
/*SECCIONES*/
export const obtenerSecciones = async (id) => {
    try {
        const response = await apiClientCms.get(`/api/Secciones/paginadinamica/${id}`);    
        return response.data;
    } catch (error) {      
        throw error;
        
    }
};

export const crearSeccion = async (data) => {
    try {
        const response = await apiClientCms.post(`/api/Secciones`,data);    
        return response.data;
    } catch (error) {

        throw error;
    }
};
export const eliminarSeccion = async (id) => {
    try {
        const response = await apiClientCms.delete(`/api/Secciones/${id}`);    
        return response.data;
    } catch (error) {

        throw error;
    } 
};
export const actualizarSeccion = async (id,data) => {
    try {
        const response = await apiClientCms.put(`/api/Secciones/${id}`,data);    
        return response.data;
    } catch (error) {

        throw error;
    }
};
export const obtenerSeccion = async (id) => {
    try {
        const response = await apiClientCms.get(`/api/Secciones/${id}`);    
        return response.data;
    } catch (error) {

        throw error;
    }
};
/*DATOS*/
export const obtenerDatosPorSeccion = async (id) => {
    try {
        const response = await apiClientCms.get(`/api/Datos/ObtenerDatosPorSeccionArray/${id}`);    
        return response.data;
    } catch (error) {

        throw error;
    }
};
export const crearDatos = async (data) => {
    try {
        const response = await apiClientCms.post(`/api/Datos`,data);    
        return response.data;
    } catch (error) {

        throw error;
    }
};
export const actualizarDatos = async (id,data) => {
    try {
        const response = await apiClientCms.put(`/api/Datos/${id}`,data);    
        return response.data;
    } catch (error) {

        throw error;
    }
};
export const eliminarDatos = async (id) => {
    try {
        const response = await apiClientCms.delete(`/api/Datos/${id}`);    
        return response.data;
    } catch (error) {

        throw error;
    }
};
/*MENU*/
export const obtenerMenu = async () => {
    try {
        const response = await apiClientCms.get(`/api/MenuPrincipal`);
        return response.data;
    } catch (error) {

        throw error;
    }
};
export const actualizarMenu = async (id, data) => {
    try {
        const response = await apiClientCms.put(`/api/MenuPrincipal/AsignarMenu/${id}`, data);
        return response.data;
    } catch (error) {

        throw error;
    }
};
/*PARAMETRICAS*/
export const obtenerTipoSeccion = async () => {
    try {
        const response = await apiClientCms.get(`/api/CatTipoSeccion`);
        return response.data;
    } catch (error) {

        throw error;
    }
};
export const obtenerTipoSeguro = async () => {
    try {
        const response = await apiClientCms.get(`/api/CatTipoSeguro`);
        return response.data;
    } catch (error) {

        throw error;
    }
};
/*RECURSOS*/
export const obtenerRecursos = async () => {
    try {
        const response = await apiClientCms.get(`/api/Recurso`);
        return response.data;
    } catch (error) {

        throw error;
    }
};
export const eliminarRecurso = async (id) => {
    try {
        const response = await apiClientCms.delete(`/api/Recurso/${id}`);    
        return response.data;
    } catch (error) {

        throw error;
    }
};

export const cargarRecurso = async (data) => {
    try {
        const formData = new FormData();            
        Object.keys(data).forEach((key) => {
            if (data[key] instanceof File || data[key] instanceof Blob) {
                formData.append(key, data[key]); // Agregar archivos
            } else {
                formData.append(key, data[key]); // Agregar otros campos
            }
        });        
        const response = await apiClientCms.post(`/api/Recurso`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data; 
    } catch (error) {
        throw error; 
    }
};

/*BANNER PAGINA*/
export const actualizarBannerPagina = async (id, data) => {
    try {
        const response = await apiClientCms.put(`/api/BannerPaginaDinamicas/${id}`, data);
        return response.data;
    } catch (error) {

        throw error;
    }
};
export const crearBannerPagina = async (data) => {
    try {
        const response = await apiClientCms.post(`/api/BannerPaginaDinamicas`,data);
        return response.data;
    } catch (error) {

        throw error;
    }
};
/*NUESTROS SEGUROS*/
/*SEGURO*/
export const obtenerSeguros = async () => {
    try {
        const response = await apiClientCms.get(`/api/Seguro`);
        return response.data;
    } catch (error) {

        throw error;
    }
};
export const crearSeguro= async (data) => {
    try {
        const response = await apiClientCms.post(`/api/Seguro`,data);
        return response.data;
    } catch (error) {

        throw error;
    }
};
export const actualizarSeguro = async (id, data) => {
    try {
        const response = await apiClientCms.put(`/api/Seguro/${id}`, data);
        return response.data;
    } catch (error) {

        throw error;
    }
};
export const eliminarSeguro = async (id) => {
    try {
        const response = await apiClientCms.delete(`/api/Seguro/${id}`);    
        return response.data;
    } catch (error) {

        throw error;
    }
};
/*PLAN*/
export const obtenerPlanPorSeguro = async (id) => {
    try {
        const response = await apiClientCms.get(`/api/Plan/ObtenerPorSeguro/${id}`);    
        return response.data;
    } catch (error) {      
        throw error;
        
    }
};
export const crearPlan= async (data) => {
    try {
        const response = await apiClientCms.post(`/api/plan`,data);
        return response.data;
    } catch (error) {

        throw error;
    }
};
export const actualizarPlan = async (id, data) => {
    try {
        const response = await apiClientCms.put(`/api/plan/${id}`, data);
        return response.data;
    } catch (error) {

        throw error;
    }
};
export const eliminarPlan = async (id) => {
    try {
        const response = await apiClientCms.delete(`/api/plan/${id}`);    
        return response.data;
    } catch (error) {

        throw error;
    }
};
/*DETALLE SEGURO*/
export const obtenerDetallePorSeguro = async (id) => {
    try {
        const response = await apiClientCms.get(`/api/SeguroDetalle/ObtenerPorSeguro/${id}`);    
        return response.data;
    } catch (error) {      
        throw error;
        
    }
};
export const crearDetalle= async (data) => {
    try {
        const response = await apiClientCms.post(`/api/SeguroDetalle`,data);
        return response.data;
    } catch (error) {

        throw error;
    }
};
export const actualizarDetalle = async (id, data) => {
    try {
        const response = await apiClientCms.put(`/api/SeguroDetalle/${id}`, data);
        return response.data;
    } catch (error) {

        throw error;
    }
};
export const eliminarDetalle = async (id) => {
    try {
        const response = await apiClientCms.delete(`/api/SeguroDetalle/${id}`);    
        return response.data;
    } catch (error) {

        throw error;
    }
};