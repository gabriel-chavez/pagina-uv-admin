import Head from 'next/head';
import TituloPagina from '@/components/TituloPagina';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';

import SidebarLayout from '@/layouts/SidebarLayout';

import { Box, Button, Checkbox, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';


import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import TablaGenerica from '@/components/Tabla/TablaGenerica';

import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ConfirmationDialog from '@/utils/Confirmacion';
import { useSnackbar } from '@/contexts/SnackbarContext';
import Editor from '@/utils/MdxEditor';
import VisorDeArchivos from '@/utils/VisorDeArchivos';
import router from 'next/router';
import { obtenerCategoria, obtenerNoticias,obtenerRecursos,obtenerEstado,actualizarNoticia,crearNoticia,eliminarNoticia } from '@/services/noticiasService';


const FormularioPrincipal = ({ abrirModal, cerrarModal, tituloModal, datosIniciales, confirmacion }) => {
    console.log(datosIniciales)
    const { control, handleSubmit, reset, setValue, watch } = useForm({
        defaultValues: {
            id: datosIniciales?.id || null,
            titulo: datosIniciales?.titulo || '',
            tituloCorto: datosIniciales?.tituloCorto || '',
            contenido: datosIniciales?.contenido || '',
            resumen: datosIniciales?.resumen || '',
            recursoId_ImagenPrincipal: datosIniciales?.recursoId_ImagenPrincipal || null,
            fecha: datosIniciales?.fecha || '',
            parCategoriaId: datosIniciales?.parCategoriaId || 0,
            parEstadoId: datosIniciales?.parEstadoId || 0,
            etiquetas: datosIniciales?.etiquetas || '',
            Orden: 0,
           
        }
    });
    const [abrirConfirmacion, setAbrirConfirmacion] = useState(false);
    const { openSnackbar } = useSnackbar();
    const [listaDeRecursos, setListaDeRecursos] = useState([]);
    const [categorias, setTiposDeSeguro] = useState([]);
    const [estado, setEstado] = useState([]);



    const selectedRecursoId = watch('recursoId_ImagenPrincipal');
    useEffect(() => {
        
        const cargarRecursos = async () => {
            try {
                const recursos = await obtenerRecursos();
   
                setListaDeRecursos(recursos);
                console.log("recursos")
                console.log(recursos)
               
            } catch (error) {
                setListaDeRecursos([]);
                console.error("Error al cargar recursos:", error);
            }
        };

        cargarRecursos();
    }, []);
    useEffect(() => {
        const categorias = async () => {
            try {
                const categoria = await obtenerCategoria();
          
                const categoriaHabilitado = categoria.filter((cat) => cat.habilitado);
                setTiposDeSeguro(categoriaHabilitado);
            } catch (error) {
                setTiposDeSeguro([]);
                console.error("Error al cargar las categorias", error);
            }
        };

        categorias();
    }, []);

    useEffect(() => {
        const estado = async () => {
            try {
                const estado = await obtenerEstado();
              
                const estadoHabilitado = estado.filter((estado) => estado.habilitado);
                setEstado(estadoHabilitado);
            } catch (error) {
                setEstado([]);
                console.error("Error al cargar los estados", error);
            }
        };

        estado();
    }, []);

    useEffect(() => {
        if (datosIniciales) {
            reset(datosIniciales);
        }
    }, [datosIniciales, reset]);
    const handleFileSelect = (recursoId) => {
        setValue('recursoId_ImagenPrincipal', recursoId);
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

        let respuesta;
        if (data.id) {
            respuesta = await actualizarNoticia(data.id, data);
        } else {            
            data.recursoId_ImagenPrincipal=data.recursoId_ImagenPrincipal==""?null:data.recursoId_ImagenPrincipal
            respuesta = await crearNoticia(data);
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
                                    rules={{ required: 'Titulo de la noticia es requerido' }}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            autoFocus
                                            required
                                            margin="dense"
                                            label="Titulo de Noticia"
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
                                    name="tituloCorto"
                                    control={control}
                                    rules={{ required: 'Titulo corto es requerido' }}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            autoFocus
                                            required
                                            margin="dense"
                                            label="Titulo corto"
                                            type="text"
                                            fullWidth
                                            variant="standard"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error ? fieldState.error.message : ''}
                                        />
                                    )}
                                />
                            </div>
                            <FormGroup>
                                <Controller
                                    name="fecha"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Fecha"
                                            type="date"
                                            variant="standard"
                                            InputLabelProps={{
                                                shrink: true, 
                                            }}
                                            fullWidth
                                        />
                                    )}
                                />
                            </FormGroup>
                            <div>
                                <Box mt={2}>
                                    <FormControl fullWidth margin="dense">
                                        <FormLabel sx={{ marginBottom: '15px', fontSize: '12px' }}>Contenido</FormLabel>
                                        <Controller
                                            name="contenido"
                                            control={control}
                                            render={({ field }) => (
                                                <Editor value={field.value ?? ''} onChange={field.onChange} />
                                            )}
                                        />
                                    </FormControl>

                                </Box>

                            </div>
                            <div>
                                <Box mt={2}>
                                    <FormControl fullWidth margin="dense">
                                        <FormLabel sx={{ marginBottom: '15px', fontSize: '12px' }}>Resumen</FormLabel>
                                        <Controller
                                            name="resumen"
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
                                    name="parCategoriaId"
                                    control={control}
                                    rules={{ required: 'La categoria es requerida' }}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            select
                                            label="Categoria"
                                            value={field.value}
                                            onChange={field.onChange}

                                            variant="standard"
                                            fullWidth
                                            margin="dense"
                                            error={!!fieldState.error}
                                        >
                                            {categorias.map((tipo) => (
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
                                    name="parEstadoId"
                                    control={control}
                                    rules={{ required: 'El estado es requerido' }}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            select
                                            label="Estado"
                                            value={field.value}
                                            onChange={field.onChange}

                                            variant="standard"
                                            fullWidth
                                            margin="dense"
                                            error={!!fieldState.error}
                                        >
                                            {estado.map((tipo) => (
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
                                    name="etiquetas"
                                    control={control}
                                    rules={{ required: 'Las etiquetas son requeridas' }}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            autoFocus
                                            required
                                            margin="dense"
                                            label="Etiquetas"
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



const Noticias = () => {
    const [noticias, setNoticias] = useState([]);
    const [abrirModalFormularioPrincipal, setAbrirModalFormularioPrincipal] = useState(false);
    const [tituloModal, setTituloModal] = useState("Crear Noticia")
    const [FormDataPrincipal, setFormDataPrincipal] = useState(null);

    const [openConfirmationDelete, setOpenConfirmationDelete] = useState(false);
    const [idToDelete, setIdToDelete] = useState<number | null>(null);
    const { openSnackbar } = useSnackbar();
    const fetchNoticias = async () => {
        try {
            const data = await obtenerNoticias();            
            setNoticias(data.datos);
            console.log(data.datos)
        } catch (error) {
            setNoticias([]);
        }
    };
    useEffect(() => {
        fetchNoticias();
    }, []);
    const handleAbrirModalAgregarEditar = (id = null) => {
        if (id) {
            const elementoEditar = noticias.find(item => item.id === id);
            console.log(elementoEditar)
            setFormDataPrincipal({
                    id: elementoEditar.id ,
                    titulo: elementoEditar.titulo ,
                    tituloCorto: elementoEditar.tituloCorto ,
                    contenido: elementoEditar.contenido ,
                    resumen: elementoEditar.resumen,
                    recursoId_ImagenPrincipal: elementoEditar.recursoId_ImagenPrincipal ,
                    fecha: elementoEditar.fecha ,
                    parCategoriaId: elementoEditar.parCategoriaId ,
                    parEstadoId: elementoEditar.parEstadoId ,
                    etiquetas: elementoEditar.etiquetas ,
                    Orden: 0,
            });
            setTituloModal("Editar Noticia");
        }
        else {
            setFormDataPrincipal(null);
            setTituloModal("Crear Noticia")
        }
        setAbrirModalFormularioPrincipal(true);
    }
    const handleCerrarModalFormularioPrincipal = () => {
        setAbrirModalFormularioPrincipal(false);
    }
    const handleActualizarListaSeguros = async () => {
        await fetchNoticias();
    }




    const handleView = (id) => {
        router.push(`/noticias/${id}`);
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

            const respuesta = await eliminarNoticia(idToDelete);
            openSnackbar(respuesta.mensaje);

            handleConfirmDeleteClose();
            fetchNoticias();

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
 
    const mappedData = noticias.map(item => ({
        Id: item.id,
        Titulo: item.titulo,
        "Titulo Corto": item.tituloCorto,
        Resumen: item.resumen,
        Etiquetas: item.etiquetas,
        Fecha: item.fecha,
        Orden: item.orden,
        Categoria: item.parCategoria.nombre,
        Estado: item.parEstado.nombre
    }));

    return (
        <>
            <Head>
                <title>Noticias</title>
            </Head>
            <PageTitleWrapper>
                <TituloPagina
                    titulo="Noticias"
                    subtitulo="Administra la lista de noticias"
                    tituloBoton="Crear nueva noticia"
                    onCreate={() => handleAbrirModalAgregarEditar()

                    }
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
                        <TablaGenerica
                            data={mappedData}
                            actions={tableActions}
                        />
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
                content={`¿Estás seguro de que deseas eliminar la noticia?`}
            />
        </>
    );
};

Noticias.getLayout = (page) => (
    <SidebarLayout>{page}</SidebarLayout>
);

export default Noticias;
