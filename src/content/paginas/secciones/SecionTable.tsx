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
    ButtonGroup
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const SeccionTable = ({ secciones, onEdit, onView }) => {
    const [items, setItems] = useState([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setItems(secciones);
    }, [secciones]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedItems = Array.from(items);
        const [removed] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, removed);

        setItems(reorderedItems);
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

                                        <TableCell>Tipo de Sección</TableCell>

                                        <TableCell>Nombre</TableCell>
                                        <TableCell>Título</TableCell>
                                        <TableCell>Subtítulo</TableCell>
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

                                                    <TableCell>{seccion.catTipoSeccion.nombre}</TableCell>

                                                    <TableCell>{seccion.nombre}</TableCell>
                                                    <TableCell>{seccion.titulo}</TableCell>
                                                    <TableCell>{seccion.subTitulo}</TableCell>
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
                                                                    Editar
                                                                </Button>
                                                            </Tooltip>
                                                            <Tooltip placement="top" title="Ver Datos" arrow>
                                                                <Button
                                                                    color="inherit"
                                                                    startIcon={<VisibilityIcon fontSize="small" />}
                                                                    onClick={() => onView(seccion.id)}
                                                                >
                                                                    Datos
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
        </Paper>
    );
};

export default SeccionTable;
