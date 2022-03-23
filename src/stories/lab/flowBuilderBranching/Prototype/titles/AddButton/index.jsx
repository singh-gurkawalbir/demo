import React from 'react';
import { IconButton, makeStyles } from '@material-ui/core';
import AddIcon from '../../../../../../components/icons/AddIcon';

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

export default function AddButton({onClick}) {
  const classes = useStyles();

  return (
    <IconButton
      className={classes.roundBtn}
      // No idea why the browser doesnt pass mouse event down to this DOM node.
      // eslint-disable-next-line no-console
      onClick={e => { console.log('clicked!'); onClick(e); }}>
      <AddIcon />
    </IconButton>
  );
}

