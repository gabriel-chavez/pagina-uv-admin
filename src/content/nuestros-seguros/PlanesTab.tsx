import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import {
    Grid,
    Typography,
    CardContent,
    Card,
    Box,
    Divider,
    Menu,
    MenuItem,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
    FormControl,
    FormLabel,
    DialogActions,
    Button
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import Text from '@/components/Text';

import { actualizarPlan, crearPlan, eliminarPlan, obtenerPlanPorSeguro } from '@/services/cmsService';
import MarkdownRenderer from '@/utils/MarkdownRenderer';
import { useSnackbar } from '@/contexts/SnackbarContext';
import Editor from '@/utils/MdxEditor';
import ConfirmationDialog from '@/utils/Confirmacion';

interface Plan {
    seguroId: number;
    titulo: string;
    subTitulo: string;
    precio: number;
    cobertura: string;
    orden: number;
    habilitado: boolean;
    id: number;
}

interface PlanesTabProps {
    id: number;
}

const FormularioCrearEditar = ({ abrirModal, cerrarModal, tituloModal, datosIniciales, confirmacion }) => {
    const { control, handleSubmit, reset, setValue, watch } = useForm({
        defaultValues: {
            id: datosIniciales?.id || null,
            titulo: datosIniciales?.titulo || '',
            subTitulo: datosIniciales?.subTitulo || '',
            precio: datosIniciales?.precio || '',
            cobertura: datosIniciales?.cobertura || '',
            seguroId: datosIniciales?.seguroId || 0,
            orden: datosIniciales?.orden || 0,
        }
    });
    const [abrirConfirmacion, setAbrirConfirmacion] = useState(false);
    const { openSnackbar } = useSnackbar();






    useEffect(() => {
        if (datosIniciales) {
            reset(datosIniciales);
        }
    }, [datosIniciales, reset]);


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
            respuesta = await actualizarPlan(data.id, data);
        } else {
            respuesta = await crearPlan(data);
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
                                    name="titulo"
                                    control={control}
                                    rules={{ required: 'El titulo es requerido' }}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            autoFocus
                                            required
                                            margin="dense"
                                            label="Titulo del plan"
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
                                    name="subTitulo"
                                    control={control}
                                    rules={{ required: 'El subtitulo es requerido' }}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            autoFocus
                                            required
                                            margin="dense"
                                            label="Subtitulo"
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
                                    name="precio"
                                    control={control}
                                    rules={{ required: 'Precio requerido' }}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            autoFocus
                                            required
                                            margin="dense"
                                            label="Precio"
                                            type="number"
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
                                        <FormLabel sx={{ marginBottom: '15px', fontSize: '12px' }}>Cobertura</FormLabel>
                                        <Controller
                                            name="cobertura"
                                            control={control}
                                            render={({ field }) => (
                                                <Editor value={field.value ?? ''} onChange={field.onChange} />
                                            )}
                                        />
                                    </FormControl>

                                </Box>

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
                content={`¿Estás seguro de que deseas ${tituloModal.toLowerCase()} el Plan?`}
            />

        </>
    );
};




