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
} from '@mui/material';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import SidebarLayout from '@/layouts/SidebarLayout';
import Head from 'next/head';
import TituloPagina from '@/components/TituloPagina';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';
import SeccionTableConjuntoDatos from '@/content/paginas/secciones/SeccionTableConjuntoDatos';
import Editor from '@/utils/MdxEditor';
import { actualizarDatos, crearDatos, eliminarDatos, obtenerDatosPorSeccion } from '@/services/cmsService';
import ConfirmationDialog from '@/utils/Confirmacion';
import { useSnackbar } from '@/contexts/SnackbarContext';
import VisorDeArchivos from '@/utils/VisorDeArchivos';
const imageData = [

  {
    "nombre": "baner prueba",
    "catTipoRecursoId": 1,
    "recursoEscritorio": "/assets/images/backgrounds/page-header-bg.jpg",
    "bannerPagina": [],
    "id": 1
  },
  {
    "nombre": "Compra soat",
    "catTipoRecursoId": 1,
    "recursoEscritorio": "/assets/images/soat/compra-web.doc",
    "bannerPagina": [],
    "id": 2
  },
  {
    "nombre": "Descarga App",
    "catTipoRecursoId": 1,
    "recursoEscritorio": "/assets/images/soat/unividaapp.jpg",
    "bannerPagina": [],
    "id": 3
  },
  {
    "nombre": "Puntos de venta",
    "catTipoRecursoId": 1,
    "recursoEscritorio": "/assets/images/soat/puntos.jpg",
    "bannerPagina": [],
    "id": 4
  },
  {
    "nombre": "Redes sociales",
    "catTipoRecursoId": 1,
    "recursoEscritorio": "/assets/images/soat/facebook-whatsapp.jpg",
    "bannerPagina": [],
    "id": 5
  },
  {
    "nombre": "Precios SOAT",
    "catTipoRecursoId": 1,
    "recursoEscritorio": "/assets/images/soat/precios-soat.jpg",
    "bannerPagina": [],
    "id": 6
  },
  {
    "nombre": "Datos SOAT",
    "catTipoRecursoId": 1,
    "recursoEscritorio": "/assets/images/soat/datos-vehiculo.jpg",
    "bannerPagina": [],
    "id": 7
  },
  {
    "nombre": "Comprobante SOAT",
    "catTipoRecursoId": 1,
    "recursoEscritorio": "/assets/images/soat/comprobante-soat.jpg",
    "bannerPagina": [],
    "id": 8
  }

];
const Seccion = () => {
  const { openSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
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

  const selectedRecursoId = watch('recursoId'); // Obtenemos el valor de recursoId usando watch

  const fetchSecciones = async () => {
    try {
      const data = await obtenerDatosPorSeccion(seccionId);
      setDatos(data);
    } catch (error) {
      console.error('Error al obtener las secciones:', error);
    }
  };

  useEffect(() => {
    if (seccionId) {
      fetchSecciones();
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
  const handleEliminar = async (id) => {
   
    try {
      let respuesta;
      if (id) {
        respuesta = await eliminarDatos(id);
        console.log(respuesta)

        openSnackbar(respuesta ? respuesta.mensaje : 'Operación exitosa');
        handleConfirmClose();
        // setOpen(false);
        reset();
        fetchSecciones();
      }
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      openSnackbar('Error al guardar los datos', 'error');
    }
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

  const handleConfirmSubmit = async () => {
    try {
      let respuesta;
      if (formData && formData.id) {
        respuesta = await actualizarDatos(formData.id, formData);
      } else {
        respuesta = await crearDatos(formData);
      }
      openSnackbar(respuesta ? respuesta.mensaje : 'Operación exitosa');
      handleConfirmClose();
      setOpen(false);
      reset();
      fetchSecciones();
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      openSnackbar('Error al guardar los datos', 'error');
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
    setValue('recursoId', recursoId); // Actualiza el valor de recursoId en el formulario
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
                  btnEliminar={(id) => handleEliminar(id)}
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
              archivos={imageData}
              onSelect={handleFileSelect}
              selectedRecursoId={selectedRecursoId} // Selección inicial basada en el valor de useForm
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
    </>
  );
};

Seccion.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default Seccion;
