import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';

function MediaCard({
  image,
  title,
  description,
  description2,
  button1Text,
  button2Text,
  onButton1Click = () => {},
  onButton2Click = () => {},
}) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image={image}
        title={title}
      />
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
      <CardActions>
        <Button size="small" onClick={onButton1Click}>{button1Text}</Button>
        <Button size="small" onClick={onButton2Click}>{button2Text}</Button>
      </CardActions>
    </Card>
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
};

export default MediaCard;
