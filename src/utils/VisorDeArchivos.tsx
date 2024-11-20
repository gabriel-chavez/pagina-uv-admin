import { useState, useEffect } from 'react';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

import PreviewIcon from '@mui/icons-material/Preview';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Grid, Typography, Dialog, IconButton, Tooltip, Card, CardContent } from '@mui/material';

const VisorDeArchivos = ({ archivos=[], onSelect, selectedRecursoId }) => {
  
  const [currentFolder, setCurrentFolder] = useState('assets');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false); // Estado para el modal de vista previa

  useEffect(() => {
    if (selectedRecursoId) {
      const selected = archivos.find(archivo => archivo.id === selectedRecursoId);
      if (selected) {
        setSelectedFile(selected.recursoEscritorio);
      }
    }
  }, [selectedRecursoId, archivos]);

  const getFolder = (path) => {
    const parts = path.split('/');
    return parts.slice(0, -1).join('/');
  };

  const folders = Array.from(new Set(
    (Array.isArray(archivos) ? archivos : [])
      .filter(archivo => archivo.recursoEscritorio && archivo.recursoEscritorio.startsWith(`/${currentFolder}/`))
      .map(archivo => {
        const folderPath = getFolder(archivo.recursoEscritorio);
        const relativePath = folderPath.replace(`/${currentFolder}/`, '');
        return relativePath.split('/')[0];
      })
      .filter(Boolean)
  ));

  const filteredArchivos = (Array.isArray(archivos) ? archivos : []).filter(
    archivo => archivo.recursoEscritorio && getFolder(archivo.recursoEscritorio) === `/${currentFolder}`
  );

  const handleFolderClick = (folder) => {
    setCurrentFolder(prev => `${prev}/${folder}`);
  };

  const handleBackClick = () => {
    setCurrentFolder(prev => prev.split('/').slice(0, -1).join('/'));
  };

  const handleFileClick = (archivo) => {
    if (selectedFile === archivo.recursoEscritorio) {
      setSelectedFile(null);
      onSelect(null);
    } else {
      setSelectedFile(archivo.recursoEscritorio);
      onSelect(archivo.id);
    }
  };

  const handleDeselect = () => {
    setSelectedFile(null);
    onSelect(null);
  };

  const handlePreviewOpen = () => {
    setPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
  };

  const isImage = (path) => {
    if (!path) return false;
    const extension = path.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif'].includes(extension);
  };

  const getFileIcon = (path) => {
    const extension = path ? path.split('.').pop().toLowerCase() : '';
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return (
          <img
            src={path}
            alt=""
            style={{
              width: '100%',
              height: '80px', 
              objectFit: 'cover',
              borderRadius: '8px',
            }}
          />
        );
      case 'rar':
      case 'zip':
        return <InsertDriveFileIcon sx={{ fontSize: 60, color: '#FFB74D' }} />;
      case 'pdf':
      case 'doc':
      case 'docx':
        return <InsertDriveFileIcon sx={{ fontSize: 60, color: '#E57373' }} />;
      default:
        return <InsertDriveFileIcon sx={{ fontSize: 60, color: '#A9A9A9' }} />;
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Card sx={{ marginBottom: 2, padding: 0}}>
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Recurso seleccionado</Typography>
          <Box>
            {isImage(selectedFile) && (
              <Tooltip title="Vista Previa">
                <IconButton onClick={handlePreviewOpen} sx={{ marginRight: 2 }}>
                  <PreviewIcon />
                </IconButton>
              </Tooltip>
            )}
            {selectedFile && (
              <Tooltip title="Deseleccionar">
                <IconButton onClick={handleDeselect} color="secondary">
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </CardContent>
        <CardContent sx={{ textAlign: 'center' }}>
          {selectedFile ? (
            isImage(selectedFile) ? (
              <img
                src={selectedFile}
                alt="Archivo seleccionado"
                style={{
                  height: '150px',
                  width: 'auto',
                  borderRadius: '8px',
                  marginBottom: '0px',
                }}
              />
            ) : (
              <InsertDriveFileIcon sx={{ fontSize: 80, color: '#A9A9A9', marginBottom: '16px' }} />
            )
          ) : (
            <Typography variant="body1">Ningún archivo seleccionado</Typography>
          )}
          {selectedFile && (
            <Typography variant="body1" sx={{ marginTop: 0 }}>
              {selectedFile}
            </Typography>
          )}
        </CardContent>
      </Card>

      {currentFolder !== 'assets' && (
        <Button onClick={handleBackClick} variant="contained" sx={{ marginBottom: 2 }} startIcon={<ArrowBackIcon />}>
          Volver
        </Button>
      )}
      <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
        <Grid container spacing={1}>
          {folders.map(folder => (
            <Grid item xs={6} md={3} key={folder}>
              <Box sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleFolderClick(folder)}>
                <FolderIcon sx={{ fontSize: 60, color: '#FFB74D' }} />
                <Typography variant="h6">{folder}</Typography>
              </Box>
            </Grid>
          ))}
          {filteredArchivos.map(archivo => (
            <Grid item xs={6} md={3} key={archivo.id}>
              <Box
                data-file-id={archivo.recursoEscritorio}
                sx={{
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: selectedFile === archivo.recursoEscritorio ? '2px solid #1976d2' : '2px solid transparent',
                  borderRadius: '8px'
                }}
                onClick={() => handleFileClick(archivo)}
              >
                {getFileIcon(archivo.recursoEscritorio)}
                <Typography variant="body1" sx={{ marginTop: 1 }}>
                  {archivo.nombre}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {isImage(selectedFile) && (
        <Dialog open={previewOpen} onClose={handlePreviewClose} maxWidth="md" fullWidth>
          <Box sx={{ position: 'relative' }}>
            <img
              src={selectedFile}
              alt="Vista Previa"
              style={{
                width: '100%',
                height: 'auto',
              }}
            />
            <IconButton
              onClick={handlePreviewClose}
              sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Dialog>
      )}
    </Box>
  );
};

export default VisorDeArchivos;