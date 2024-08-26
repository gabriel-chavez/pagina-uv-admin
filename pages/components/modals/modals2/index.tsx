import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Head from 'next/head';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import PageTitle from '@/components/PageTitle';
import Footer from '@/components/Footer';
import SidebarLayout from '@/layouts/SidebarLayout';
import {
    Container,
    Grid,
    Card,
    CardHeader,
    CardContent,
    Divider
  } from '@mui/material';
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function CustomizedDialogs() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Head>
                <title>Modals - Components</title>
            </Head>
            <PageTitleWrapper>
                <PageTitle
                    heading="Modals"
                    subHeading="Dialogs inform users about a task and can contain critical information, require decisions, or involve multiple tasks."
                    docs="https://material-ui.com/components/dialogs/"
                />
            </PageTitleWrapper>
            <Container maxWidth="lg">
            <React.Fragment>
                <Button variant="outlined" onClick={handleClickOpen}>
                    Open dialog
                </Button>
                <BootstrapDialog
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={open}
                >
                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                        Prueba
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent dividers>
                        HOOOLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={handleClose}>
                            Guardar cambios
                        </Button>
                        <Button autoFocus onClick={handleClose}>
                            Cancelar
                        </Button>
                    </DialogActions>
                </BootstrapDialog>
            </React.Fragment>
            </Container>
            <Footer />
        </>
    );
    
}
CustomizedDialogs.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;