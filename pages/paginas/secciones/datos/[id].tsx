import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Container,
  Grid,
  Card,
  CardHeader,
  Divider,
  Box,
  FormControl,
  FormLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';

import SidebarLayout from '@/layouts/SidebarLayout';
import Head from 'next/head';
import TituloPagina from '@/components/TituloPagina';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';
import SeccionTableConjuntoDatos from '@/content/paginas/secciones/SeccionTableConjuntoDatos';
import Editor from '@/utils/MdxEditor';
import {
  actualizarDatos,
  crearDatos,
  eliminarDatos,
  obtenerDatosPorSeccion,
  obtenerRecursos,
  obtenerSeccion
} from '@/services/cmsService';
import ConfirmationDialog from '@/utils/Confirmacion';
import { useSnackbar } from '@/contexts/SnackbarContext';
import VisorDeArchivos from '@/utils/VisorDeArchivos';

interface CatTipoSeccion {
  nombre: string;
  descripcion: string;
  imagenSeccion: string;
  imagenSeccionGuia: string;
  habilitado: boolean;
  id: number;
}

interface Seccion {
  catTipoSeccionId: number;
  nombre: string;
  titulo: string;
  subTitulo: string;
  clase: string;
  paginaDinamicaId: number;
  orden: number;
  habilitado: boolean;
  catTipoSeccion: CatTipoSeccion;
  id: number;
  fechaModificacion: string;
}

