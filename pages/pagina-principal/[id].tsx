import Footer from "@/components/Footer";
import PageTitleWrapper from "@/components/PageTitleWrapper";
import TablaGenerica from "@/components/Tabla/TablaGenerica";
import TituloPagina from "@/components/TituloPagina";
import SidebarLayout from "@/layouts/SidebarLayout";
import ConfirmationDialog from "@/utils/Confirmacion";
import { Box, Button, Card, CardHeader, Checkbox, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField } from "@mui/material";
import Head from 'next/head';

import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from "react";
import { useSnackbar } from "@/contexts/SnackbarContext";
import { useRouter } from "next/router";

import { actualizarBannerPrincipalDetalle, crearBannerPrincipalDetalle, eliminarBannerPrincipalDetalle, obtenerBannerPorMaestro, obtenerRecursos } from "@/services/cmsService";
import { Controller, useForm } from "react-hook-form";
import Editor from "@/utils/MdxEditor";
import VisorDeArchivos from "@/utils/VisorDeArchivos";

const FormularioPrincipal = ({ abrirModal, cerrarModal, tituloModal, datosIniciales, confirmacion }) => {
    const { control, handleSubmit, reset, setValue, watch } = useForm({
        defaultValues: {
            id: null,
            titulo: '',
            texto: '',
            enlace: '',
            recursoId: null,
            bannerPaginaPrincipalMaestroId: null,
            habilitado: true,
            ...datosIniciales
        }
    });
    
    const [abrirConfirmacion, setAbrirConfirmacion] = useState(false);
    const [listaDeRecursos, setListaDeRecursos] = useState([]);
    const { openSnackbar } = useSnackbar();
    useEffect(() => {
        const cargarRecursos = async () => {
            try {
                const recursos = await obtenerRecursos();
                setListaDeRecursos(recursos.datos);
            } catch (error) {
                setListaDeRecursos([]);
                console.error("Error al cargar recursos:", error);
            }
        };

        cargarRecursos();
    }, []);
    useEffect(() => {
        if (datosIniciales) {
            reset(datosIniciales);
        }
    }, [datosIniciales, reset]);

    const handleCerrarModal = (event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return;
        }
        reset();
        cerrarModal();
    };
    const handleAbrirConfirmacion=(event)=>{
        event.preventDefault();
        setAbrirConfirmacion(true);
    }
    const handleCerrarConfirmacion = () => {
        setAbrirConfirmacion(false);
    };
    const handleConfirmar = async (data) => {
        let respuesta;
        console.log(data)

        if (data.id) {
            respuesta = await actualizarBannerPrincipalDetalle(data.id, data);
        } else {
            respuesta = await crearBannerPrincipalDetalle(data);
        }

        openSnackbar(respuesta.mensaje);
        reset();
        confirmacion();
        cerrarModal();
    };

    const handleFileSelect = (recursoId) => {
        setValue('recursoId', recursoId);
    };
    const selectedRecursoId = watch('recursoId');

    return (
        <Dialog
            open={abrirModal}
            onClose={handleCerrarModal}
            maxWidth="md"
            fullWidth={true}
            aria-labelledby="form-dialog-title">
            <form onSubmit={handleAbrirConfirmacion} autoComplete="off">
                <DialogTitle id="form-dialog-title">{tituloModal}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Ingresa los datos del formulario para {tituloModal.toLowerCase()} el banner
                    </DialogContentText>
                    <Box sx={{ '& .MuiTextField-root': { mt: 3, width: '100%' } }}>


                        <Box mt={2}>
                            <FormControl fullWidth margin="dense">
                                <FormLabel sx={{ marginBottom: '15px', fontSize: '12px' }}>Título</FormLabel>
                                <Controller
                                    name="titulo"
                                    control={control}
                                    render={({ field }) => (
                                        <Editor value={field.value ?? ''} onChange={field.onChange} />
                                    )}
                                />
                            </FormControl>
                        </Box>
                        <Box mt={2}>
                            <FormControl fullWidth margin="dense">
                                <FormLabel sx={{ marginBottom: '15px', fontSize: '12px' }}>Texto</FormLabel>
                                <Controller
                                    name="texto"
                                    control={control}
                                    render={({ field }) => (
                                        <Editor value={field.value ?? ''} onChange={field.onChange} />
                                    )}
                                />
                            </FormControl>
                        </Box>


                        <Controller
                            name="enlace"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Enlace"
                                    variant="standard"
                                />
                            )}
                        />
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
                        <VisorDeArchivos
                            archivos={listaDeRecursos}
                            onSelect={handleFileSelect}
                            selectedRecursoId={selectedRecursoId}
                        />

                    </Box>
                </DialogContent>
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: '#fff',
                        zIndex: 1000,
                        borderTop: '1px solid #e0e0e0',
                        padding: '8px 24px',
                    }}
                >
                    <DialogActions>
                        <Button onClick={(event) => handleCerrarModal(event, 'buttonClick')}>Cancelar</Button>
                        <Button type="submit">Guardar</Button>
                    </DialogActions>
                </Box>

            </form>
            <ConfirmationDialog
                open={abrirConfirmacion}
                handleClose={handleCerrarConfirmacion}
                handleConfirm={handleSubmit(handleConfirmar)}
                title="Confirmar registro"
                content={`¿Estás seguro de que deseas ${tituloModal.toLowerCase()} el detalle del slider?`}
            />
        </Dialog>
    );
};



