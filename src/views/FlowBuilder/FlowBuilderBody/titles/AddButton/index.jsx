import React from 'react';
import { IconButton, makeStyles } from '@material-ui/core';
import AddIcon from '../../../../../components/icons/AddIcon';

const useStyles = makeStyles(theme => ({
  roundBtn: {
    borderRadius: '50%',
    background: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    padding: 0,
    marginLeft: theme.spacing(2),
  },
}));

export default function AddButton({onClick, type}) {
  const classes = useStyles();

  return (
    <IconButton
      data-test={type === 'generator' ? 'addGenerator' : 'addProcessor'}
      className={classes.roundBtn}
      onClick={onClick}>
      <AddIcon />
    </IconButton>
  );
}

