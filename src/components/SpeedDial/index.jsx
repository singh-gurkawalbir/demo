import { makeStyles } from '@material-ui/core/styles';
import MuiSpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import React, { useCallback, useState } from 'react';

const isTouch =
  typeof document !== 'undefined' && 'ontouchstart' in document.documentElement;

const useStyles = makeStyles(theme => ({
  speedDial: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },
}));
export default function SpeedDial({children}) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);


  const handleClick = useCallback(() => {
    setOpen(state => !state);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);


  return (
    <MuiSpeedDial
      open={open}
      ariaLabel="speed dial"
      className={classes.speedDial}
      icon={<SpeedDialIcon />}
      ButtonProps={{
        color: 'secondary',
      }}
      onBlur={handleClose}
      onClick={handleClick}
      onClose={handleClose}
      onFocus={isTouch ? null : handleOpen}
      onMouseEnter={isTouch ? null : handleOpen}
      onMouseLeave={handleClose}>
      {children}
    </MuiSpeedDial>
  );
}
