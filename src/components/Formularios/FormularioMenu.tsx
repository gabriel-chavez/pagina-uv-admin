import React, { useEffect, useState } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    Typography,
    Divider,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';
import ConfirmationDialog from '@/utils/Confirmacion';
import { useForm } from 'react-hook-form';
import { actualizarMenu, obtenerMenu } from '@/services/cmsService';
import { useSnackbar } from '@/contexts/SnackbarContext';

const fetchMenu = async () => {
    try {
        const recursos = await obtenerMenu();
        return recursos.datos;
    } catch (error) {
        return [];
    }
};

const FormularioMenu = ({ abrirModal, cerrarModal, datosIniciales, confirmacion }) => {
    //console.log(datosIniciales)
    const { handleSubmit, reset, setValue, watch } = useForm({
        defaultValues: {
            id: null,
            idPaginaDinamica: null,
            idSeguro: null,
            ...datosIniciales,
        },
    });
    const menuSeleccionado = watch('id');
    const opcionSeleccionadaIncialmente = datosIniciales.id

    const [abrirConfirmacion, setAbrirConfirmacion] = useState(false);
    const [formData, setFormData] = useState(datosIniciales);
    const [menuData, setMenuData] = useState([]);
    const { openSnackbar } = useSnackbar();

    useEffect(() => {
        const cargarMenu = async () => {
            const menu = await fetchMenu();
            setMenuData(menu);
        };
        cargarMenu();
    }, [datosIniciales]);

    const handleCerrarModal = (event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return;
        }
        reset();
        cerrarModal();
    };
    //REVISAR QUE HACE
    const onSubmit = (data) => {
        console.log(data)
        setFormData(data);
        setAbrirConfirmacion(true);
    };

    const handleCerrarConfirmacion = () => {
        setAbrirConfirmacion(false);
    };

    const handleSeleccionarMenu = (menu) => {

        // Si el menú ya está seleccionado, deseleccionar
        if (menu.id === menuSeleccionado) {
            setValue('id', null); // Deseleccionar estableciendo a null
        } else if ((menu.idPaginaDinamica == null && menu.idSeguro == null) || menu.id === opcionSeleccionadaIncialmente) {
            setValue('id', menu.id); // Seleccionar el nuevo menú
        }
    };
    const handleConfirmar = async () => {
        let respuesta;

        console.log(formData);
        if (!formData.id) {
            formData.id = 0;
        }
        respuesta = await actualizarMenu(formData.id, formData);
        openSnackbar(respuesta.mensaje);
        reset();
        confirmacion();
        handleCerrarConfirmacion();
        cerrarModal();
    };
    const renderSubMenu = (subMenus) => {
        return subMenus.map((item) => (
            <React.Fragment key={item.id || item.url}>
                <List component="div" disablePadding sx={{ pl: 4 }}>
                    {item.habilitado && item.visible && (
                        <>
                            <ListItem
                                sx={{
                                    py: 0.2,
                                    backgroundColor: menuSeleccionado === item.id ? 'primary.light' : 'transparent',
                                    color: item.idPaginaDinamica != null || item.idSeguro != null
                                        ? 'text.disabled' // Deshabilitar si está asignado 
                                        : menuSeleccionado === item.id ? 'primary.contrastText' : 'text.secondary',
                                    '&:hover': item.idPaginaDinamica != null || item.idSeguro != null
                                        ? {}//no seleccionable
                                        : {
                                            backgroundColor: 'primary.main',
                                            color: 'primary.contrastText',
                                        },
                                    cursor: item.idPaginaDinamica != null || item.idSeguro != null
                                        ? 'not-allowed' // Cursor deshabilitado si está asignado
                                        : 'pointer',
                                }}
                                onClick={() => handleSeleccionarMenu(item)}
                            >
                                <Typography variant="body2" sx={{ pl: 2 }}>
                                    {`${item.nombre} ${item.id == opcionSeleccionadaIncialmente
                                        ? '(opción actual)'
                                        : item.idPaginaDinamica != null || item.idSeguro != null
                                            ? '(no disponible - asignado)'
                                            : ''
                                        }`}
                                </Typography>
                            </ListItem>
                            {item.subMenus && item.subMenus.length > 0 && (
                                <List component="div" sx={{ padding: '5px' }}>
                                    {renderSubMenu(item.subMenus)}
                                </List>
                            )}
                        </>
                    )}
                </List>
            </React.Fragment>
        ));
    };

    return (
        <>
            <Dialog
                open={abrirModal}
                onClose={handleCerrarModal}
                aria-labelledby="form-dialog-title"
                maxWidth="xl" // Cambiar a 'xl' para un tamaño más grande
                fullWidth // Asegura que ocupe todo el ancho permitido
                sx={{
                    '& .MuiDialog-paper': {
                        width: '100%', // Ocupa el 95% del ancho de la pantalla
                        maxWidth: '1200px', // Limita el ancho máximo a 1200px
                        height: '85vh', // Ocupa el 85% de la altura de la pantalla
                        '@media (min-width: 600px)': {
                            width: '85%', // Ajuste en pantallas más grandes
                            maxWidth: '800px', // Ancho máximo para pantallas grandes
                        },
                        margin: 'auto', // Centra el diálogo

                    },
                }}
            >

                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <DialogTitle id="form-dialog-title">Cambiar menú</DialogTitle>
                    <DialogContent>
                        <Box sx={{ backgroundColor: 'background.paper', borderRadius: 2, p: 2, boxShadow: 2 }}>
                            <List>
                                {menuData.map((item, index) => (
                                    <React.Fragment key={item.id || item.url}>
                                        {item.habilitado && item.visible && (
                                            <>
                                                <ListItem
                                                    sx={{
                                                        py: 0.1,
                                                        borderBottom: '1px solid',
                                                        borderColor: 'divider',
                                                        backgroundColor: menuSeleccionado === item.id ? 'primary.light' : 'transparent',
                                                        color: menuSeleccionado === item.id ? 'primary.contrastText' : 'text.primary',
                                                        '&:hover': item.idPaginaDinamica != null || item.idSeguro != null ? {}
                                                            : {
                                                                backgroundColor: 'primary.main',
                                                                color: 'primary.contrastText',
                                                            },
                                                        cursor: item.idPaginaDinamica != null || item.idSeguro != null
                                                            ? 'not-allowed' // Cursor deshabilitado si está asignado
                                                            : 'pointer',
                                                    }}
                                                    onClick={() => handleSeleccionarMenu(item.id)}
                                                >
                                                    <ListItemText
                                                        primary={
                                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                                {`${item.nombre} ${item.id == opcionSeleccionadaIncialmente
                                                                    ? '(opción actual)'
                                                                    : item.idPaginaDinamica != null || item.idSeguro != null
                                                                        ? '(no disponible - asignado)'
                                                                        : ''
                                                                    }`}
                                                            </Typography>
                                                        }
                                                    />
                                                </ListItem>
                                                {item.subMenus && item.subMenus.length > 0 && (
                                                    <List component="div" sx={{ padding: '10px' }}>
                                                        {renderSubMenu(item.subMenus)}
                                                    </List>
                                                )}
                                            </>
                                        )}
                                        <Divider />
                                    </React.Fragment>
                                ))}
                            </List>
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
                            <Button onClick={(event) => handleCerrarModal(event, 'buttonClick')}>Cancelar</Button>
                            <Button type="submit">Guardar</Button>
                        </DialogActions>
                    </Box>
                </form>
            </Dialog>
            <ConfirmationDialog
                open={abrirConfirmacion}
                handleClose={handleCerrarConfirmacion}
                handleConfirm={handleConfirmar}
                title="Confirmar"
                content={`¿Estás seguro de que deseas actualizar el menú?`}
            />
        </>
    );
};

export default FormularioMenu;
