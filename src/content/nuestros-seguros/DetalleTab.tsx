import { actualizarDetalle, crearDetalle, eliminarDetalle, obtenerDetallePorSeguro } from '@/services/cmsService';
import MarkdownRenderer from '@/utils/MarkdownRenderer';
import {
  Box,
  Typography,
  Card,
  Grid,
  ListItem,
  List,
  Menu,
  MenuItem,
  IconButton,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  FormControl,
  FormLabel,
  DialogActions,
} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useEffect, useState } from 'react';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from '@/contexts/SnackbarContext';
import Editor from '@/utils/MdxEditor';
import ConfirmationDialog from '@/utils/Confirmacion';

interface Detalle {
  seguroId: number;
  titulo: string;
  respuesta: string;
  orden: number;
  id: number;
}

interface SeguroTabProps {
  id: number;
}
const FormularioCrearEditar = ({ abrirModal, cerrarModal, tituloModal, datosIniciales, confirmacion }) => {
  const { control, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      id: datosIniciales?.id || null,
      titulo: datosIniciales?.titulo || '',
      respuesta: datosIniciales?.respuesta || '',
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
      respuesta = await actualizarDetalle(data.id, data);
    } else {
      respuesta = await crearDetalle(data);
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
                <Box mt={2}>
                  <FormControl fullWidth margin="dense">
                    <FormLabel sx={{ marginBottom: '15px', fontSize: '12px' }}>Titulo</FormLabel>
                    <Controller
                      name="titulo"
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
                    <FormLabel sx={{ marginBottom: '15px', fontSize: '12px' }}>Respuesta</FormLabel>
                    <Controller
                      name="respuesta"
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

const DetalleTab: React.FC<SeguroTabProps> = ({ id }) => {
  const [detalle, setDetalle] = useState<Detalle[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDetalleId, setSelectedDetalleId] = useState<number | null>(null);
  const [formDataDetalle, setFormDataDetalle] = useState(null);
  const [tituloModal, setTituloModal] = useState("Crear")
  const [abrirModalFormularioCrearEditarDetalle, setAbrirModalFormularioCrearEditarDetalle] = useState(false);

  const [openConfirmationDelete, setOpenConfirmationDelete] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const { openSnackbar } = useSnackbar();

  const fetchDetallePorSeguro = async () => {
    try {
      const data = await obtenerDetallePorSeguro(id);
      setDetalle(data.datos);
    } catch (error) {
      setDetalle([]);
    }
  };

  useEffect(() => {
    if (!isNaN(id)) {
      fetchDetallePorSeguro();
    }
  }, [id]);

  const handleClick = (event: React.MouseEvent<HTMLElement>, idDetalle: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedDetalleId(idDetalle);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedDetalleId(null);
  };

  const handleAbrirModalAgregarEditar = (idDetalle = null) => {
    if (idDetalle) {
      const elementoEditar = detalle.find(item => item.id === idDetalle);
      setFormDataDetalle({
        id: elementoEditar.id,
        titulo: elementoEditar.titulo,
        respuesta: elementoEditar.respuesta,
        orden: elementoEditar.orden,
        seguroId: elementoEditar.seguroId
      });
      setTituloModal("Editar");
    }
    else {
      setFormDataDetalle({
        seguroId: id
      });
      setTituloModal("Crear")
    }
    setAbrirModalFormularioCrearEditarDetalle(true);
    setAnchorEl(null);
  }
  const handleConfirmDeleteClose = () => {
    setOpenConfirmationDelete(false);
    setIdToDelete(null);
  };

  const handleDelete = (idDetalle: number) => {
    setIdToDelete(idDetalle); // Establece el ID para eliminar
    setOpenConfirmationDelete(true);
  };


  const handleConfirmDeleteSubmit = async () => {
    if (idToDelete !== null) {
      const respuesta = await eliminarDetalle(idToDelete);
      openSnackbar(respuesta.mensaje);
      handleConfirmDeleteClose();
      fetchDetallePorSeguro();
    }
  };
  const handleCerrarModalFormularioCrearEditarDetalle = () => {
    setAbrirModalFormularioCrearEditarDetalle(false);
  }
  const handleActualizarDetalle = async () => {
    await fetchDetallePorSeguro();
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box pb={2} display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h3">Detalle del seguro</Typography>
            <Typography variant="subtitle2">
              Registra o edita el detalle del seguro
            </Typography>
          </Box>
          <Button variant="contained" color="secondary" onClick={() => handleAbrirModalAgregarEditar()} startIcon={<AddTwoToneIcon fontSize="small" />}>
            Agregar Detalle
          </Button>
        </Box>
        <Card>
          <List>
            {detalle.map((item, index) => (
              <div key={item.id}>
                <ListItem
                  sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                >
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                    <Typography gutterBottom>
                      <MarkdownRenderer content={item.titulo} />
                    </Typography>
                    <IconButton onClick={(e) => handleClick(e, item.id)}>
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  <Box sx={{ width: '100%' }}>
                    <Typography color="textSecondary">
                      <MarkdownRenderer content={item.respuesta} />
                    </Typography>
                  </Box>
                </ListItem>
                {index < detalle.length - 1 && <Divider component="li" />}

                {/* Menu de opciones */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl) && selectedDetalleId === item.id}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => handleAbrirModalAgregarEditar(item.id)}>
                    <EditTwoToneIcon fontSize="small" sx={{ mr: 1 }} />
                    Editar
                  </MenuItem>
                  <MenuItem onClick={() => handleDelete(item.id)}>
                    <DeleteTwoToneIcon fontSize="small" sx={{ mr: 1 }} />
                    Eliminar
                  </MenuItem>
                </Menu>
              </div>
            ))}
          </List>
        </Card>
      </Grid>
      {abrirModalFormularioCrearEditarDetalle && (
        <FormularioCrearEditar
          abrirModal={abrirModalFormularioCrearEditarDetalle}
          cerrarModal={handleCerrarModalFormularioCrearEditarDetalle}
          tituloModal={tituloModal}
          datosIniciales={formDataDetalle}
          confirmacion={handleActualizarDetalle}
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

export default DetalleTab;
