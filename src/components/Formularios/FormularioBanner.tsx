import { useSnackbar } from "@/contexts/SnackbarContext";
import { actualizarBannerPagina, crearBannerPagina, obtenerRecursos } from "@/services/cmsService";
import ConfirmationDialog from "@/utils/Confirmacion";
import VisorDeArchivos from "@/utils/VisorDeArchivos";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const fetchRecursos = async () => {
    try {
        const recursos = await obtenerRecursos();
        return recursos.datos;
    } catch (error) {
        return [];
    }
};

const FormularioBanner = ({ abrirModal, cerrarModal, datosIniciales, confirmacion }) => {
    const { handleSubmit, reset, setValue, watch } = useForm({
        defaultValues: {
            id: null,
            recursoId: '',
            ...datosIniciales //copiar los datos 
        }
    });
    const RecursoIdSeleccionado = watch('recursoId'); // Obtenemos recursoId usando watch

    const [abrirConfirmacion, setAbrirConfirmacion] = useState(false);
    const [formData, setFormData] = useState(datosIniciales);
    const [listaDeRecursos, setListaDeRecursos] = useState([]);
    const { openSnackbar } = useSnackbar();

    useEffect(() => {
        const cargarRecursos = async () => {
            const recursos = await fetchRecursos();
            setListaDeRecursos(recursos);
        };

        cargarRecursos(); // Llamar a la función asíncrona
    }, [datosIniciales, setValue]);

    const handleCerarModal = (event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return;
        }
        reset();
        cerrarModal();
    };

    const onSubmit = (data) => {
        setFormData(data);
        setAbrirConfirmacion(true);
    };

    const handleCerrarConfirmacion = () => {
        setAbrirConfirmacion(false);
    };
    const handleSeleccionarArchivo = (recursoId) => {
        setValue('recursoId', recursoId); 
    };

    const handleConfirmar = async () => {

        let respuesta;

        if (formData.id) {
            respuesta = await actualizarBannerPagina(formData.id, formData);
        } else {
            respuesta = await crearBannerPagina(formData);
        }
        openSnackbar(respuesta.mensaje);
        reset();
        confirmacion();
        handleCerrarConfirmacion();
        cerrarModal();

    };

    return (
        <>
            <Dialog
                open={abrirModal}
                onClose={handleCerarModal}
                aria-labelledby="form-dialog-title"
                maxWidth="lg" 
                fullWidth 
                sx={{
                    '& .MuiDialog-paper': {
                        width: '100%', 
                        maxWidth: '100%',
                        '@media (min-width: 600px)': { 
                            width: '80%', 
                            maxWidth: '600px'
                        }
                    }
                }}
            >

                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <DialogTitle id="form-dialog-title">Cambiar banner</DialogTitle>
                    <DialogContent>

                        <Box
                            sx={{
                                '& .MuiTextField-root': { mt: 3, width: '100%' },
                                '& .MuiFormControlLabel-root': { mt: 3 }
                            }}
                        >
                            <div>
                                <VisorDeArchivos
                                    archivos={listaDeRecursos}
                                    onSelect={handleSeleccionarArchivo}
                                    selectedRecursoId={RecursoIdSeleccionado}
                                />
                            </div>

                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={(event) => handleCerarModal(event, 'buttonClick')}>Cancelar</Button>
                        <Button type="submit">Guardar</Button>
                    </DialogActions>
                </form>
            </Dialog>
            <ConfirmationDialog
                open={abrirConfirmacion}
                handleClose={handleCerrarConfirmacion}
                handleConfirm={handleConfirmar}
                title="Confirmar"
                content={`¿Estás seguro de que deseas actualizar el banner la página dinámica?`}
            />
        </>
    );
};
export default FormularioBanner;