const PlanesTab: React.FC<PlanesTabProps> = ({ id }) => {
    const [planes, setPlanes] = useState<Plan[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [abrirModalFormularioCrearEditarPlan, setAbrirModalFormularioCrearEditarPlan] = useState(false);
    const [tituloModal, setTituloModal] = useState("Crear")
    const [FormDataPlan, setFormDataPlan] = useState(null);
    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const [idToDelete, setIdToDelete] = useState(null);
    const [openConfirmationDelete, setOpenConfirmationDelete] = useState(false);
    const { openSnackbar } = useSnackbar();


    const handleClick = (event: React.MouseEvent<HTMLElement>, idPlan) => {
        setAnchorEl(event.currentTarget);
        setSelectedPlanId(idPlan); // Guarda el id del plan actual

    };

    const handleClose = () => {
        setAnchorEl(null);
    };



    const handleDelete = (idPlan) => {

        setIdToDelete(idPlan); // Establece el ID para eliminar
        setOpenConfirmationDelete(true);

    };

    const fetchDatosPorSeccion = async () => {
        try {
            const data = await obtenerPlanPorSeguro(id);
            setPlanes(data.datos);
        } catch (error) {
            setPlanes([]);
        }
    };

    useEffect(() => {
        if (!isNaN(id)) {
            fetchDatosPorSeccion();
        }
    }, [id]);
    const handleCerrarModalFormularioCrearEditarPlan = () => {
        setAbrirModalFormularioCrearEditarPlan(false);
    }
    const handleActualizarPlan = async () => {
        await fetchDatosPorSeccion();
    }
    const handleAbrirModalAgregarEditar = (idPlan = null) => {
        console.log(idPlan)
        if (idPlan) {
            const elementoEditar = planes.find(item => item.id === idPlan);
            console.log(elementoEditar)
            setFormDataPlan({
                id: elementoEditar.id,
                titulo: elementoEditar.titulo,
                subTitulo: elementoEditar.subTitulo,
                precio: elementoEditar.precio,
                cobertura: elementoEditar.cobertura,
                orden: elementoEditar.orden,
                seguroId: elementoEditar.seguroId
            });
            setTituloModal("Editar");
        }
        else {
            setFormDataPlan({
                seguroId: id
            });
            setTituloModal("Crear")
        }
        setAbrirModalFormularioCrearEditarPlan(true);
        setAnchorEl(null);
    }
    const handleConfirmDeleteClose = () => {
        setOpenConfirmationDelete(false);
        setIdToDelete(null);
    };
    const handleConfirmDeleteSubmit = async () => {
        if (idToDelete !== null) {
            const respuesta = await eliminarPlan(idToDelete);
            openSnackbar(respuesta.mensaje);
            handleConfirmDeleteClose();
            fetchDatosPorSeccion();
        }
    };
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} >

                <Box pb={2} display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h3">Planes del seguro</Typography>
                        <Typography variant="subtitle2">
                            Registra o edita los planes del seguro
                        </Typography>
                    </Box>
                    <Button variant="contained" color="secondary" onClick={() => handleAbrirModalAgregarEditar()} startIcon={<AddTwoToneIcon fontSize="small" />}>
                        Agregar Plan
                    </Button>
                </Box>
            </Grid>
            {planes.map((plan, rowIndex) => (
                <Grid item xs={6} key={rowIndex}>
                    <Card variant="outlined">
                        <Box
                            p={3}
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Box>
                                <Typography variant="h4" gutterBottom>
                                    {plan.titulo}
                                </Typography>
                                <Typography variant="subtitle2">
                                    {plan.subTitulo}
                                </Typography>
                            </Box>
                            <IconButton onClick={(e) => handleClick(e, plan.id)}>
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl) && selectedPlanId === plan.id}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={() => handleAbrirModalAgregarEditar(plan.id)}>
                                    <EditTwoToneIcon fontSize="small" sx={{ mr: 1 }} />
                                    Editar
                                </MenuItem>
                                <MenuItem onClick={() => handleDelete(plan.id)}>
                                    <DeleteTwoToneIcon fontSize="small" sx={{ mr: 1 }} />
                                    Eliminar
                                </MenuItem>
                            </Menu>
                        </Box>
                        <Divider />
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="subtitle2">
                                <Grid container spacing={0}>
                                    <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                                        <Box pr={3} pb={2}>
                                            Precio:
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={8} md={9}>
                                        <Text color="black">
                                            <b>Bs. {plan.precio}</b>
                                        </Text>
                                    </Grid>
                                    <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                                        <Box pr={3} pb={2}>
                                            Cobertura:
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={8} md={9}>
                                        <Text color="black">
                                            <MarkdownRenderer content={plan.cobertura || ''} />
                                        </Text>
                                    </Grid>
                                </Grid>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
            {abrirModalFormularioCrearEditarPlan && (
                <FormularioCrearEditar
                    abrirModal={abrirModalFormularioCrearEditarPlan}
                    cerrarModal={handleCerrarModalFormularioCrearEditarPlan}
                    tituloModal={tituloModal}
                    datosIniciales={FormDataPlan}
                    confirmacion={handleActualizarPlan}
                />
            )}
            <ConfirmationDialog
                open={openConfirmationDelete}
                handleClose={handleConfirmDeleteClose}
                handleConfirm={handleConfirmDeleteSubmit}
                title="Confirmar eliminación"
                content={`¿Estás seguro de que deseas eliminar el plan?`}
            />
        </Grid>

    );
};

export default PlanesTab;
