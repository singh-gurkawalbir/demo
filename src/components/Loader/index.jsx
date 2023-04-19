import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@mui/styles';
import { alpha } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    justifyItems: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: alpha(theme.palette.secondary.light, 0.5),
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

export default function Loader({ className, children, hideBackDrop, ...props }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Modal
        aria-labelledby="loader"
        hideBackdrop={hideBackDrop}
        className={clsx(classes.modal, className)}
        {...props}>
        <Paper className={classes.paper} elevation={4}>
          {children}
        </Paper>
      </Modal>
    </div>
  );
}
