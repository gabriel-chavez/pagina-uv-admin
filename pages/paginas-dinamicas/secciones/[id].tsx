import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Container,
  Grid,
  Card,
  CardHeader,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormControl,
  Box,
  Typography,
  FormLabel,
} from '@mui/material';

import SidebarLayout from '@/layouts/SidebarLayout';
import Head from 'next/head';
import TituloPagina from '@/components/TituloPagina';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';
import SeccionTable from '@/content/paginas/secciones/SeccionTable';
import { actualizarSeccion, crearSeccion, eliminarSeccion, obtenerPagina, obtenerSecciones, obtenerTipoSeccion } from '@/services/cmsService';
import ConfirmationDialog from '@/utils/Confirmacion';
import { useSnackbar } from '@/contexts/SnackbarContext';
import Editor from '@/utils/MdxEditor';
import ImageGallerySelect from '@/utils/ImageGallerySelect ';

export async function getServerSideProps(context) {
  try {
    const cookies = context.req.headers.cookie || '';
    const response = await obtenerTipoSeccion(cookies);
    const tipoSeccion = response.datos;
    const { id: paginaDinamicaId } = context.query;
    const response2 = await obtenerPagina(paginaDinamicaId,cookies);
    console.log(response2)
    const datosPagina = response2.datos;

    return {
      props: {
        tipoSeccion,
        datosPagina
      }
    };
  } catch (error) {
    return {
      props: {
        tipoSeccion: [],
        error: error.message
      }
    };
  }
}


