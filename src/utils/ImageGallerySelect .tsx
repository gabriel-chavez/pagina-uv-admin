import React, { useState } from 'react';
import { Button, Menu, MenuItem, Grid, Typography, Box, Dialog, DialogContent, IconButton } from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import CloseIcon from '@mui/icons-material/Close';

const ImageGallerySelect = ({ value, onChange, options }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);  // Estado para la imagen de vista previa

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option) => {
    onChange(option.id);  // Actualizar el valor del formulario con el ID
    setAnchorEl(null);
  };

  const handlePreviewOpen = (img) => {
    setPreviewImage(img);  // Establecer la imagen para la vista preliminar
  };

  const handlePreviewClose = () => {
    setPreviewImage(null);  // Cerrar la vista preliminar
  };

  const selectedOption = options.find(opt => opt.id === value) || options[0];

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <Button variant="contained" onClick={handleClick} sx={{ flexGrow: 1 }}>
          {selectedOption ? (
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Box
                component="img"
                src={selectedOption.imagenSeccion}
                alt={selectedOption.nombre}
                sx={{ 
                  width: 80, 
                  height: 50, 
                  marginRight: 2,
                  objectFit: 'cover', // Asegura que la imagen mantenga sus proporciones y llene el cuadro
                  objectPosition: 'center' // Centra la imagen dentro del cuadro
                }}
              />
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {selectedOption.nombre}
              </Typography>
            </div>
          ) : (
            'Select an Option'
          )}
        </Button>
        <IconButton
          color="primary"
          onClick={() => handlePreviewOpen(selectedOption.imagenSeccion)}
          sx={{ marginLeft: 1 }}
        >
          <PreviewIcon />
        </IconButton>
      </Box>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{ style: { maxHeight: 400 } }}
      >
        <Grid container spacing={2} style={{ padding: 8 }}>
          {options.map((option) => (
            <Grid item xs={12} md={4} key={option.id} style={{ display: 'flex', alignItems: 'center' }}>
              <MenuItem onClick={() => handleClose(option)} style={{ padding: 0, flexGrow: 1 }}>
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: 250,
                    overflow: 'hidden',
                    border: value === option.id ? '2px solid blue' : 'none',  // Resaltar la opción seleccionada
                  }}
                >
                  <Box
                    component="img"
                    src={option.imagenSeccion}
                    alt={option.nombre}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover', // Asegura que la imagen llene el cuadro sin distorsionarse
                      objectPosition: 'center' // Centra la imagen dentro del cuadro
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      width: '100%',
                      bgcolor: 'rgba(0, 0, 0, 0.6)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      py: 1,
                      px: 2,
                    }}
                  >
                    <Typography sx={{ fontSize: '1rem' }}>
                      {option.nombre}
                    </Typography>
                    <IconButton
                      color="inherit"
                      onClick={(e) => {
                        e.stopPropagation();  // Evitar cerrar el menú cuando se hace clic en el botón de vista previa
                        handlePreviewOpen(option.imagenSeccion);
                      }}
                      sx={{ marginLeft: 1 }}
                    >
                      <PreviewIcon />
                    </IconButton>
                  </Box>
                </Box>
              </MenuItem>
            </Grid>
          ))}
        </Grid>
      </Menu>

      {/* Modal de Vista Preliminar */}
      <Dialog open={Boolean(previewImage)} onClose={handlePreviewClose} maxWidth="md" fullWidth>
        <DialogContent sx={{ position: 'relative', textAlign: 'center', padding: 0 }}>
          <IconButton
            onClick={handlePreviewClose}
            sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <CloseIcon sx={{ color: 'white' }} />
          </IconButton>
          {previewImage && (
            <img
              src={previewImage}
              alt="Vista Preliminar"
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageGallerySelect;
