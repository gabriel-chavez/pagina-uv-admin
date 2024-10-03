import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';
import {
    Container, Grid, Card, CardHeader, CardContent, Divider,
    Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, TextField, Button, FormControlLabel,
    Checkbox, FormGroup, Box
} from '@mui/material';
import TituloPagina from '@/components/TituloPagina';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';
import PaginasDinamicas from '@/content/paginas/PaginasDinamicas';
import ConfirmationDialog from '@/utils/Confirmacion';
import { obtenerPaginas, actualizarPagina, crearPagina, obtenerRecursos, actualizarBannerPagina, crearBannerPagina, eliminarPagina } from '@/services/cmsService';
import { useSnackbar } from '@/contexts/SnackbarContext';
import SidebarLayout from '@/layouts/SidebarLayout';
import VisorDeArchivos from '@/utils/VisorDeArchivos';

const fetchRecursos = async () => {
    try {
        const recursos = await obtenerRecursos();
        return recursos.datos;
    } catch (error) {
        return [];
    }
};

const fetchPaginasDinamicas = async () => {
    try {
        const paginas = await obtenerPaginas();
        return paginas.datos;
    } catch (error) {
        return [];
    }
};
// Componente para manejar la lógica del formulario
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
                    <DialogTitle id="form-dialog-title">Cambiar banner de página dinámica</DialogTitle>
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

// Componente para manejar la lógica del formulario
const FormularioPaginaDinamica = ({ abrirModal, cerrarModal, tituloModal, datosIniciales, confirmacion }) => {
    const { control, handleSubmit, reset, setValue } = useForm({
        defaultValues: {
            id: null,
            nombre: '',
            habilitado: true,
            ...datosIniciales //copiar los datos 
        }
    });

    const [abrirConfirmacion, setAbrirConfirmacion] = useState(false);
    const [formData, setFormData] = useState(datosIniciales);
    const { openSnackbar } = useSnackbar();

    useEffect(() => {
        if (datosIniciales) {
            setValue('id', datosIniciales.id);
            setValue('nombre', datosIniciales.nombre);
            setValue('habilitado', datosIniciales.habilitado);
        }
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

    const handleConfirmar = async () => {

        let respuesta;
        if (formData.id) {
            respuesta = await actualizarPagina(formData.id, formData);
        } else {
            respuesta = await crearPagina(formData);
        }
        openSnackbar(respuesta.mensaje);
        reset();
        confirmacion();
        handleCerrarConfirmacion();
        cerrarModal();

    };

    return (
        <>
            <Dialog open={abrirModal} onClose={handleCerarModal} aria-labelledby="form-dialog-title">
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <DialogTitle id="form-dialog-title">{tituloModal} Página Dinámica</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Ingresa los datos del formulario para {tituloModal.toLowerCase()} la página
                        </DialogContentText>
                        <Box
                            sx={{
                                '& .MuiTextField-root': { mt: 3, width: '100%' },
                                '& .MuiFormControlLabel-root': { mt: 3 }
                            }}
                        >
                            <div>
                                <Controller
                                    name="nombre"
                                    control={control}
                                    rules={{ required: 'Nombre de Página es requerido' }}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            autoFocus
                                            required
                                            margin="dense"
                                            label="Nombre de Página"
                                            type="text"
                                            fullWidth
                                            variant="standard"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error ? fieldState.error.message : ''}
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <FormGroup>
                                    <Controller
                                        name="habilitado"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControlLabel
                                                control={<Checkbox {...field} checked={field.value} />}
                                                label="Habilitado"
                                            />
                                        )}
                                    />
                                </FormGroup>
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
                content={`¿Estás seguro de que deseas ${tituloModal.toLowerCase()} la página dinámica?`}
            />
        </>
    );
};

