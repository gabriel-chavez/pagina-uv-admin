import Head from 'next/head';
import TituloPagina from '@/components/TituloPagina';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';
import SidebarLayout from '@/layouts/SidebarLayout';
import { Container, Grid, Card, CardContent, Typography, Divider, Box } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { obtenerDetallePorNoticia } from '@/services/noticiasService';
import MarkdownRenderer from '@/utils/MarkdownRenderer';


const NuestrosSeguros = () => {
    const router = useRouter();
    const { id } = router.query;

    const [datos, setDatos] = useState(null);

    useEffect(() => {
       
        const fetchDatosNoticia = async () => {
            const response = await obtenerDetallePorNoticia(id);
            
          
            console.log(response);
            setDatos(response.datos);
        };
       
        if (id) fetchDatosNoticia();
    }, [id]);

    if (!datos) return <p>Cargando datos...</p>;
    return (
        <>
            <Head>
                <title>Seguros</title>
            </Head>
            <PageTitleWrapper>
                <TituloPagina
                    titulo="Detalle de noticia"
                    subtitulo="Datos de la noticia"
                />
            </PageTitleWrapper>
            <Container maxWidth="md">
                <Grid container direction="column" spacing={4}>
                    <Grid item>
                        <Card>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="h5">
                                        {datos.titulo}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        {new Date(datos.fecha).toLocaleDateString()}
                                    </Typography>
                                </Box>
                                <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                                    {datos.tituloCorto}
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="body1" paragraph>                                  
                                    <MarkdownRenderer content=  {datos.contenido} />
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="body2" color="textSecondary">
                                    Resumen:
                                    <MarkdownRenderer content=   {datos.resumen} />
                                </Typography>
                                <Box mt={2}>
                                    <Typography variant="body2">
                                        <strong>Categoría:</strong> {datos.parCategoria.nombre}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Estado:</strong> {datos.parEstado.nombre}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Imagen Principal ID:</strong> {datos.recursoId_ImagenPrincipal}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Etiquetas:</strong> {datos.etiquetas}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Orden:</strong> {datos.orden}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </>
    );
};

NuestrosSeguros.getLayout = (page) => (
    <SidebarLayout>{page}</SidebarLayout>
);

export default NuestrosSeguros;
