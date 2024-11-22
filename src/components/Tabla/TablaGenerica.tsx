import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ButtonGroup,
  Button,
  Tooltip,
} from '@mui/material';
import MarkdownRenderer from '@/utils/MarkdownRenderer';

const TablaGenerica = ({ data, actions }) => {
  const [videoActivo, setVideoActivo] = useState(null); // Estado para rastrear qué video se está reproduciendo

  if (!data || data.length === 0) return <p>No hay datos para mostrar</p>;

  const headers = Object.keys(data[0]).filter((header) => header !== 'Id');

  const esMarkdown = (texto) => {
    const markdownPattern = /[*_#\[\]]|```|\n|!\[.*\]\(.*\)/;
    return markdownPattern.test(texto);
  };

  const esImagen = (texto) => {
    const imagePattern = /\.(jpeg|jpg|gif|png|svg|webp)$/i;
    return typeof texto === 'string' && imagePattern.test(texto);
  };

  const esVideo = (texto) => {
    const videoPattern = /\.(mp4|webm|ogg|mov)$/i;
    return typeof texto === 'string' && videoPattern.test(texto);
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
                {esImagen(row[header]) ? (
                  <img
                    src={row[header]}
                    alt={`Imagen ${header}`}
                    style={{ maxWidth: '350px', maxHeight: '350px' }}
                  />
                ) : esVideo(row[header]) ? (
                  videoActivo === `${rowIndex}-${header}` ? (
                    // Renderizar video activo
                    <video
                      src={row[header]}
                      controls
                      autoPlay
                      style={{ maxWidth: '350px', maxHeight: '350px' }}
                      onClick={() => setVideoActivo(null)} // Detener al hacer clic nuevamente
                    />
                  ) : (
                    // Renderizar miniatura de video
                    <Tooltip title="Haz clic para reproducir el video" arrow>
                      <img
                        src="https://via.placeholder.com/100x100?text=Video" // Placeholder para video
                        alt={`Video ${header}`}
                        style={{ maxWidth: '350px', maxHeight: '350px', cursor: 'pointer' }}
                        onClick={() => setVideoActivo(`${rowIndex}-${header}`)} // Activar video al hacer clic
                      />
                    </Tooltip>
                  )
                ) : esMarkdown(row[header]) ? (
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
                    />
                  </Tooltip>
                ))}
              </ButtonGroup>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TablaGenerica;
