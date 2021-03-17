import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Spinner from '../Spinner';

const useStyles = makeStyles({
  spinnerWrapper: {
    display: 'flex',
    height: '100%',
    '&> div:first-child': {
      margin: 'auto',
    },
  },
});

export default function PanelLoader({ message }) {
  const classes = useStyles();

  return (
    <div className={classes.spinnerWrapper}>
      <div>
        <span>{message}</span> <Spinner size={48} />
      </div>
    </div>
  );
}
