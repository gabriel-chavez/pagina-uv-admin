import React from 'react';
import { Typography, Button, Grid } from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import PropTypes from 'prop-types';

interface TituloPaginaProps {
  titulo: string;
  subtitulo: string;
  tituloBoton?: string;
  onCreate?: () => void;
}

const TituloPagina: React.FC<TituloPaginaProps> = ({
  titulo,
  subtitulo,
  tituloBoton = '',
  onCreate = () => {}
}) => {
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          {titulo}
        </Typography>
        <Typography variant="subtitle2">
          {subtitulo}
        </Typography>
      </Grid>
      <Grid item>
        {tituloBoton && (
          <Button
            sx={{ mt: { xs: 2, md: 0 } }}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
            onClick={onCreate}
          >
            {tituloBoton}
          </Button>
        )}
      </Grid>
    </Grid>
  );
};


TituloPagina.propTypes = {
  titulo: PropTypes.string.isRequired,
  subtitulo: PropTypes.string.isRequired,
  tituloBoton: PropTypes.string,
  onCreate: PropTypes.func,
};

export default TituloPagina;
