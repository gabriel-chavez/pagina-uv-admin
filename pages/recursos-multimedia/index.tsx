import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Typography,
    Paper,
    TextField,
    Container,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    CardContent,
    Divider,
    CardHeader,
    Card,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import SidebarLayout from "@/layouts/SidebarLayout";
import Head from "next/head";
import PageTitleWrapper from "@/components/PageTitleWrapper";
import TituloPagina from "@/components/TituloPagina";
import Footer from "@/components/Footer";
import { cargarRecurso, obtenerRecursos } from "@/services/cmsService";
import ExploradorDeArchivos from "@/utils/ExploradorDeArchivos";


const RecursosMultimedia = () => {


    const [carpetaActual, setCarpetaActual] = useState("assets");

    const handleCambioDeCarpeta = (nuevaCarpeta) => {

        setCarpetaActual(nuevaCarpeta);
    };



    return (
        <>
            <Head>
                <title>Recursos Multimedia</title>
            </Head>
            <PageTitleWrapper>
                <TituloPagina
                    titulo="Recursos Multimedia"
                    subtitulo="Administra y carga recursos multimedia"


                />
            </PageTitleWrapper>
            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader title="Páginas" />
                            <Divider />
                            <CardContent>
                                
                                    <Grid
                                        container
                                        direction="row"
                                        justifyContent="center"
                                        alignItems="stretch"
                                        spacing={3}
                                    >
                                        <Grid item xs={12}>
                                            <ExploradorDeArchivos
                                                carpetaActual={carpetaActual}
                                                onCarpetaChange={handleCambioDeCarpeta}
                                                tipo="paginasdinamicas"
                                            />
                                        </Grid>
                                    </Grid>
                         
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>

            <Footer />

        </>
    );
};

RecursosMultimedia.getLayout = (page) => (
    <SidebarLayout>{page}</SidebarLayout>
);

export default RecursosMultimedia;
