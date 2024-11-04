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
    const RecursoIdSeleccionado = watch('recursoId'); // Obtenemos el valor de recursoId usando watch

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
        setValue('recursoId', recursoId); // Actualiza el valor de recursoId en el formulario
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
                maxWidth="lg" // Controla el tamaño máximo del diálogo (lg, md, sm, xl, xs)
                fullWidth // Hace que el diálogo ocupe el 100% del ancho máximo especificado
                sx={{
                    '& .MuiDialog-paper': {
                        width: '100%', // Ocupa el 100% del ancho en pantallas pequeñas
                        maxWidth: '100%', // Asegura que no exceda el 100% en pantallas pequeñas
                        '@media (min-width: 600px)': { // Para pantallas medianas y grandes
                            width: '80%', // Ocupar el 80% del ancho en pantallas más grandes
                            maxWidth: '600px' // Limitar el ancho máximo en pantallas grandes
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
                                    selectedRecursoId={RecursoIdSeleccionado} // Selección inicial basada en el valor de useForm
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