const Seccion = ({ tipoSeccion,datosPagina  }) => {  

  const { openSnackbar } = useSnackbar();
  const [formData, setFormData] = useState(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [secciones, setSecciones] = useState([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { id: paginaDinamicaId } = router.query; 
  const [dialogTitle, setDialogTitle] = useState('Crear');
  const [openConfirmacionEliminacion, setOpenConfirmacionEliminacion] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState<number | null>(null);

  const fetchSecciones = async () => {
    try {
      const data = await obtenerSecciones(paginaDinamicaId);
      setSecciones(data.datos);
    } catch (error) {
      setSecciones([]);
    }
  };

  useEffect(() => {

    if (paginaDinamicaId) {
      fetchSecciones();
    }
  }, [paginaDinamicaId]);

  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      id: null,
      catTipoSeccionId: '',
      nombre: '',
      titulo: '',
      subTitulo: '',
      clase: '',
      paginaDinamicaId: paginaDinamicaId,
      orden: 0,
      habilitado: true,
    },
  });

  const handleModalAgregarEditar = (id = null, nombre = '', catTipoSeccionId = '', titulo = '', subTitulo = '', clase = '', orden = 0, habilitado = true) => {
    setValue('id', id);
    setValue('catTipoSeccionId', catTipoSeccionId);
    setValue('nombre', nombre);
    setValue('titulo', titulo);
    setValue('subTitulo', subTitulo);
    setValue('clase', clase);
    setValue('paginaDinamicaId', paginaDinamicaId);
    setValue('orden', orden);
    setValue('habilitado', habilitado);
    setDialogTitle(id ? 'Editar' : 'Crear');
    setOpen(true);
  };

  const handleClose = (event: React.SyntheticEvent, reason?: string) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return;
    }
    setOpen(false);
    reset();
  };

  const onSubmit = (datos) => {
    setFormData(datos);
    setOpenConfirmation(true);
  };

  const handleConfirmClose = () => {
    setOpenConfirmation(false);
  };

  const handleConfirmSubmit = async () => {

    let respuesta;
    if (formData && formData.id) {
      respuesta = await actualizarSeccion(formData.id, formData);
    } else {
      respuesta = await crearSeccion(formData);
    }

    openSnackbar(respuesta.mensaje);
    handleConfirmClose();
    setOpen(false);
    reset();
    fetchSecciones(); // Actualiza la lista de secciones después de crear o actualizar


  };

  const handleVerDatos = (id) => {
    router.push(`/paginas-dinamicas/secciones/datos/${id}`);
  };
  const handleConfirmarEliminacionOpen = (id: number) => {
    setIdAEliminar(id); // Establece el ID para eliminar
    setOpenConfirmacionEliminacion(true);
  };
  const handleConfirmarEliminacionClose = () => {
    setOpenConfirmacionEliminacion(false);
    setIdAEliminar(null);
  };
  const handleConfirmarEliminacionSubmit = async () => {
    if (idAEliminar !== null) {

      const respuesta = await eliminarSeccion(idAEliminar);
      openSnackbar(respuesta.mensaje);
      reset();
      handleConfirmarEliminacionClose();
      fetchSecciones();

    }
  };

  return (
    <>
      <Head>
        <title>Secciones</title>
      </Head>
      <PageTitleWrapper>
        <TituloPagina
          titulo="Secciones"
          subtitulo={
            <>
              Administra las secciones de la página{' '}
              <span style={{ fontWeight: 'bold' }}>{datosPagina.nombre}</span>
            </>
          }
          tituloBoton="Agregar sección"
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
              <CardHeader title="Lista de secciones" />
              <Divider />
              <SeccionTable
                secciones={secciones}
                onEdit={(id, nombre, tipoSeccion, titulo, subTitulo, clase, orden, habilitado) => handleModalAgregarEditar(id, nombre, tipoSeccion, titulo, subTitulo, clase, orden, habilitado)}
                onView={handleVerDatos}
                btnEliminar={(id) => handleConfirmarEliminacionOpen(id)}
              />
            </Card>
          </Grid>
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
          <DialogTitle>{dialogTitle} Sección</DialogTitle>
          <DialogContent sx={{ paddingBottom: '60px' }}>
            <DialogContentText>
              Ingresa los datos del formulario para agregar una sección
            </DialogContentText>

            <Controller
              name="nombre"
              control={control}
              rules={{ required: 'Nombre de la sección es requerido' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  autoFocus
                  margin="dense"
                  label="Nombre de sección"
                  type="text"
                  fullWidth
                  variant="standard"
                  error={!!fieldState.error}
                  helperText={fieldState.error ? fieldState.error.message : ''}
                />
              )}
            />

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
                <FormLabel sx={{ marginBottom: '15px', fontSize: '12px' }}>Subtítulo</FormLabel>
                <Controller
                  name="subTitulo"
                  control={control}
                  render={({ field }) => (
                    <Editor value={field.value ?? ''} onChange={field.onChange} />
                  )}
                />
              </FormControl>
            </Box>

            <FormControl fullWidth margin="dense">
              <FormLabel sx={{ marginBottom: '15px', fontSize: '12px' }}>Tipo de sección</FormLabel>
              <Controller
                name="catTipoSeccionId"
                control={control}
                rules={{ required: 'Tipo de Sección es requerido' }}
                render={({ field, fieldState }) => ( // Agrega fieldState en el destructuring
                  <>
                    <ImageGallerySelect
                      value={field.value}
                      onChange={field.onChange}
                      options={tipoSeccion}
                    />
                    {fieldState.error && (
                      <Typography color="error">{fieldState.error.message}</Typography>
                    )}
                  </>
                )}
              />
            </FormControl>

            <Controller
              name="clase"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  margin="dense"
                  label="Clase"
                  type="text"
                  fullWidth
                  variant="standard"
                  error={!!fieldState.error}
                  helperText={fieldState.error ? fieldState.error.message : ''}
                />
              )}
            />

            <FormGroup>
              <FormControlLabel
                control={
                  <Controller
                    name="habilitado"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        {...field}
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    )}
                  />
                }
                label="Habilitado"
              />
            </FormGroup>
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
        content={`¿Estás seguro de que deseas ${dialogTitle.toLowerCase()} la sección?`}
      />
      <ConfirmationDialog
        open={openConfirmacionEliminacion}
        handleClose={handleConfirmarEliminacionClose}
        handleConfirm={handleConfirmarEliminacionSubmit}
        title="Confirmar eliminación"
        content={`¿Estás seguro de que deseas eliminar la sección?`}
      />
    </>
  );
};

Seccion.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default Seccion;
