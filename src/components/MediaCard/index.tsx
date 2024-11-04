import * as React from 'react';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import VisibilityIcon from '@mui/icons-material/Visibility';
import { Menu, MenuItem, Tooltip } from '@mui/material';

function MediaCard({
  image,
  title,
  description,
  description2,
  button1Text,
  button2Text,
  button3Text,
  onButton1Click = () => { },
  onButton2Click = () => { },
  onButton3Click = () => { },
  onButton4Click = () => { },
  onButton5Click = () => { }
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEditarBannerClick = () => {
    onButton4Click();
    handleClose(); // Cierra el menú después de la edición
  };
  const handleEliminarClick = () => {
    onButton3Click();
    handleClose(); // Cierra el menú después de la edición
  };
  const handleEditarMenuClick = () => {
    onButton5Click();
    handleClose(); // Cierra el menú después de la edición
  };
  return (
    <Card sx={{ maxWidth: 345, position: 'relative' }}>
      <CardMedia
        sx={{ height: 140 }}
        image={image}
        title={title}
      >
        {/* Botón de edición centrado */}

      </CardMedia>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description2}
        </Typography>
      </CardContent>

      <CardActions disableSpacing>
        <Tooltip placement="top" title={button1Text} arrow>
          <IconButton
            onClick={onButton1Click}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip placement="top" title={button2Text} arrow>
          <IconButton
            onClick={onButton2Click}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
        <IconButton sx={{ marginLeft: 'auto' }}
          onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>
      </CardActions>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleEditarBannerClick}>Cambiar banner</MenuItem>
        <MenuItem onClick={handleEditarMenuClick}>Asignar menú</MenuItem>
        <MenuItem onClick={handleEliminarClick}>Eliminar Página</MenuItem>
      </Menu>
    </Card >

  );
}

MediaCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  button1Text: PropTypes.string.isRequired,
  button2Text: PropTypes.string.isRequired,
  description2: PropTypes.string.isRequired,
  onButton1Click: PropTypes.func,
  onButton2Click: PropTypes.func,
  onButton3Click: PropTypes.func,
  onEditClick: PropTypes.func,
};

export default MediaCard;
