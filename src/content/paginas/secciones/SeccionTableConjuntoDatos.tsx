import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Button,
  Tooltip,
  Paper,
  IconButton,
  ButtonGroup
  
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import MarkdownRenderer from '@/utils/MarkdownRenderer';

const SeccionTableConjuntoDatos = ({ conjuntosDatos, btnEditarAgregar }) => {
  const [items, setItems] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setItems(conjuntosDatos);
  }, [conjuntosDatos]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;
    const sourceRow = Math.floor(sourceIndex / items[0].length);
    const sourceCol = sourceIndex % items[0].length;
    const destRow = Math.floor(destIndex / items[0].length);
    const destCol = destIndex % items[0].length;

    const newItems = [...items];
    const [removed] = newItems[sourceRow].splice(sourceCol, 1);
    newItems[destRow].splice(destCol, 0, removed);

    setItems(newItems);
  };
  
  if (!mounted) {
    return null;
  }
  //console.log(items);
  const obtenerFila = () => {
    let maxRow = 0; 

    
    console.log(items);
    items.flat().forEach(item => {
      if (item.fila > maxRow) {
        maxRow = item.fila;
      }
    });
    console.log(maxRow)
    return maxRow;
  };

  return (
    <Paper>
      <TableContainer>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Texto</TableCell>
                      <TableCell>Url</TableCell>
                      <TableCell>Recurso</TableCell>
                      <TableCell align="right">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.flat().map((conjunto, index) => (
                      <Draggable key={conjunto.id.toString()} draggableId={conjunto.id.toString()} index={index}>
                        {(provided) => (
                          <TableRow
                            hover
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <TableCell>
                              <MarkdownRenderer content={conjunto.datoTexto || conjunto.recurso?.nombre || ''} />
                            </TableCell>
                            <TableCell>{conjunto.datoUrl || ''}</TableCell>
                            <TableCell>{conjunto.recurso?.recursoEscritorio || ''}</TableCell>
                            <TableCell align="right">
                              <ButtonGroup variant="text" size="small">
                                <Tooltip placement="top" title="Editar" arrow>
                                  <Button
                                    color="inherit"
                                    size="small"
                                    variant="text"
                                    startIcon={<EditIcon fontSize="small" />}
                                    onClick={() => btnEditarAgregar(conjunto.id, conjunto.fila)}
                                  >
                                    Editar
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
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          color="primary"                          
                          onClick={() => btnEditarAgregar(null, obtenerFila())}
                        >
                          Agregar fila nueva
                       
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </TableContainer>
    </Paper>
  );
};

export default SeccionTableConjuntoDatos;