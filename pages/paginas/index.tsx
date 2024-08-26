import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import TituloPagina from '@/components/TituloPagina';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';
import PaginasDinamicas from '@/content/paginas/PaginasDinamicas';
import { useForm, Controller } from 'react-hook-form';
import {
    Container,
    Grid,
    Card,
    CardHeader,
    CardContent,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    Button,
    FormControlLabel,
    Checkbox,
    FormGroup,
    Box
} from '@mui/material';
import ConfirmationDialog from '@/utils/Confirmacion';
import { obtenerPaginas, actualizarMenu, crearMenu } from '@/services/cmsService';
import { useSnackbar } from '@/contexts/SnackbarContext';
import SidebarLayout from '@/layouts/SidebarLayout';

export async function getServerSideProps() {
    try {
        const paginasDinamicas = await obtenerPaginas();
        
        return {
            props: {
                paginasDinamicas
            }
        };
    } catch (error) {
        return {
            props: {
                paginasDinamicas: null,
                error: error.message
            }
        };
    }
}

const ApplicationsTransactions = ({ paginasDinamicas: initialPaginasDinamicas }) => {
    const router = useRouter();
    const [paginasDinamicas, setPaginasDinamicas] = useState(initialPaginasDinamicas);
    const [open, setOpen] = useState(false);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [formData, setFormData] = useState(null);
    const [dialogTitle, setDialogTitle] = useState('Crear');
    const { control, handleSubmit, reset, setValue, watch } = useForm({
        defaultValues: {
            id: null,
            nombre: '',
            habilitado: true,
        }
    });

    const { openSnackbar } = useSnackbar();

    const watchedId = watch('id');

    useEffect(() => {
        console.log(`Watched ID: ${watchedId}`);
    }, [watchedId]);

    const fetchPaginasDinamicas = async () => {
        try {
            const paginas = await obtenerPaginas();
            setPaginasDinamicas(paginas);
        } catch (error) {
            console.error("Error al obtener las páginas dinámicas:", error);
        }
    };

    const handleModalAgregarEditar = (id = null, nombre = '', habilitado = true) => {
        setValue('id', id);
        setValue('nombre', nombre);
        setValue('habilitado', habilitado);
        setDialogTitle(id ? 'Editar' : 'Crear');

        setOpen(true);
    };

    const handleSecciones = (id: number) => {
        router.push(`/paginas/secciones/${id}`);
    };

    const handleClose = (event: React.SyntheticEvent, reason?: string) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return;
        }
        setOpen(false);
        reset();
    };

    const handleConfirmClose = () => {
        setOpenConfirmation(false);
    };

    const handleConfirmSubmit = async () => {
        try {
            console.log(formData)
            let respuesta;
            if (formData.id) {
                respuesta = await actualizarMenu(formData.id, formData);
            } else {
                respuesta = await crearMenu(formData);
            }
            console.log(respuesta);
            openSnackbar(respuesta.mensaje || 'Operación exitosa');
            handleConfirmClose();
            setOpen(false);
            reset();
            fetchPaginasDinamicas();

        } catch (error) {
            console.error("Error al guardar la página dinámica:", error);
            openSnackbar('Error al guardar la página dinámica', 'error');
        }
    };

    const onSubmit = (data: any) => {
        setFormData(data);
        setOpenConfirmation(true);
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
                    onCreate={() => handleModalAgregarEditar()}
                />
            </PageTitleWrapper>
            <Container maxWidth="lg">
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="stretch"
                    spacing={3}
                >
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader title="Páginas" />
                            <Divider />
                            <CardContent>
                                <PaginasDinamicas
                                    paginas={paginasDinamicas}
                                    onClickModalAgregarEditar={(id, nombre, habilitado) => handleModalAgregarEditar(id, nombre, habilitado)}
                                    onClickSecciones={handleSecciones}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <Footer />
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <DialogTitle id="form-dialog-title">{dialogTitle} Página Dinámica</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Ingresa los datos del formulario para {dialogTitle.toLowerCase()} la página
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
                        <Button onClick={(event) => handleClose(event, 'buttonClick')}>Cancelar</Button>
                        <Button type="submit">Guardar</Button>
                    </DialogActions>
                </form>
            </Dialog>
            <ConfirmationDialog
                open={openConfirmation}
                handleClose={handleConfirmClose}
                handleConfirm={handleConfirmSubmit}
                title="Confirmar"
                content={`¿Estás seguro de que deseas ${dialogTitle.toLowerCase()} la página dinámica?`}
            />
        </>
    );
};

ApplicationsTransactions.getLayout = (page) => (
    <SidebarLayout>{page}</SidebarLayout>
);

export default ApplicationsTransactions;
