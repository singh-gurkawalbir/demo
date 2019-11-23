import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    justifyItems: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: fade(theme.palette.secondary.light, 0.5),
  },
  paper: {
    padding: theme.spacing(2, 4),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    margin: 'auto',
    maxWidth: '660px',
    outline: 'none',
    textAlign: 'center',
    '& > *': {
      marginBottom: theme.spacing(2),
      '&:last-Child': {
        marginBottom: 0,
      },
    },
  },
}));

function Loader({ className, children, ...props }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Modal
        aria-labelledby="loader"
        className={clsx(classes.modal, className)}
        {...props}>
        <Paper className={classes.paper} elevation={4}>
          {children}
        </Paper>
      </Modal>
    </div>
  );
}

export default Loader;