const PaginaPrincipalDetalle = () => {
    const router = useRouter();
    const { id: maestroSliderId } = router.query;

    const [bannersDetalle, setBannersDetalle] = useState([]);
    const [abrirModalFormularioPrincipal, setAbrirModalFormularioPrincipal] = useState(false);
    const [tituloModal, setTituloModal] = useState("Crear")
    const [FormDataPrincipal, setFormDataPrincipal] = useState(null);

    const [openConfirmationDelete, setOpenConfirmationDelete] = useState(false);
    const [idAEliminar, setIdAEliminar] = useState<number | null>(null);
    const { openSnackbar } = useSnackbar();
    const fetchBannerSlider = async () => {
        try {

            const data = await obtenerBannerPorMaestro(maestroSliderId);
            setBannersDetalle(data.datos);
        } catch (error) {
            setBannersDetalle([]);
        }
    };
    useEffect(() => {
        if (router.isReady && maestroSliderId) {
            fetchBannerSlider();
        }
    }, [router.isReady, maestroSliderId]);
    const handleAbrirModalAgregarEditar = (id = null) => {
        const elementoEditar = id ? bannersDetalle.find(item => item.id === id) : {};
        setFormDataPrincipal({
            id: elementoEditar?.id || null,
            titulo: elementoEditar?.titulo || "",
            texto: elementoEditar?.texto || "",
            enlace: elementoEditar?.enlace || "",
            recursoId: elementoEditar?.recursoId || null,
            bannerPaginaPrincipalMaestroId: maestroSliderId,
            habilitado: elementoEditar?.habilitado ?? true,
        });
        setTituloModal(id ? "Editar" : "Crear");
        setAbrirModalFormularioPrincipal(true);
    };
    const handleCerrarModalFormularioPrincipal = () => {
        setAbrirModalFormularioPrincipal(false);
    }
    const handleActualizarListaSeguros = async () => {
        await fetchBannerSlider();
    }

    const handleView = (id) => {
        router.push(`/pagina-principal/${id}`);
    };

    const handleConfirmDeleteClose = () => {
        setOpenConfirmationDelete(false);
        setIdAEliminar(null);
    };

    const handleConfirmDeleteOpen = (id: number) => {
        setIdAEliminar(id);
        setOpenConfirmationDelete(true);
    };
    const handleConfirmDeleteSubmit = async () => {
        if (idAEliminar !== null) {

            const respuesta = await eliminarBannerPrincipalDetalle(idAEliminar);
            openSnackbar(respuesta.mensaje);

            handleConfirmDeleteClose();
            fetchBannerSlider();

        }
    };

    const tableActions = [
        {
            label: 'Editar',
            icon: <EditIcon fontSize="small" />,
            onClick: handleAbrirModalAgregarEditar
        },

        {
            label: 'Eliminar',
            icon: <DeleteIcon fontSize="small" />,
            onClick: handleConfirmDeleteOpen
        }
    ];
    const mappedData = bannersDetalle.map(item => ({
        Id: item.id,
        Título: item.titulo,
        Texto: item.texto,
        Enlace: item.enlace,
        Recurso: item.recurso.recursoEscritorio,
        Habilitado: item.habilitado ? "Sí" : "No",
    }));

    return (
        <>
            <>
                <Head>
                    <title>Pagina Principal</title>
                </Head>
                <PageTitleWrapper>
                    <TituloPagina
                        titulo="Slider página principal"
                        subtitulo="Listado de sliders de la pagina principal"
                        tituloBoton="Asignar nuevo slider"
                        onCreate={() => handleAbrirModalAgregarEditar()
                        }
                    />
                </PageTitleWrapper>

                <Container maxWidth="lg">
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Card>
                                <CardHeader title="Lista de seguros registrados" />
                                <Divider />
                                <TablaGenerica
                                    data={mappedData}
                                    actions={tableActions}
                                />
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
                <Footer />
                {abrirModalFormularioPrincipal && (
                    <FormularioPrincipal
                        abrirModal={abrirModalFormularioPrincipal}
                        cerrarModal={handleCerrarModalFormularioPrincipal}
                        tituloModal={tituloModal}
                        datosIniciales={FormDataPrincipal}
                        confirmacion={handleActualizarListaSeguros}
                    />
                )}
                <ConfirmationDialog
                    open={openConfirmationDelete}
                    handleClose={handleConfirmDeleteClose}
                    handleConfirm={handleConfirmDeleteSubmit}
                    title="Confirmar eliminación"
                    content={`¿Estás seguro de que deseas el detalle del slider?`}
                />
            </>

        </>
    );
};

PaginaPrincipalDetalle.getLayout = (page) => (
    <SidebarLayout>{page}</SidebarLayout>
);

export default PaginaPrincipalDetalle;
