import React from 'react';
import { IconButton, makeStyles } from '@material-ui/core';
import AddIcon from '../../../../../../../components/icons/AddIcon';

const useStyles = makeStyles(theme => ({
  roundBtn: {
    borderRadius: '50%',
    background: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    padding: 0,
    marginLeft: theme.spacing(2),
    // for a yet unknown reason, foreign objects within an svg are not accepting mouse
    // events. It MUST be possible as this same strategy works for our AppBlock component.
    // I am unfortunately not able to figure it out today.
    pointerEvents: 'all',
  },
}));

export default function AddButton({onClick}) {
  const classes = useStyles();

  return (
    <IconButton
      className={classes.roundBtn}
      // No idea why the browser doesnt pass mouse event down to this DOM node.
      // eslint-disable-next-line no-console
      onClick={() => { console.log('clicked!'); onClick(); }}>
      <AddIcon />
    </IconButton>
  );
}