// Componente principal de la página
const Pagina = () => {
    const router = useRouter();
    const { openSnackbar } = useSnackbar();
    const [abrirModalFormularioPrincipal, setAbrirModalFormularioPrincipal] = useState(false);
    const [abrirModalFormularioBanner, setAbrirModalFormularioBanner] = useState(false);
    const [tituloModal, setTituloModal] = useState('Crear');
    const [FormDataPrincipal, setFormDataPrincipal] = useState(null);
    const [FormDataBanner, setFormDataBanner] = useState(null);
    const [listaDePaginasDinamicas, setListaDePaginasDinamicas] = useState([]); // Estado para las páginas dinámicas
    const [abrirConfirmacionEliminar, setAbrirConfirmacionEliminar] = useState(false);
    const [idAEliminar, setIdAEliminar] = useState<number | null>(null);
    const handleAbrirModalAgregarEditar = (id = null, nombre = '', habilitado = true) => {

        setFormDataPrincipal({ id, nombre, habilitado });
        setTituloModal(id ? 'Editar' : 'Crear');
        setAbrirModalFormularioPrincipal(true);
    };
    const handleAbrirModalBanner = (id = null, paginaDinamicaId = null, recursoId = null) => {
        setFormDataBanner({ id, paginaDinamicaId, recursoId });
        setAbrirModalFormularioBanner(true);
    };

    useEffect(() => {
        const cargarPaginas = async () => {

            const paginas = await fetchPaginasDinamicas();
            setListaDePaginasDinamicas(paginas); // Asignar el resultado al estado

        };

        cargarPaginas(); // Llamar a la función asíncrona

    }, []); // El arreglo vacío asegura que se ejecute solo una vez, al montar el componente


    const handleRedireccionarASecciones = (id) => {
        router.push(`/paginas/secciones/${id}`);
    };

    const handleCerrarModalFormularioPrincipal = () => {
        setAbrirModalFormularioPrincipal(false);
        setFormDataPrincipal(null);
    };
    const handleCerrarModalFormularioBanner = () => {
        setAbrirModalFormularioBanner(false);
        setFormDataBanner(null);
    }
    const handleActualizarListaDePaginasDinamicas = async () => {
        const paginas = await fetchPaginasDinamicas();
        setListaDePaginasDinamicas(paginas); // Asignar el resultado al estado
    }
    const handleCerrarConfirmacionEliminar = () => {
        setAbrirConfirmacionEliminar(false);
    };
    const handleConfirmarEliminar = async () => {

        if (idAEliminar !== null) {

            const respuesta = await eliminarPagina(idAEliminar);
            openSnackbar(respuesta.mensaje);
            setIdAEliminar(null);
            setAbrirConfirmacionEliminar(false);
            handleActualizarListaDePaginasDinamicas();
        }

    };
    const handleConfirmarEliminacionOpen = (id: number) => {
        setIdAEliminar(id); // Establece el ID para eliminar
        setAbrirConfirmacionEliminar(true);
    };
    return (
        <>
            <Head>
                <title>Páginas dinámicas</title>
            </Head>
            <PageTitleWrapper>
                <TituloPagina
                    titulo="Páginas dinámicas"
                    subtitulo="Administra tu lista de Páginas Dinámicas"
                    tituloBoton="Crear página dinámica"
                    onCreate={() => handleAbrirModalAgregarEditar()}
                />
            </PageTitleWrapper>
            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader title="Páginas" />
                            <Divider />
                            <CardContent>
                                <PaginasDinamicas
                                    paginas={listaDePaginasDinamicas}
                                    onClickModalAgregarEditar={handleAbrirModalAgregarEditar}
                                    onClickSecciones={handleRedireccionarASecciones}
                                    onClickEliminarPagina={handleConfirmarEliminacionOpen}
                                    onClickEditarBanner={handleAbrirModalBanner}

                                />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <Footer />
            {abrirModalFormularioPrincipal && (
                <FormularioPaginaDinamica
                    abrirModal={abrirModalFormularioPrincipal}
                    cerrarModal={handleCerrarModalFormularioPrincipal}
                    tituloModal={tituloModal}
                    datosIniciales={FormDataPrincipal}
                    confirmacion={handleActualizarListaDePaginasDinamicas}
                />
            )}
            {abrirModalFormularioBanner && (
                <FormularioBanner
                    abrirModal={abrirModalFormularioBanner}
                    cerrarModal={handleCerrarModalFormularioBanner}
                    datosIniciales={FormDataBanner}
                    confirmacion={handleActualizarListaDePaginasDinamicas}
                />
            )
            }
            <ConfirmationDialog
                open={abrirConfirmacionEliminar}
                handleClose={handleCerrarConfirmacionEliminar}
                handleConfirm={handleConfirmarEliminar}
                title="Confirmar"
                content={`¿Estás seguro de que deseas eliminar la página dinámica?`}
            />
        </>
    );
};

Pagina.getLayout = (page) => (
    <SidebarLayout>{page}</SidebarLayout>
);

export default Pagina;
