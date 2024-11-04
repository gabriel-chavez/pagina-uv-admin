import Head from 'next/head';
import TituloPagina from '@/components/TituloPagina';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';
import SidebarLayout from '@/layouts/SidebarLayout';
import { Container, Grid, styled, Tab, Tabs } from '@mui/material';
import { ChangeEvent, useState } from 'react';

import PlanesTab from '@/content/nuestros-seguros/PlanesTab';
import DetalleTab from '@/content/nuestros-seguros/DetalleTab';
import { useRouter } from 'next/router';

const TabsWrapper = styled(Tabs)(
    () => `
      .MuiTabs-scrollableX {
        overflow-x: auto !important;
      }
  `
  );

  const tabs = [
    { value: 'planes', label: 'Planes' },
    { value: 'detalle', label: 'Detalle' },
    
  ];

const NuestrosSeguros = () => {
    const router = useRouter();
    const { id } = router.query;
    
    const [currentTab, setCurrentTab] = useState<string>('planes');

  
    const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
        setCurrentTab(value);
      };
    return (
        <>
            <Head>
                <title>Seguros</title>
            </Head>
            <PageTitleWrapper>
                <TituloPagina
                    titulo="Planes y detalle del seguro"
                    subtitulo="Administra los datos de tu seguro"                                 
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
                        <TabsWrapper
                            onChange={handleTabsChange}
                            value={currentTab}
                            variant="scrollable"
                            scrollButtons="auto"
                            textColor="primary"
                            indicatorColor="primary"
                        >
                            {tabs.map((tab) => (
                                <Tab key={tab.value} label={tab.label} value={tab.value} />
                            ))}
                        </TabsWrapper>
                    </Grid>
                    <Grid item xs={12}>
                        {currentTab === 'planes' && <PlanesTab id={Number(id)} />}
                        {currentTab === 'detalle' && <DetalleTab id={Number(id)}  />}
                     
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
