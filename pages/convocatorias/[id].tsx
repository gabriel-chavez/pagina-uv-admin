import Head from 'next/head';
import TituloPagina from '@/components/TituloPagina';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';
import SidebarLayout from '@/layouts/SidebarLayout';
import { Container, Grid, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TablaGenerica from '@/components/Tabla/TablaGenerica';
import { useState, useEffect, useRef } from 'react';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { useRouter } from 'next/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { obtenerPostulantes } from '@/services/convocatoriasService';

const postulantesMock = [
  {
    id: 1,
    nombres: 'Juan',
    apellidoPadre: 'Pérez',
    apellidoMadre: 'López',
    ciudad: 'La Paz',
    pais: 'Bolivia',
    telefono: '123456789',
    celular: '987654321',
    puntaje: 85,
    formacionLista: [
      {
        nivelFormacion: 'Licenciatura',
        centroEducativo: 'Universidad Mayor de San Andrés',
        tituloObtenido: 'Administrador de Empresas',
        fechaTitulo: '30/06/2024',
        ciudad: 'La Paz',
        pais: 'Bolivia',
      },
      {
        nivelFormacion: 'Maestría',
        centroEducativo: 'Universidad Mayor de San Andrés',
        tituloObtenido: 'Administrador de Empresas con mención en...',
        fechaTitulo: '30/06/2024',
        ciudad: 'La Paz',
        pais: 'Bolivia',
      },
    ],
  },
  {
    id: 2,
    nombres: 'Ana',
    apellidoPadre: 'González',
    apellidoMadre: 'Martínez',
    ciudad: 'Santa Cruz',
    pais: 'Bolivia',
    telefono: '234567890',
    celular: '876543210',
    puntaje: 90,
    formacionAcademica: [
      {
        nivelFormacion: 'Licenciatura',
        centroEducativo: 'Universidad Mayor de San Andrés',
        tituloObtenido: 'Abogado',
        fechaTitulo: '30/06/2024',
        ciudad: 'La Paz',
        pais: 'Bolivia',
      },
    ],
  },
];


const Postulantes = () => {
  const router = useRouter();
  const { idConvocatoria } = router.query;
  // Configura 'postulantes' con el valor inicial del mock directamente
  const [postulantes, setPostulantes] = useState();

  const [openDetails, setOpenDetails] = useState(false);
  const [selectedPostulante, setSelectedPostulante] = useState(null);
  const { openSnackbar } = useSnackbar();
  const modalContentRef = useRef();

  const fetchPostulantes = async () => {
    try {
      const data = await obtenerPostulantes(idConvocatoria);
      console.log("datos requeridos: " + data);
      setPostulantes(data.datos);
      console.log(data.datos)
    } catch (error) {
      setPostulantes([]);
    }
  };

  useEffect(() => {
    if (idConvocatoria) {
      fetchPostulantes(); // Llama a la función pasando el ID de la convocatoria
    }
  }, [idConvocatoria]);

  const handleViewDetails = (postulanteId) => {
    const postulante = postulantes.find((p) => p.id === postulanteId);
    setSelectedPostulante(postulante);
    setOpenDetails(true);
    openSnackbar(`Detalles del postulante ID: ${postulanteId}`);
  };

  const generatePDF = async () => {
    if (selectedPostulante && modalContentRef.current) {
      const canvas = await html2canvas(modalContentRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'letter'); // Configuración para tamaño carta

      pdf.addImage(imgData, 'PNG', 20, 20, 560, 0);
      pdf.save(`postulante_${selectedPostulante.id}.pdf`);
    } else {
      openSnackbar("No se pudo generar el PDF: faltan datos del postulante.");
    }
  };

  const mappedPostulantes = postulantes.map((postulante) => ({
    Id: postulante.id,
    Nombres: postulante.nombres,
    "Apellido del padre": postulante.apellidoPadre,
    "Apellido de la madre": postulante.apellidoMadre,
    Ciudad: postulante.ciudad,
    País: postulante.pais,
    Teléfono: postulante.telefono,
    Celular: postulante.celular,
    Puntaje: postulante.puntaje,
  }));

  const tableActions = [
    {
      label: 'Ver postulación',
      icon: <VisibilityIcon fontSize="small" />,
      onClick: (id: number) => handleViewDetails(id),
    },
  ];

  return (
    <>
      <Head>
        <title>Postulantes</title>
      </Head>
      <PageTitleWrapper>
        <TituloPagina
          titulo="Postulantes"
          subtitulo="Gestiona los postulantes de la convocatoria"
        />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12}>
            <TablaGenerica data={mappedPostulantes} actions={tableActions} />
          </Grid>
        </Grid>
      </Container>
      <Footer />

      {/* Modal para mostrar detalles del postulante */}


      <Dialog
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            width: '1000px', // Ancho del 90% de la pantalla
            maxHeight: '90vh', // Máximo alto del 90% de la altura de la pantalla
            padding: 2,
          },
        }}
      >
        <DialogTitle>Detalles del postulante</DialogTitle>
        <DialogContent ref={modalContentRef}>
          {selectedPostulante ? (
            <>
              <Typography variant="h6">Información del Postulante</Typography>
              <Typography>Nombres: {selectedPostulante.nombres}</Typography>
              <Typography>Apellido del padre: {selectedPostulante.apellidoPadre}</Typography>
              <Typography>Apellido de la madre: {selectedPostulante.apellidoMadre}</Typography>
              <Typography>Ciudad: {selectedPostulante.ciudad}</Typography>
              <Typography>País: {selectedPostulante.pais}</Typography>
              <Typography>Teléfono: {selectedPostulante.telefono}</Typography>
              <Typography>Celular: {selectedPostulante.celular}</Typography>
              <Typography>Puntaje: {selectedPostulante.puntaje}</Typography>

              {/* Mostrar la formación académica en una tabla */}
              <Typography variant="h6" style={{ marginTop: 16 }}>Formación Académica</Typography>
              {selectedPostulante.formacionLista && selectedPostulante.formacionLista.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Nivel de Formación</strong></TableCell>
                        <TableCell><strong>Centro Educativo</strong></TableCell>
                        <TableCell><strong>Título Obtenido</strong></TableCell>
                        <TableCell><strong>Fecha de Título</strong></TableCell>
                        <TableCell><strong>Ciudad</strong></TableCell>
                        <TableCell><strong>País</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedPostulante.formacionLista.map((formacion, index) => (
                        <TableRow key={index}>
                          <TableCell>{formacion.nivelFormacion}</TableCell>
                          <TableCell>{formacion.centroEducativo}</TableCell>
                          <TableCell>{formacion.tituloObtenido}</TableCell>
                          <TableCell>{formacion.fechaTitulo}</TableCell>
                          <TableCell>{formacion.ciudad}</TableCell>
                          <TableCell>{formacion.pais}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography>No se encontraron formaciones académicas.</Typography>
              )}
            </>
          ) : (
            <Typography>Información detallada del postulante aquí...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetails(false)} color="primary">Cerrar</Button>
          <Button onClick={generatePDF} color="primary">Descargar PDF</Button>
        </DialogActions>
      </Dialog>


    </>
  );
};

Postulantes.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Postulantes;
