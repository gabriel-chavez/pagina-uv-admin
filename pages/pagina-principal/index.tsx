import Footer from "@/components/Footer";
import PageTitleWrapper from "@/components/PageTitleWrapper";
import TablaGenerica from "@/components/Tabla/TablaGenerica";
import TituloPagina from "@/components/TituloPagina";
import SidebarLayout from "@/layouts/SidebarLayout";
import ConfirmationDialog from "@/utils/Confirmacion";
import { Box, Button, Card, CardHeader, Checkbox, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, MenuItem, TextField } from "@mui/material";
import Head from 'next/head';

import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from "react";
import { useSnackbar } from "@/contexts/SnackbarContext";
import router from "next/router";
import { actualizarBannerPrincipalMaestro, crearBannerPrincipalMaestro, eliminarBannerPrincipalMaestro, obtenerBannerPrincipalMaestro, obtenerCatEstiloBanner, obtenerCatTipoBannerPaginaPrincipal, obtenerRecursos } from "@/services/cmsService";
import { Controller, useForm } from "react-hook-form";
import Editor from "@/utils/MdxEditor";


const FormularioPrincipal = ({ abrirModal, cerrarModal, tituloModal, datosIniciales, confirmacion }) => {
    const { control, handleSubmit, reset, setValue, watch } = useForm({
        defaultValues: {
            id: null, 
            nombre: '',
            catTipoBannerPaginaPrincipalId: '',
            catEstiloBannerId: '',
            habilitado: true,
            ... datosIniciales   
        }
    });
    const [abrirConfirmacion, setAbrirConfirmacion] = useState(false);
    const { openSnackbar } = useSnackbar();   
    const [tiposDeBanner, setTiposDeBanner] = useState([]);
    const [estilosDeBanner, setEstilosDeBanner] = useState([]);

    useEffect(() => {
        const cargarTipoBannerPagina = async () => {
            try {
                const tipos = await obtenerCatTipoBannerPaginaPrincipal();
                const tiposHabilitados = tipos.datos.filter((tipo) => tipo.habilitado);
                setTiposDeBanner(tiposHabilitados);
            } catch (error) {
                setTiposDeBanner([]);                
            }
        };
        const cargarEstilosBannerPagina = async () => {
            try {
                const estilos = await obtenerCatEstiloBanner();
                const estilosHabilitados = estilos.datos.filter((tipo) => tipo.habilitado);
                setEstilosDeBanner(estilosHabilitados);
            } catch (error) {
                setEstilosDeBanner([]);                
            }
        };
        cargarTipoBannerPagina();
        cargarEstilosBannerPagina();
    }, []);
    
    

    useEffect(() => {
        if (datosIniciales) {
            reset(datosIniciales);
        }
    }, [datosIniciales, reset]);

    const handleFileSelect = (recursoId) => {
        setValue('recursoId', recursoId);
    };
    const handleCerarModal = (event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return;
        }
        reset();
        cerrarModal();
    };

    const onSubmit = (event) => {
        event.preventDefault();
        setAbrirConfirmacion(true);
    };

    const handleCerrarConfirmacion = () => {
        setAbrirConfirmacion(false);
    };

    const handleConfirmar = async (data) => {

        console.log(data)
        let respuesta;
        if (data.id) {
            respuesta = await actualizarBannerPrincipalMaestro(data.id, data);
        } else {
            respuesta = await crearBannerPrincipalMaestro(data);
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
                maxWidth="md"
                fullWidth={true}
                aria-labelledby="form-dialog-title">
                <form onSubmit={onSubmit} autoComplete="off">
                    <DialogTitle id="form-dialog-title">{tituloModal}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Ingresa los datos del formulario para {tituloModal.toLowerCase()} el banner Principal
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
                                    rules={{ required: 'Nombre del banner es requerido' }}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            autoFocus
                                            required
                                            margin="dense"
                                            label="Nombre de banner"
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
                                <Controller
                                    name="catTipoBannerPaginaPrincipalId"
                                    control={control}
                                    rules={{ required: 'El tipo de banner es requerido' }}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            select
                                            label="Tipo de banner"
                                            value={field.value}
                                            onChange={field.onChange}

                                            variant="standard"
                                            fullWidth
                                            margin="dense"
                                            error={!!fieldState.error}
                                        >
                                            {tiposDeBanner.map((tipo) => (
                                                <MenuItem key={tipo.id} value={tipo.id}>
                                                    {tipo.nombre}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </div>
                            <div>
                                <Controller
                                    name="catEstiloBannerId"
                                    control={control}
                                    rules={{ required: 'El estilo de banner es requerido' }}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            select
                                            label="Estilo de banner"
                                            value={field.value}
                                            onChange={field.onChange}
                                            variant="standard"
                                            fullWidth
                                            margin="dense"
                                            error={!!fieldState.error}
                                        >
                                            {estilosDeBanner.map((tipo) => (
                                                <MenuItem key={tipo.id} value={tipo.id}>
                                                    {tipo.nombre}
                                                </MenuItem>
                                            ))}
                                        </TextField>
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
                            <Button onClick={(event) => handleCerarModal(event, 'buttonClick')}>Cancelar</Button>
                            <Button type="submit">Guardar</Button>
                        </DialogActions>
                    </Box>
                </form>
            </Dialog>
            <ConfirmationDialog
                open={abrirConfirmacion}
                handleClose={handleCerrarConfirmacion}
                handleConfirm={handleSubmit(handleConfirmar)}
                title="Confirmar"
                content={`¿Estás seguro de que deseas ${tituloModal.toLowerCase()} el banner?`}
            />
        </>
    );
};






const PaginaPrincipal = () => {


    const [paginasMaestro, setPaginasMaestro] = useState([]);
    const [abrirModalFormularioPrincipal, setAbrirModalFormularioPrincipal] = useState(false);
    const [tituloModal, setTituloModal] = useState("Crear")
    const [FormDataPrincipal, setFormDataPrincipal] = useState(null);

    const [openConfirmationDelete, setOpenConfirmationDelete] = useState(false);
    const [idToDelete, setIdToDelete] = useState<number | null>(null);
    const { openSnackbar } = useSnackbar();
    const fetchBannerPrincipal = async () => {
        try {
            const data = await obtenerBannerPrincipalMaestro();
            setPaginasMaestro(data.datos);
        } catch (error) {
            setPaginasMaestro([]);
        }
    };
    useEffect(() => {
        fetchBannerPrincipal();
    }, []);
    const handleAbrirModalAgregarEditar = (id = null) => {
        if (id) {
            const elementoEditar = paginasMaestro.find(item => item.id === id);
            console.log(elementoEditar)
            setFormDataPrincipal({
                id: elementoEditar.id,
                nombre: elementoEditar.nombre,
                catTipoBannerPaginaPrincipalId: elementoEditar.catTipoBannerPaginaPrincipalId,
                catEstiloBannerId: elementoEditar.catEstiloBannerId,
                habilitado: elementoEditar.habilitado,              
            });
            setTituloModal("Editar");
        }
        else {
            setFormDataPrincipal(null);
            setTituloModal("Crear")
        }
        setAbrirModalFormularioPrincipal(true);
    }
    const handleCerrarModalFormularioPrincipal = () => {
        setAbrirModalFormularioPrincipal(false);
    }
    const handleActualizarListaSeguros = async () => {
        await fetchBannerPrincipal();
    }




    const handleView = (id) => {
        router.push(`/pagina-principal/${id}`);
    };



    const handleConfirmDeleteClose = () => {
        setOpenConfirmationDelete(false);
        setIdToDelete(null); 
    };

    const handleConfirmDeleteOpen = (id: number) => {
        setIdToDelete(id); 
        setOpenConfirmationDelete(true);
    };
    const handleConfirmDeleteSubmit = async () => {
        if (idToDelete !== null) {

            const respuesta = await eliminarBannerPrincipalMaestro(idToDelete);
            openSnackbar(respuesta.mensaje);

            handleConfirmDeleteClose();
            fetchBannerPrincipal();

        }
    };

    // Configuración de las acciones
    const tableActions = [
        {
            label: 'Editar',
            icon: <EditIcon fontSize="small" />,
            onClick: handleAbrirModalAgregarEditar
        },
        {
            label: 'Ver Datos',
            icon: <VisibilityIcon fontSize="small" />,
            onClick: handleView
        },
        {
            label: 'Eliminar',
            icon: <DeleteIcon fontSize="small" />,
            onClick: handleConfirmDeleteOpen
        }
    ];
    const mappedData = paginasMaestro.map(item => ({
        Id: item.id,
        Nombre: item.nombre,        
        "Tipo de banner": item.catTipoBannerPaginaPrincipal.nombre,
        "Estilo banner":item.catEstiloBanner.nombre,        
        Habilitado: item.habilitado?"Si":"No"      
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
                content={`¿Estás seguro de que deseas eliminar el slider?`}
            />
        </>

        </>
    );
};

PaginaPrincipal.getLayout = (page) => (
    <SidebarLayout>{page}</SidebarLayout>
);

export default PaginaPrincipal;
