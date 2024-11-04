import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, ButtonGroup, Button, Tooltip, IconButton } from '@mui/material';

import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import MarkdownRenderer from '@/utils/MarkdownRenderer';

const TablaGenerica = ({ data, actions }) => {
  if (!data || data.length === 0) return <p>No hay datos para mostrar</p>;

  const headers = Object.keys(data[0]).filter((header) => header !== 'Id');

  const esMarkdown = (texto) => {
    const markdownPattern = /[*_#\[\]]|```|\n|!\[.*\]\(.*\)/;
    return markdownPattern.test(texto);
  };
  return (
    <Table>
      <TableHead>
        <TableRow>
          {headers.map((header, index) => (
            <TableCell key={index}>{header}</TableCell>
          ))}
          <TableCell align="right">Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={rowIndex} hover>
            {headers.map((header, colIndex) => (
              <TableCell key={colIndex}>
                {/* Evaluar si la celda contiene Markdown */}
                {typeof row[header] === 'string' && esMarkdown(row[header]) ? (
                  <MarkdownRenderer content={row[header]} />                  
                ) : (
                  row[header]
                )}
              </TableCell>
            ))}
            <TableCell align="right">
              <ButtonGroup variant="text" size="small">
                {actions.map((action, actionIndex) => (
                  <Tooltip key={actionIndex} placement="top" title={action.label} arrow>
                    <Button
                      color="inherit"
                      startIcon={action.icon}
                      onClick={() => action.onClick(row.Id)}
                    >
                      {/* El ícono es suficiente para mostrar la acción */}
                    </Button>
                  </Tooltip>
                ))}
                {/* <Tooltip placement="top" title="Ordenar" arrow>
                  <IconButton>
                    <DragIndicatorIcon />
                  </IconButton>
                </Tooltip> */}
              </ButtonGroup>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TablaGenerica;
