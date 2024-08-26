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
  MenuItem,
  FormControl,
} from '@mui/material';

import SidebarLayout from '@/layouts/SidebarLayout';
import Head from 'next/head';
import TituloPagina from '@/components/TituloPagina';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';
import SeccionTable from '@/content/paginas/secciones/SecionTable';
import { actualizarSeccion, crearSeccion, obtenerSecciones, obtenerTipoSeccion } from '@/services/cmsService';
import ConfirmationDialog from '@/utils/Confirmacion';
import { useSnackbar } from '@/contexts/SnackbarContext';

export async function getServerSideProps() {
  try {
    const tipoSeccion = await obtenerTipoSeccion();
    return {
      props: {
        tipoSeccion
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

const Seccion = ({ tipoSeccion }) => {
  const { openSnackbar } = useSnackbar();
  const [formData, setFormData] = useState(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [secciones, setSecciones] = useState([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { id: paginaDinamicaId } = router.query; // Obtener el parámetro de la ruta
  const [dialogTitle, setDialogTitle] = useState('Crear');

  const fetchSecciones = async () => {
    try {
      const data = await obtenerSecciones(paginaDinamicaId);
      setSecciones(data);
    } catch (error) {
      console.error('Error al obtener las secciones:', error);
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
    try {
      let respuesta;
      if (formData && formData.id) {
        respuesta = await actualizarSeccion(formData.id, formData);
      } else {
        respuesta = await crearSeccion(formData);
      }
     
      openSnackbar(respuesta ? respuesta.mensaje : 'Operación exitosa');
      handleConfirmClose();
      setOpen(false);
      reset();
      fetchSecciones(); // Actualiza la lista de secciones después de crear o actualizar

    } catch (error) {
      console.error("Error al guardar la sección:", error);
      openSnackbar('Error al guardar la sección', 'error');
    }
  };



  const handleVerDatos = (id) => {
    router.push(`/paginas/secciones/datos/${id}`);
  };

  return (
    <>
      <Head>
        <title>Secciones</title>
      </Head>
      <PageTitleWrapper>
        <TituloPagina
          titulo="Secciones"
          subtitulo="Administra las secciones de la página SOAT"
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
              />
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <DialogTitle>{dialogTitle} Sección</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Ingresa los datos del formulario para agregar una sección
            </DialogContentText>
            <FormControl fullWidth margin="dense">
              <Controller
                name="catTipoSeccionId"
                control={control}
                rules={{ required: 'Tipo de Sección es requerido' }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    select
                    label="Tipo de Sección"
                    variant="standard"
                    error={!!fieldState.error}
                    helperText={fieldState.error ? fieldState.error.message : ''}
                  >
                    {tipoSeccion.length > 0 ? (
                      tipoSeccion.map((tipo) => (
                        <MenuItem key={tipo.id} value={tipo.id}>
                          {tipo.nombre}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No hay tipos de sección disponibles</MenuItem>
                    )}
                  </TextField>
                )}
              />
            </FormControl>

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

            <Controller
              name="titulo"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  margin="dense"
                  label="Título"
                  type="text"
                  fullWidth
                  variant="standard"
                  error={!!fieldState.error}
                  helperText={fieldState.error ? fieldState.error.message : ''}
                />
              )}
            />

            <Controller
              name="subTitulo"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  margin="dense"
                  label="Subtítulo"
                  type="text"
                  fullWidth
                  variant="standard"
                  error={!!fieldState.error}
                  helperText={fieldState.error ? fieldState.error.message : ''}
                />
              )}
            />

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
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </DialogActions>
        </form>
      </Dialog>
      <ConfirmationDialog
        open={openConfirmation}
        handleClose={handleConfirmClose}
        handleConfirm={handleConfirmSubmit}
        title="Confirmar"
        content={`¿Estás seguro de que deseas ${dialogTitle.toLowerCase()} la sección?`}
      />
    </>
  );
};

Seccion.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default Seccion;
