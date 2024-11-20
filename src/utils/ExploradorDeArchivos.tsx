import { useEffect, useState } from "react";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from '@mui/icons-material/Add';

import { Box, Button, Grid, Typography, Dialog, IconButton, Card, CardContent, Menu, MenuItem, DialogTitle, DialogContent, DialogContentText, TextField, Paper, DialogActions, Divider } from "@mui/material";
import { cargarRecurso, eliminarRecurso, obtenerRecursos } from "@/services/cmsService";
import { useSnackbar } from "@/contexts/SnackbarContext";
import { useDropzone } from "react-dropzone";

import { cargarRecursoNoticias, eliminarRecursoNoticias, obtenerRecursosNoticias } from '@/services/noticiasService';



const FormularioAgregarArchivo = ({ abrirModal, cerrarModal, rutaCarpeta, confirmar,tipo }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [ruta, setRuta] = useState(rutaCarpeta.replace("assets", "") || "");
  const { openSnackbar } = useSnackbar();

  const allowedExtensions = {
    "image/jpeg": "Imagen",
    "image/png": "Imagen",
    "image/gif": "Imagen",
    "video/mp4": "Video",
    "application/pdf": "Archivo",
    "application/msword": "Archivo",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "Archivo",
    "application/vnd.ms-excel": "Archivo",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      "Archivo",
    "text/plain": "Archivo",
    "application/zip": "Archivo Comprimido",
    "application/x-rar-compressed": "Archivo Comprimido",
  };

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const detectedType = allowedExtensions[file.type];
      if (!detectedType) {
        setError("El archivo no tiene un formato permitido.");
        setFile(null);
        setFileName("");
        setFileType("");
        setPreview(null);
        return;
      }
      setFile(file);
      setFileName(file.name);
      setFileType(detectedType);
      setPreview(URL.createObjectURL(file));
      setError(""); // Limpiar error si el archivo es válido
    }
  };

  const handleSubmit = async () => {
    console.log(preview)
    if (!fileName || !fileType || !preview) {
      setError("Debe cargar un archivo válido.");
      return;
    }

    try {
      const archivo = file;
      const data = {
        archivo: archivo,
        ruta: ruta == null || ruta == "" ? '/' : ruta,
      };
      
      var respuesta
      console.log("handleSubmit",tipo)
      if (tipo == "paginasdinamicas")
        respuesta = await cargarRecurso(data);
      else
        respuesta = await cargarRecursoNoticias(data);

      openSnackbar(respuesta.mensaje);


      confirmar();
      setFileName("");
      setFileType("");
      setPreview(null);
      setError("");
      cerrarModal();
    } catch (error) {
      console.error("Error al subir el archivo:", error.message);
      setError("Error al subir el archivo. Intente nuevamente.");
    }
  };

  const handleReset = () => {
    setFileName("");
    setFileType("");
    setPreview(null);
    setError("");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    multiple: false,
  });
  const handleRutaChange = (e) => {
    setRuta(e.target.value);
  };

  return (
    <Dialog
      open={abrirModal}
      onClose={(event, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          cerrarModal();
        }
      }}
      aria-labelledby="form-dialog-title"
      maxWidth="md"
      fullWidth={true}
    >
      <DialogTitle id="form-dialog-title">Agregar Archivo</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Formulario de Carga de Recursos Multimedia
        </DialogContentText>
        <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 2 }}>

          <Paper
            variant="outlined"
            {...getRootProps()}
            sx={{
              p: 2,
              textAlign: "center",
              border: isDragActive ? "2px dashed #3f51b5" : "2px dashed #aaa",
              mb: 2,
            }}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <Typography>Arrastra y suelta el archivo aquí...</Typography>
            ) : (
              <Typography>
                Arrastra y suelta el archivo aquí o haz clic para seleccionarlo.
              </Typography>
            )}
          </Paper>

          {error && (
            <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
              {error}
            </Typography>
          )}

          {!error && fileName && (
            <>
              <TextField
                label="Ruta de la carpeta"
                value={ruta}
                onChange={handleRutaChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Nombre del Archivo"
                value={fileName}
                fullWidth
                disabled
                sx={{ mb: 2 }}
              />
              <TextField
                label="Tipo de Archivo"
                value={fileType}
                fullWidth
                disabled
                sx={{ mb: 2 }}
              />
              {preview && fileType === "Imagen" && (
                <Box sx={{ mb: 2, textAlign: "center" }}>
                  <img
                    src={preview}
                    alt="Vista previa"
                    style={{ maxWidth: "100%", maxHeight: 200 }}
                  />
                </Box>
              )}
              {preview && fileType === "Video" && (
                <Box sx={{ mb: 2, textAlign: "center" }}>
                  <video controls style={{ maxWidth: "100%" }}>
                    <source src={preview} />
                    Tu navegador no soporta la reproducción de este video.
                  </video>
                </Box>
              )}
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleReset}
                  fullWidth
                >
                  Cambiar Recurso
                </Button>
              </Box>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={cerrarModal}>Cancelar</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};


const ExploradorDeArchivos = ({ carpetaActual, onCarpetaChange, tipo }) => {
  const [currentFolder, setCurrentFolder] = useState(carpetaActual);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [fileForMenu, setFileForMenu] = useState(null);
  const [videoThumbnails, setVideoThumbnails] = useState({});
  const [archivos, setArchivos] = useState([]);
  const [abrirModalFormularioAgregarArchivo, setAbrirModalFormularioAgregarArchivo] = useState(false);


  const { openSnackbar } = useSnackbar();
  useEffect(() => {
    const cargarRecursos = async () => {
      var recursos = null
      console.log("inicio",tipo)
      if (tipo == "paginasdinamicas")
        recursos = await obtenerRecursos();
      else
        recursos = await obtenerRecursosNoticias();
      setArchivos(recursos.datos);
    };

    cargarRecursos();
  }, []);
  useEffect(() => {
    const videos = archivos.filter((archivo) =>
      ["mp4", "avi", "mov"].includes(archivo.recursoEscritorio.split(".").pop().toLowerCase())
    );
    videos.forEach((video) => {
      if (!videoThumbnails[video.id]) {
        generateVideoThumbnail(video.recursoEscritorio, (thumbnail) => {
          setVideoThumbnails((prev) => ({ ...prev, [video.id]: thumbnail }));
        });
      }
    });
  }, [archivos]);
  const generateVideoThumbnail = (videoUrl, callback) => {
    const video = document.createElement("video");
    video.src = videoUrl;
    video.crossOrigin = "anonymous";
    video.onloadeddata = () => {
      video.currentTime = 1; // fotograma segundo 1.
    };
    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth / 2;
      canvas.height = video.videoHeight / 2;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      callback(canvas.toDataURL("image/png"));
    };
  };

  const getFolder = (path) => {
    const parts = path.split("/");
    return parts.slice(0, -1).join("/");
  };

  const folders = Array.from(
    new Set(
      archivos
        .filter(
          (archivo) =>
            archivo.recursoEscritorio &&
            archivo.recursoEscritorio.startsWith(`/${currentFolder}/`)
        )
        .map((archivo) => {
          const folderPath = getFolder(archivo.recursoEscritorio);
          const relativePath = folderPath.replace(`/${currentFolder}/`, "");
          return relativePath.split("/")[0];
        })
        .filter(Boolean)
    )
  );

  const filteredArchivos = archivos.filter(
    (archivo) =>
      archivo.recursoEscritorio &&
      getFolder(archivo.recursoEscritorio) === `/${currentFolder}`
  );

  const handleFolderClick = (folder) => {
    setCurrentFolder((prev) => `${prev}/${folder}`);
    onCarpetaChange(`${currentFolder}/${folder}`);
  };

  const handleBackClick = () => {
    const newPath = currentFolder.split("/").slice(0, -1).join("/");
    setCurrentFolder(newPath);
    onCarpetaChange(newPath);
  };

  const handleFileClick = (archivo) => {
    setSelectedFile(selectedFile === archivo.recursoEscritorio ? null : archivo);
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
  };

  const handleMenuOpen = (event, archivo) => {
    setMenuAnchor(event.currentTarget);
    setFileForMenu(archivo);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setFileForMenu(null);
  };

  const handleVistaPrevia = (archivo) => {
    const extension = archivo.recursoEscritorio.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "mp4", "avi", "mov"].includes(extension)) {
      setSelectedFile(archivo);
      setPreviewOpen(true);
    } else {
      console.log(`Abrir archivo de tipo ${extension}: ${archivo.nombre}`);
    }
  };

  const getFileTypeIcon = (path) => {
    const extension = path?.split(".").pop().toLowerCase();
    switch (extension) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <ImageIcon sx={{ fontSize: 25, color: "#E57373" }} />;
      case "mp4":
      case "avi":
      case "mov":
        return <VideoLibraryIcon sx={{ fontSize: 25, color: "#E57373" }} />;
      default:
        return <InsertDriveFileIcon sx={{ fontSize: 25, color: "#E57373" }} />;
    }
  };

  const handleDescargar = (archivo) => {
    if (!archivo || !archivo.recursoEscritorio) {
      console.error("Archivo no válido o no tiene recurso.");
      return;
    }

    const link = document.createElement("a");
    link.href = archivo.recursoEscritorio;
    link.download = archivo.nombre || "archivo";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleEliminarArchivo = async () => {
    if (!fileForMenu) {
      console.error("Archivo no válido para eliminar.");
      return;
    }
    let respuesta;
    console.log("handleEliminarArchivo",tipo)
    if (tipo == "paginasdinamicas")
      respuesta = await eliminarRecurso(fileForMenu.id);
    else
    respuesta = await eliminarRecursoNoticias(fileForMenu.id);    
    openSnackbar(respuesta.mensaje);
    const recursos = await obtenerRecursos();
    setArchivos(recursos.datos);
    handleMenuClose();
    setFileForMenu(null);
  };
  const handleCerrarModalFormularioAgregarArchivo = () => {
    setAbrirModalFormularioAgregarArchivo(false);
  }

  const handleAbrirModalFormularioAgregarArchivo = () => {

    setAbrirModalFormularioAgregarArchivo(true);
  };
  const handleConfirmar = async () => {
    const recursos = await obtenerRecursos();
    setArchivos(recursos.datos);
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        {/* Inicio: Botón "Volver" */}
        <Button
          onClick={handleBackClick}
          variant="contained"
          sx={{ marginRight: 2 }}
          startIcon={<ArrowBackIcon />}
          disabled={currentFolder === "assets"}
        >
          Volver
        </Button>

        {/* Centro: Carpeta actual */}
        <Typography variant="body2" sx={{ textAlign: "center", flexGrow: 1 }}>
          {currentFolder.replace("assets", "")}
        </Typography>

        {/* Fin: Botón "Agregar archivo" */}
        <Button
          onClick={handleAbrirModalFormularioAgregarArchivo}
          variant="contained"
          startIcon={<AddIcon />}
        >
          Agregar archivo
        </Button>
      </Box>
      <Divider />

      <Grid container spacing={2} sx={{
        marginTop: "20px"
      }}>
        {folders.map((folder) => (
          <Grid item xs={6} sm={4} md={3} key={folder} >
            <Box
              sx={{ textAlign: "center", cursor: "pointer" }}
              onClick={() => handleFolderClick(folder)}
            >
              <FolderIcon sx={{ fontSize: 60, color: "#FFB74D" }} />
              <Typography variant="subtitle1">{folder}</Typography>
            </Box>
          </Grid>
        ))}

        {filteredArchivos.map((archivo) => (
          <Grid item xs={6} sm={4} md={3} key={archivo.id}  >
            <Card
              sx={{
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                position: "relative",
                cursor: "pointer",
              }}
              onDoubleClick={() => handleVistaPrevia(archivo)}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px",
                  backgroundColor: "#f5f5f5",
                }}
              >
                {getFileTypeIcon(archivo.recursoEscritorio)}
                <Typography variant="body2" sx={{ flexGrow: 1, textAlign: "center" }}>
                  {archivo.nombre}
                </Typography>
                <IconButton
                  size="small"
                  onClick={(event) => handleMenuOpen(event, archivo)}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>

              <CardContent>
                {archivo.recursoEscritorio && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "140px",
                      overflow: "hidden",
                      backgroundImage: archivo.recursoEscritorio.endsWith(".png")
                        ? `linear-gradient(45deg, #dde3ea 25%, transparent 25%, transparent 75%, #dde3ea 75%, #dde3ea),
             linear-gradient(45deg, #dde3ea 25%, transparent 25%, transparent 75%, #dde3ea 75%, #dde3ea)`
                        : "none",
                      backgroundSize: "16px 16px",
                      backgroundPosition: "0 0, 8px 8px",
                      backgroundColor: archivo.recursoEscritorio.endsWith(".png")
                        ? "#f9f9f9"
                        : "none",
                    }}
                  >
                    {["jpg", "jpeg", "png", "gif"].includes(
                      archivo.recursoEscritorio.split(".").pop().toLowerCase()
                    ) ? (
                      // Miniaturas imágenes
                      <img
                        src={archivo.recursoEscritorio}
                        alt={archivo.nombre}
                        style={{
                          maxHeight: "100%",
                          maxWidth: "100%",
                          objectFit: "contain",
                        }}
                      />
                    ) : ["mp4", "avi", "mov"].includes(
                      archivo.recursoEscritorio.split(".").pop().toLowerCase()
                    ) ? (
                      // Miniatura video
                      <img
                        src={videoThumbnails[archivo.id]}
                        alt="Video thumbnail"
                        style={{ width: "100%", height: "140px", objectFit: "cover" }}
                      />
                    ) : (
                      // Icono otros
                      <InsertDriveFileIcon
                        sx={{
                          fontSize: 60,
                          color: "#9e9e9e",
                        }}
                      />
                    )}
                  </Box>
                )}
              </CardContent>


              <Box sx={{ display: "flex", justifyContent: "space-between", padding: "8px", backgroundColor: "#f9f9f9", borderTop: "1px solid #ddd" }}>
                <Typography variant="caption">Subido por: {archivo.usuario}</Typography>
                <Typography variant="caption">{archivo.fecha}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        {fileForMenu && ["jpg", "jpeg", "png", "gif", "mp4", "avi", "mov"].includes(fileForMenu.recursoEscritorio.split(".").pop().toLowerCase()) && (
          <MenuItem onClick={() => { handleVistaPrevia(fileForMenu); handleMenuClose(); }}>Ver</MenuItem>
        )}

        <MenuItem onClick={() => { handleDescargar(fileForMenu); handleMenuClose(); }}>Descargar</MenuItem>
        <MenuItem onClick={() => handleEliminarArchivo()}>Eliminar</MenuItem>
      </Menu>

      {selectedFile?.recursoEscritorio && (
        <Dialog open={previewOpen} onClose={handlePreviewClose} maxWidth="md">
          <Box sx={{ position: "relative" }}>
            {selectedFile && ["mp4", "avi", "mov"].includes(selectedFile.recursoEscritorio.split(".").pop().toLowerCase()) ? (
              <video
                controls
                src={selectedFile.recursoEscritorio}
                style={{ width: "100%", height: "auto" }}
              />
            ) : (
              <img
                src={selectedFile?.recursoEscritorio}
                alt="Vista Previa"
                style={{ width: "100%", height: "auto" }}
              />
            )}
            <IconButton
              onClick={handlePreviewClose}
              sx={{ position: "absolute", top: 8, right: 8, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Dialog>
      )}
      {abrirModalFormularioAgregarArchivo && (
        <FormularioAgregarArchivo
          abrirModal={abrirModalFormularioAgregarArchivo}
          cerrarModal={handleCerrarModalFormularioAgregarArchivo}
          confirmar={handleConfirmar}
          rutaCarpeta={carpetaActual}
          tipo={tipo}
        />
      )}
    </Box>
  );
};

export default ExploradorDeArchivos;
