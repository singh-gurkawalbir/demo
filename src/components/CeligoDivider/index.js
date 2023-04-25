import clsx from 'clsx';
import React from 'react';
import { Divider } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  divider: {
    margin: theme.spacing(0.5, 1, 0),
    width: 1,
  },
  small: {
    height: theme.spacing(1),
  },
  medium: {
    height: theme.spacing(2),
    margin: theme.spacing(0, 0.5),
  },
  large: {
    height: theme.spacing(3),
    margin: theme.spacing(0, 1),
  },
  xlarge: {
    height: theme.spacing(4),
    margin: theme.spacing(0, 2),
  },
  right: {
    marginLeft: theme.spacing(0),
  },
  left: {
    marginRight: theme.spacing(0),
  },
}));

export default function CeligoDivider({ orientation = 'vertical', height = 'large', position, className }) {
  const classes = useStyles();

  return (
    <Divider
      orientation={orientation}
      className={clsx(classes.divider, classes[position], classes[height], className)}
      height={height}
      sx={{backgroundColor: theme => theme.palette.secondary.lightest}}
  />
  );
}

CeligoDivider.defaultProps = {
  orientation: 'horizontal',
};

CeligoDivider.propTypes = {
  height: PropTypes.oneOf(['small', 'medium', 'large', 'xLarge']),
  orientation: PropTypes.oneOf(['vertical', 'horizontal']),
  position: PropTypes.oneOf(['left', 'right']),
};
