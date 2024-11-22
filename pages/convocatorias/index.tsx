import Head from 'next/head';
import TituloPagina from '@/components/TituloPagina';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';
import SidebarLayout from '@/layouts/SidebarLayout';
import { Grid, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import TablaGenerica from '@/components/Tabla/TablaGenerica';
import { useState, useEffect } from 'react';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { Container } from '@mui/material';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

import { obtenerConvocatorias } from '@/services/convocatoriasService';
import { agregarConvocatoria } from '@/services/convocatoriasService';
import { actualizarConvocatoria } from '@/services/convocatoriasService';
import { eliminarConvocatoria } from '@/services/convocatoriasService';

const convocatoriasMock = [
    {
        id: 1,
        codigo: 'CONV-001',
        nombre: 'Convocatoria para Desarrollador Web',
        estado: 'Abierta',
        fechaInicio: '2024-11-01',
        fechaTermino: '2024-11-30',
        postulantes: 15,
        fechaCreacion: '2024-10-01',
        descripcion: 'Descripción de la convocatoria 1'
    },
    {
        id: 2,
        codigo: 'CONV-002',
        nombre: 'Convocatoria para Analista de Datos',
        estado: 'Cerrada',
        fechaInicio: '2024-10-01',
        fechaTermino: '2024-10-15',
        postulantes: 30,
        fechaCreacion: '2024-09-15',
        descripcion: 'Descripción de la convocatoria 2'
    }
];

const Convocatorias = () => {
    const [convocatorias, setConvocatorias] = useState([]);
    const [abrirModalFormularioPrincipal, setAbrirModalFormularioPrincipal] = useState(false);
    const [tituloModal, setTituloModal] = useState("Crear Convocatoria");
    const [formDataPrincipal, setFormDataPrincipal] = useState<any>(null); 
    const [openConfirmationDelete, setOpenConfirmationDelete] = useState(false);
    const [idToDelete, setIdToDelete] = useState<number | null>(null);
    
    const [selectedConvocatoria, setSelectedConvocatoria] = useState(null);
    const { openSnackbar } = useSnackbar();
    const router = useRouter();

    const fetchConvocatorias = async () => {
        try {
            const data = await obtenerConvocatorias();     
            console.log("datos requeridos: " + data);       
            setConvocatorias(data.datos);
            console.log(data.datos)
        } catch (error) {
            setConvocatorias([]);
        }
    };
    // useEffect(() => {
    //     fetchConvocatorias();
    // }, []);

    useEffect(() => {
        setConvocatorias(convocatoriasMock);
    }, []);

    const handleAbrirModalAgregarEditar = (id: number | null = null) => {
        if (id !== null) {
            const elementoEditar = convocatorias.find(item => item.id === id);
            if (elementoEditar) {
                setFormDataPrincipal({
                    ...elementoEditar,
                    id: elementoEditar.id,
                    codigo: elementoEditar.codigo,
                    fechaInicio: elementoEditar.fechaInicio, 
                    fechaTermino: elementoEditar.fechaTermino,
                });
                setTituloModal("Editar Convocatoria");
            }
        } else {
            setFormDataPrincipal({
                id: 0,
                codigo: '',
                nombre: '',
                estado: '',
                fechaInicio: '',
                fechaTermino: '',
                postulantes: 0,
                descripcion: '',
            }); // Limpiar formulario si es creación
            setTituloModal("Crear Convocatoria");
        }
        setAbrirModalFormularioPrincipal(true);
    };

    const handleCerrarModalFormularioPrincipal = () => {
        setAbrirModalFormularioPrincipal(false);
    };

    const handleConfirmDeleteOpen = (id: number) => {
        setIdToDelete(id);
        setOpenConfirmationDelete(true);
    };

    const handleView = (id: number) => {
        console.log("ID recibido:", id);  
        if (id) {
            router.push(`/convocatorias/${id}`);
        } else {
            console.error("El ID es undefined");
        }
    };
    
    const tableActions = [
        {
            label: 'Editar',
            icon: <EditIcon fontSize="small" />,
            onClick: handleAbrirModalAgregarEditar
        },
        {
            label: 'Ver Datos',
            icon: <VisibilityIcon fontSize="small" />,
            onClick: (id: number) => handleView(id)  
        },
        {
            label: 'Eliminar',
            icon: <DeleteIcon fontSize="small" />,
            onClick: handleConfirmDeleteOpen
        }
    ];

    const handleGuardarConvocatoria = async () => {
        // Obtener los datos del formulario
        const {
            codigo,
            nombre,
            estado, // Asumimos que este campo corresponde a parEstadoConvocatoriaId
            fechaInicio,
            fechaTermino,
            descripcion,
            //postulantes, // Asumimos que este campo es un valor que no se necesita para la solicitud, como en tu ejemplo
        } = formDataPrincipal;
    
        // Estructurar los datos según la API
        const datos = {
            codigo,
            nombre,
            parEstadoConvocatoriaId: estado,  // Asumimos que 'estado' corresponde al ID del estado de la convocatoria
            fechaInicio,
            fechaFin: fechaTermino,  // Asumimos que 'fechaTermino' es equivalente a 'fechaFin'
            puntajeMinimo: 0,  // Si hay un valor predeterminado, ajusta según corresponda
            puntajeTotal: 0,   // Si hay un valor predeterminado, ajusta según corresponda
            descripcion,
        };
    
        try {
            let result;
            if (selectedConvocatoria?.id) {
                // Si ya existe, actualizar la convocatoria
                result = await actualizarConvocatoria(selectedConvocatoria.id, datos);
            } else {
                // Si no existe, agregar una nueva convocatoria
                result = await agregarConvocatoria(datos);
            }
    
            // Si la respuesta es exitosa, mostrar mensaje y actualizar la lista
            Swal.fire({
                title: '¡Éxito!',
                text: result.mensaje,  // Asumimos que 'mensaje' está en la respuesta
                icon: 'success',
                confirmButtonText: 'Aceptar',
            }).then(async () => {
                // Cerrar el modal después de guardar
                handleCerrarModalFormularioPrincipal();
    
                // Obtener las convocatorias actualizadas
                const convocatorias = await obtenerConvocatorias();
                setConvocatorias(convocatorias);  // Asume que tienes un estado para las convocatorias
            });
        } catch (error) {
            console.error('Error al guardar la convocatoria:', error);
    
            // Mostrar mensaje de error
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al guardar la convocatoria.',
                icon: 'error',
                confirmButtonText: 'Intentar nuevamente',
            }).then(async () => {
                handleCerrarModalFormularioPrincipal();
    
                // Obtener las convocatorias actualizadas (si es necesario)
                const convocatorias = await obtenerConvocatorias();
                setConvocatorias(convocatorias);
            });
        }
    };
    
    const handleEliminaConvocatoria = async () => {
        try {
            const result = await eliminarConvocatoria(selectedConvocatoria?.id);

            Swal.fire({
                title: '¡Éxito!',
                text: result.mensaje || 'Convocatoria eliminada correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar',
            }).then(async () => {
                //setShowConfirmModal(false);
                setConvocatorias(null);

                const data = await obtenerConvocatorias();       
                setConvocatorias(data.datos);
            });
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al eliminar la convocatoria.',
                icon: 'error',
                confirmButtonText: 'Intentar nuevamente',
            });
        }
    };

    const mappedData = convocatorias.map(item => ({
        Id: item.id,  
        "Código": item.codigo,
        Nombre: item.nombre,
        Estado: item.estado,
        "Fecha Inicio": item.fechaInicio,
        "Fecha Término": item.fechaTermino,
        Postulantes: item.postulantes,
        "Fecha Creación": item.fechaCreacion
    }));

    return (
        <>
            <Head>
                <title>Convocatorias de Talento Humano</title>
            </Head>
            <PageTitleWrapper>
                <TituloPagina
                    titulo="Convocatorias de Talento Humano"
                    subtitulo="Administra la lista de convocatorias"
                    tituloBoton="Crear nueva convocatoria"
                    onCreate={() => handleAbrirModalAgregarEditar()}
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

            {/* Modal para agregar/editar convocatoria */}
            <Dialog
                open={abrirModalFormularioPrincipal}
                onClose={handleCerrarModalFormularioPrincipal}
                sx={{
                    '& .MuiDialog-paper': {
                        width: '90%', 
                        maxWidth: 'none', 
                    }
                }}
            >
                <DialogTitle>{tituloModal}</DialogTitle>
                <DialogContent>
                    <Box component="form" noValidate autoComplete="off">
                        <Grid container spacing={2}>
                            {/* Primera columna */}
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    margin="dense"
                                    label="Código"
                                    fullWidth
                                    variant="outlined"
                                    value={formDataPrincipal?.codigo || ''}
                                    onChange={(e) => setFormDataPrincipal({ ...formDataPrincipal, codigo: e.target.value })}
                                />
                                <TextField
                                    margin="dense"
                                    label="Nombre"
                                    fullWidth
                                    variant="outlined"
                                    value={formDataPrincipal?.nombre || ''}
                                    onChange={(e) => setFormDataPrincipal({ ...formDataPrincipal, nombre: e.target.value })}
                                />
                                <TextField
                                    margin="dense"
                                    label="Descripción"
                                    fullWidth
                                    variant="outlined"
                                    type="text"
                                    multiline
                                    rows={4}
                                    value={formDataPrincipal?.descripcion || ''}
                                    onChange={(e) => setFormDataPrincipal({ ...formDataPrincipal, descripcion: e.target.value })}
                                />
                            </Grid>

                            {/* Segunda columna */}
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    margin="dense"
                                    label="Estado"
                                    fullWidth
                                    variant="outlined"
                                    value={formDataPrincipal?.estado || ''}
                                    onChange={(e) => setFormDataPrincipal({ ...formDataPrincipal, estado: e.target.value })}
                                />
                                <TextField
                                    margin="dense"
                                    label="Fecha Inicio"
                                    fullWidth
                                    variant="outlined"
                                    type="date"
                                    value={formDataPrincipal?.fechaInicio || ''}
                                    onChange={(e) => setFormDataPrincipal({ ...formDataPrincipal, fechaInicio: e.target.value })}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                                <TextField
                                    margin="dense"
                                    label="Fecha Término"
                                    fullWidth
                                    variant="outlined"
                                    type="date"
                                    value={formDataPrincipal?.fechaTermino || ''}
                                    onChange={(e) => setFormDataPrincipal({ ...formDataPrincipal, fechaTermino: e.target.value })}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                                <TextField
                                    margin="dense"
                                    label="Vacantes"
                                    fullWidth
                                    variant="outlined"
                                    type="number"
                                    value={formDataPrincipal?.postulantes || 0}
                                    onChange={(e) => setFormDataPrincipal({ ...formDataPrincipal, postulantes: parseInt(e.target.value) })}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCerrarModalFormularioPrincipal} color="primary">Cancelar</Button>
                    <Button onClick={handleGuardarConvocatoria} color="primary">Guardar</Button>
                </DialogActions>
            </Dialog>

            {/* Confirmación de eliminación */}
            <Dialog
                open={openConfirmationDelete}
                onClose={() => setOpenConfirmationDelete(false)}
            >
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <Typography>¿Estás seguro de que deseas eliminar esta convocatoria?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirmationDelete(false)} color="primary">Cancelar</Button>
                    <Button onClick={handleEliminaConvocatoria} color="secondary">Eliminar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

Convocatorias.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Convocatorias;
