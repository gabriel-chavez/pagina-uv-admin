import React from 'react';
import MediaCard from "@/components/MediaCard";
import Grid from '@mui/material/Grid';

interface Recurso {
    nombre: string;
    catTipoRecursoId: number;
    recursoEscritorio: string;
}

interface BannerPagina {
    paginaDinamicaId: number;
    recursoId: number;
    titulo: string;
    subTitulo: string;
    recurso: Recurso;
    id: number;
}

interface Pagina {
    id: number;
    nombre: string;
    menuPrincipalId: number;
    menuPrincipal: MenuPrincipal;
    habilitado: boolean;
    bannerPaginas: BannerPagina[];
}

interface MenuPrincipal {
    nombre: string;
    url: string;
    idPadre: number;
    habilitado: boolean;
    visible: boolean;
    orden: number;
    urlCompleta: string;
    id: number;
}

interface PaginasDinamicasProps {
    paginas: Pagina[];
    onClickModalAgregarEditar: (id: number, nombre: string, habilitado: boolean, menuPrincipalId: number) => void;
    onClickSecciones: (id: number) => void;
    onClickEditarBanner: (id: number) => void;
}

const PaginasDinamicas: React.FC<PaginasDinamicasProps> = ({ paginas, onClickModalAgregarEditar, onClickSecciones, onClickEditarBanner }) => {

    return (
        <Grid spacing={5} container>
            {paginas.map((pagina) => {
                const defaultImage = '/assets/images/sinimagen.jpg';
                const bannerPagina = pagina.bannerPaginas[0];
                const menuPrincipal = pagina.menuPrincipal[0] ? pagina.menuPrincipal[0].urlCompleta : 'Sin menu asignado'
                const image = bannerPagina ? bannerPagina.recurso.recursoEscritorio : defaultImage; // Ruta de imagen por defecto

                const habilitado = pagina.habilitado ? "Habilitado" : "Inhabilitado"
                return (
                    <Grid item key={pagina.id} xs={12} sm={4} md={3}>
                        <MediaCard
                            key={pagina.id}
                            image={image}
                            title={pagina.nombre}
                            description={menuPrincipal}
                            description2={habilitado}
                            button1Text="Editar"
                            button2Text="Ver Secciones"
                            onButton1Click={() => onClickModalAgregarEditar(pagina.id, pagina.nombre, pagina.habilitado, pagina.menuPrincipalId)}
                            onButton2Click={() => onClickSecciones(pagina.id)}
                            onEditClick={() => onClickEditarBanner(pagina.id)}
                        />
                    </Grid>
                );
            })}
        </Grid>
    );
}

export default PaginasDinamicas;
