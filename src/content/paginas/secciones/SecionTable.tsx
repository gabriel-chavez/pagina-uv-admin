import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Tooltip,
    Paper,
    IconButton,
    ButtonGroup,
    Box,
    Dialog,
    DialogContent
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';


import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import MarkdownRenderer from '@/utils/MarkdownRenderer';

const SeccionTable = ({ secciones, onEdit, onView, btnEliminar }) => {
    const [items, setItems] = useState([]);
    const [mounted, setMounted] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);  // Estado para la imagen de vista previa

    useEffect(() => {
        setItems(secciones);
        setMounted(true);
    }, [secciones]);

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedItems = Array.from(items);
        const [removed] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, removed);

        setItems(reorderedItems);
    };

    const handlePreviewOpen = (img) => {
        setPreviewImage(img);  // Establecer la imagen para la vista preliminar
    };

    const handlePreviewClose = () => {
        setPreviewImage(null);  // Cerrar la vista preliminar
    };

    if (!mounted) {
        return null;
    }

    return (
        <Paper>
            <TableContainer>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided) => (
                            <Table {...provided.droppableProps} ref={provided.innerRef}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nombre</TableCell>
                                        <TableCell>Título</TableCell>
                                        <TableCell>Subtítulo</TableCell>
                                        <TableCell>Tipo de Sección</TableCell>
                                        <TableCell>Ejemplo de sección</TableCell>
                                        <TableCell>Clase</TableCell>
                                        <TableCell>Habilitado</TableCell>
                                        <TableCell align="right">Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map((seccion, index) => (
                                        <Draggable key={seccion.id.toString()} draggableId={seccion.id.toString()} index={index}>
                                            {(provided) => (
                                                <TableRow
                                                    hover
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                >
                                                    <TableCell>{seccion.nombre}</TableCell>
                                                    <TableCell>
                                                        <MarkdownRenderer content={seccion.titulo} />
                                                    </TableCell>
                                                    <TableCell>
                                                        <MarkdownRenderer content={seccion.subTitulo} />
                                                    </TableCell>
                                                    <TableCell>{seccion.catTipoSeccion.nombre}</TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Box
                                                                component="img"
                                                                src={seccion.catTipoSeccion.imagenSeccion}
                                                                alt={seccion.catTipoSeccion.nombre}
                                                                sx={{
                                                                    width: 200,
                                                                    height: 100,
                                                                    objectFit: 'contain',
                                                                    marginRight: 2,
                                                                    cursor: 'pointer',
                                                                }}
                                                                onClick={() => handlePreviewOpen(seccion.catTipoSeccion.imagenSeccion)} // Asegurándome de que la ruta de la imagen esté correcta
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>{seccion.clase}</TableCell>
                                                    <TableCell>
                                                        {seccion.habilitado ? 'Habilitado' : 'Deshabilitado'}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <ButtonGroup variant="text" size="small">
                                                            <Tooltip placement="top" title="Editar" arrow>
                                                                <Button
                                                                    color="inherit"
                                                                    startIcon={<EditIcon fontSize="small" />}
                                                                    onClick={() => onEdit(seccion.id, seccion.nombre, seccion.catTipoSeccionId, seccion.titulo, seccion.subTitulo, seccion.clase, seccion.orden, seccion.habilitado)}
                                                                    
                                                                >
                                                                      
                                                                </Button>
                                                            </Tooltip>
                                                            <Tooltip placement="top" title="Ver Datos" arrow>
                                                                <Button
                                                                    color="inherit"
                                                                    startIcon={<VisibilityIcon fontSize="small" />}
                                                                    onClick={() => onView(seccion.id)}
                                                                >
                                                                    {/* Datos */}
                                                                </Button>
                                                            </Tooltip>
                                                            <Tooltip placement="top" title="Eliminar" arrow>
                                                                <Button
                                                                    color="inherit"
                                                                    size="small"
                                                                    variant="text"
                                                                    startIcon={<DeleteIcon fontSize="small" />}
                                                                    onClick={() => btnEliminar(seccion.id)}
                                                                >
                                                                    {/* Eliminar */}
                                                                </Button>

                                                            </Tooltip>
                                                            <Tooltip placement="top" title="Ordenar" arrow>
                                                                <IconButton {...provided.dragHandleProps}>
                                                                    <DragIndicatorIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                            
                                                        </ButtonGroup>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </TableBody>
                            </Table>
                        )}
                    </Droppable>
                </DragDropContext>
            </TableContainer>
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
        </Paper>
    );
};

export default SeccionTable;
