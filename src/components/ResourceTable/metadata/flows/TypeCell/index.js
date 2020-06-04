import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, Typography } from '@material-ui/core';
import * as selectors from '../../../../../reducers';

const useStyles = makeStyles(() => ({
  root: {
    // display: 'flex',
  },
}));

export default function TypeCell({ flowId }) {
  const classes = useStyles();
  const type = useSelector(state => selectors.flowType(state, flowId));

  return <Typography className={classes.root}>{type}</Typography>;
}