const Seccion = () => {
  const { openSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Seccion | null>(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openConfirmationDelete, setOpenConfirmationDelete] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [listaDeRecursos, setListaDeRecursos] = useState([]);
  const [informacionSeccion, setInformacionSeccion] = useState<Seccion | null>(null);
  const [datos, setDatos] = useState([]);
  const router = useRouter();
  const { id: seccionId } = router.query;

  const { control, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      id: 0,
      datoTexto: '',
      datoFechaHora: new Date(),
      datoUrl: '',
      recursoId: null,
      seccionId: seccionId,
      fila: 0,
      columna: 0
    },
  });

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

  const fetchDatosPorSeccion = async () => {
    try {
      const data = await obtenerDatosPorSeccion(seccionId);
      setDatos(data.datos);
    } catch (error) {
      setDatos([]);
    }
  };

  const cargarInformacionSeccion = async () => {
    try {
      const seccion = await obtenerSeccion(seccionId);
      setInformacionSeccion(seccion.datos);
    } catch (error) {
      setInformacionSeccion([]);
    }
  };

  useEffect(() => {
    if (seccionId) {
      fetchDatosPorSeccion();
      cargarInformacionSeccion();
    }
  }, [seccionId]);

  const asignarDatos = (initialValues) => {
    setValue('datoTexto', initialValues.datoTexto || '');
    setValue('datoFechaHora', initialValues.datoFechaHora || new Date());
    setValue('datoUrl', initialValues.datoUrl || '');
    setValue('recursoId', initialValues.recursoId || null);
    setValue('seccionId', seccionId);
    setValue('fila', initialValues.fila || 0);
    setValue('columna', initialValues.columna || 0);
    setValue('id', initialValues.id || 0);
  };

  const handleModalCrearEditar = (id, fila) => {
    if (id) {
      for (let i = 0; i < datos.length; i++) {
        const itemAEditar = datos[i].find(item => item.id === id);
        if (itemAEditar) {
          asignarDatos(itemAEditar);
          break;
        }
      }
    } else {
      let columna = obtenerColumna(fila);
      setValue('columna', columna);
      setValue('fila', fila);
      setValue('seccionId', seccionId);
    }

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (datos) => {
    if (datos.recursoId === '') {
      datos.recursoId = null;
    }
    setFormData(datos);
    setOpenConfirmation(true);
  };

  const handleConfirmClose = () => {
    setOpenConfirmation(false);
  };

  const handleConfirmDeleteClose = () => {
    setOpenConfirmationDelete(false);
    setIdToDelete(null); // Resetea el ID después de cerrar el diálogo
  };

  const handleConfirmDeleteOpen = (id: number) => {
    setIdToDelete(id); // Establece el ID para eliminar
    setOpenConfirmationDelete(true);
  };

  const handleConfirmSubmit = async () => {

    let respuesta;
    if (formData && formData.id) {
      respuesta = await actualizarDatos(formData.id, formData);
    } else {
      respuesta = await crearDatos(formData);
    }
    openSnackbar(respuesta.mensaje);
    handleConfirmClose();
    setOpen(false);
    reset();
    fetchDatosPorSeccion();

  };

  const handleConfirmDeleteSubmit = async () => {
    if (idToDelete !== null) {

      const respuesta = await eliminarDatos(idToDelete);
      openSnackbar(respuesta.mensaje);
      reset();
      handleConfirmDeleteClose();
      fetchDatosPorSeccion();

    }
  };

  const obtenerColumna = (fila) => {
    const rowArray = datos.find(array => array.some(item => item.fila === fila));
    if (!rowArray) return 0;
    let maxColumn = -1;
    rowArray.forEach(item => {
      if (item.columna > maxColumn) {
        maxColumn = item.columna;
      }
    });
    return maxColumn + 1;
  };

  const handleFileSelect = (recursoId) => {
    setValue('recursoId', recursoId);
  };

  return (
    <>
      <Head>
        <title>Páginas dinámicas</title>
      </Head>
      <PageTitleWrapper>
        <TituloPagina
          titulo="Conjunto de datos"
          subtitulo="Agrega los datos de la sección"
          tituloBoton="Agregar conjunto de datos"
          onCreate={() => handleModalCrearEditar(null, datos.length)}
        />
      </PageTitleWrapper>

      <Container maxWidth="lg">
        <Grid item xs={12} sx={{ mb: 2 }}>
          <Card>
            <List>
              <ListItem sx={{ p: 3 }}>
                <ListItemAvatar>
                  <ViewQuiltIcon fontSize="large" />
                </ListItemAvatar>
                <ListItemText
                  primaryTypographyProps={{ variant: 'h5', gutterBottom: true }}
                  secondaryTypographyProps={{
                    variant: 'subtitle2',
                    lineHeight: 1
                  }}
                  primary={informacionSeccion?.catTipoSeccion?.nombre || 'Nombre no disponible'}
                  secondary={informacionSeccion?.catTipoSeccion?.descripcion || 'Descripción no disponible'}
                />
                <Button
                  component="a"
                  href={informacionSeccion?.catTipoSeccion?.imagenSeccionGuia
                    ? `/${informacionSeccion.catTipoSeccion.imagenSeccionGuia.replace(/\\/g, '/')}`
                    : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  color="secondary"
                  onClick={(e) => {
                    if (!informacionSeccion?.catTipoSeccion?.imagenSeccionGuia) {
                      e.preventDefault();
                      alert('No hay imagen disponible para mostrar.');
                    }
                  }}
                >
                  Ver ejemplo
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          {datos.map((fila, filaIndex) => (
            <Grid item xs={12} key={filaIndex}>
              <Card>
                <CardHeader title={`Conjunto de datos ${filaIndex + 1}`} />
                <Divider />
                <SeccionTableConjuntoDatos
                  conjuntosDatos={fila}
                  btnEditarAgregar={(id) => handleModalCrearEditar(id, filaIndex)}
                  btnEliminar={(id) => handleConfirmDeleteOpen(id)}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer />
      <Dialog
        open={open}
        maxWidth="md"
        fullWidth={true}
        onClose={handleClose}
      >
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <DialogTitle>Agregar conjunto de datos</DialogTitle>
          <DialogContent sx={{ paddingBottom: '60px' }}>
            <DialogContentText>
              Ingresa los datos del formulario para agregar una sección
            </DialogContentText>

            <Box mt={2}>
              <FormControl fullWidth margin="dense">
                <FormLabel sx={{ marginBottom: '15px', fontSize: '12px' }}>Texto</FormLabel>
                <Controller
                  name="datoTexto"
                  control={control}
                  render={({ field }) => (
                    <Editor value={field.value ?? ''} onChange={field.onChange} />
                  )}
                />
              </FormControl>

            </Box>
            <Controller
              name="datoUrl"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value ?? ''}
                  margin="dense"
                  label="Url"
                  fullWidth
                  variant="standard"
                />
              )}
            />
            <VisorDeArchivos
              archivos={listaDeRecursos}
              onSelect={handleFileSelect}
              selectedRecursoId={selectedRecursoId}
            />
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
              <Button onClick={handleClose}>Cancelar</Button>
              <Button type="submit">Guardar</Button>
            </DialogActions>
          </Box>
        </form>
      </Dialog>
      <ConfirmationDialog
        open={openConfirmation}
        handleClose={handleConfirmClose}
        handleConfirm={handleConfirmSubmit}
        title="Confirmar"
        content={`¿Estás seguro de que deseas agregar una fila?`}
      />
      <ConfirmationDialog
        open={openConfirmationDelete}
        handleClose={handleConfirmDeleteClose}
        handleConfirm={handleConfirmDeleteSubmit}
        title="Confirmar eliminación"
        content={`¿Estás seguro de que deseas eliminar esta fila?`}
      />
    </>
  );
};

Seccion.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default Seccion;
