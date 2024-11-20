import Head from 'next/head';
import TituloPagina from '@/components/TituloPagina';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';

import SidebarLayout from '@/layouts/SidebarLayout';

import { Box, Button, Card, CardContent, CardHeader, Checkbox, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';


import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import TablaGenerica from '@/components/Tabla/TablaGenerica';
import { actualizarSeguro, crearSeguro, eliminarSeguro, obtenerRecursos, obtenerSeguros, obtenerTipoSeguro } from '@/services/cmsService';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ConfirmationDialog from '@/utils/Confirmacion';
import { useSnackbar } from '@/contexts/SnackbarContext';
import Editor from '@/utils/MdxEditor';
import VisorDeArchivos from '@/utils/VisorDeArchivos';
import router from 'next/router';




const FormularioPrincipal = ({ abrirModal, cerrarModal, tituloModal, datosIniciales, confirmacion }) => {
    const { control, handleSubmit, reset, setValue, watch } = useForm({
        defaultValues: {
            id: datosIniciales?.id || null,
            nombre: datosIniciales?.nombre || '',
            nombreCorto: datosIniciales?.nombreCorto || '',
            detalleAdicional: datosIniciales?.detalleAdicional || '',
            recursoId: datosIniciales?.recursoId || '',
            icono: datosIniciales?.icono || '',
            catTipoSeguroId: datosIniciales?.catTipoSeguroId || '',
            habilitado: datosIniciales?.habilitado || true,
            orden: 0
        }
    });
    const [abrirConfirmacion, setAbrirConfirmacion] = useState(false);
    const { openSnackbar } = useSnackbar();
    const [listaDeRecursos, setListaDeRecursos] = useState([]);
    const [tiposDeSeguro, setTiposDeSeguro] = useState([]);


    const selectedRecursoId = watch('recursoId');
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
        const cargarTiposSeguro = async () => {
            try {
                const recursos = await obtenerTipoSeguro();
                const tiposHabilitados = recursos.datos.filter((tipo) => tipo.habilitado);
                setTiposDeSeguro(tiposHabilitados);
            } catch (error) {
                setTiposDeSeguro([]);
                console.error("Error al cargar tipos de seguro:", error);
            }
        };

        cargarTiposSeguro();
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
            respuesta = await actualizarSeguro(data.id, data);
        } else {
            respuesta = await crearSeguro(data);
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
                            Ingresa los datos del formulario para {tituloModal.toLowerCase()}
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
                                    rules={{ required: 'Nombre del seguro es requerido' }}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            autoFocus
                                            required
                                            margin="dense"
                                            label="Nombre de Seguro"
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
                                    name="nombreCorto"
                                    control={control}
                                    rules={{ required: 'Nombre corto es requerido' }}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            autoFocus
                                            required
                                            margin="dense"
                                            label="Nombre corto"
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
                                <Box mt={2}>
                                    <FormControl fullWidth margin="dense">
                                        <FormLabel sx={{ marginBottom: '15px', fontSize: '12px' }}>Detalle adicional</FormLabel>
                                        <Controller
                                            name="detalleAdicional"
                                            control={control}
                                            render={({ field }) => (
                                                <Editor value={field.value ?? ''} onChange={field.onChange} />
                                            )}
                                        />
                                    </FormControl>

                                </Box>

                            </div>

                            <div>
                                <Controller
                                    name="icono"
                                    control={control}
                                    rules={{ required: 'Icono requerido' }}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            autoFocus
                                            required
                                            margin="dense"
                                            label="Icono"
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
                                    name="catTipoSeguroId"
                                    control={control}
                                    rules={{ required: 'El tipo de seguro es requerido' }}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            select
                                            label="Tipo de Seguro"
                                            value={field.value}
                                            onChange={field.onChange}

                                            variant="standard"
                                            fullWidth
                                            margin="dense"
                                            error={!!fieldState.error}
                                        >
                                            {tiposDeSeguro.map((tipo) => (
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
                            <div>
                                <VisorDeArchivos
                                    archivos={listaDeRecursos}
                                    onSelect={handleFileSelect}
                                    selectedRecursoId={selectedRecursoId}
                                />
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
                content={`¿Estás seguro de que deseas ${tituloModal.toLowerCase()} la página dinámica?`}
            />
        </>
    );
};



const NuestrosSeguros = () => {
    const [seguros, setSeguros] = useState([]);
    const [abrirModalFormularioPrincipal, setAbrirModalFormularioPrincipal] = useState(false);
    const [tituloModal, setTituloModal] = useState("Crear Seguro")
    const [FormDataPrincipal, setFormDataPrincipal] = useState(null);

    const [openConfirmationDelete, setOpenConfirmationDelete] = useState(false);
    const [idToDelete, setIdToDelete] = useState<number | null>(null);
    const { openSnackbar } = useSnackbar();
    const fetchSeguros = async () => {
        try {
            const data = await obtenerSeguros();
            setSeguros(data.datos);
        } catch (error) {
            setSeguros([]);
        }
    };
    useEffect(() => {
        fetchSeguros();
    }, []);
    const handleAbrirModalAgregarEditar = (id = null) => {
        if (id) {
            const elementoEditar = seguros.find(item => item.id === id);
            console.log(elementoEditar)
            setFormDataPrincipal({
                id: elementoEditar.id,
                nombre: elementoEditar.nombre,
                nombreCorto: elementoEditar.nombreCorto,
                detalleAdicional: elementoEditar.detalleAdicional,
                recursoId: elementoEditar.recursoId,
                icono: elementoEditar.icono,
                habilitado: elementoEditar.habilitado,
                catTipoSeguroId: elementoEditar.catTipoSeguroId,
            });
            setTituloModal("Editar Seguro");
        }
        else {
            setFormDataPrincipal(null);
            setTituloModal("Crear Seguro")
        }
        setAbrirModalFormularioPrincipal(true);
    }
    const handleCerrarModalFormularioPrincipal = () => {
        setAbrirModalFormularioPrincipal(false);
    }
    const handleActualizarListaSeguros = async () => {
        await fetchSeguros();
    }




    const handleView = (id) => {
        router.push(`/nuestros-seguros/${id}`);
    };



    const handleConfirmDeleteClose = () => {
        setOpenConfirmationDelete(false);
        setIdToDelete(null); // Resetea el ID después de cerrar el diálogo
    };

    const handleConfirmDeleteOpen = (id: number) => {
        setIdToDelete(id); // Establece el ID para eliminar
        setOpenConfirmationDelete(true);
    };
    const handleConfirmDeleteSubmit = async () => {
        if (idToDelete !== null) {

            const respuesta = await eliminarSeguro(idToDelete);
            openSnackbar(respuesta.mensaje);

            handleConfirmDeleteClose();
            fetchSeguros();

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
    const mappedData = seguros.map(item => ({
        Id: item.id,
        Nombre: item.nombre,
        "Nombre corto": item.nombreCorto,
        "Detalle adicional": item.detalleAdicional,
        Icono: item.icono,
        "Tipo seguro": item.catTipoSeguro.nombre,
        Banner: "",
        Menu: item.menuPrincipal.length > 0 ? item.menuPrincipal[0].url : '',
        Habilitado: item.habilitado ? "Si" : "No"
    }));

    return (
        <>
            <Head>
                <title>Nuestros seguros</title>
            </Head>
            <PageTitleWrapper>
                <TituloPagina
                    titulo="Nuestros seguros"
                    subtitulo="Administra la lista de seguros"
                    tituloBoton="Crear nuevo seguro"
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
                content={`¿Estás seguro de que deseas eliminar el seguro?`}
            />
        </>
    );
};

NuestrosSeguros.getLayout = (page) => (
    <SidebarLayout>{page}</SidebarLayout>
);

export default NuestrosSeguros;
