import React from 'react';
import { useSelector } from 'react-redux';
import { alpha } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { selectors } from '../../../../reducers';

const useStyles = makeStyles(theme => ({
  statusContainer: {
    background: alpha(theme.palette.secondary.lightest, 0.7),
    color: theme.palette.secondary.main,
    fontSize: 12,
    display: 'flex',
    lineHeight: '16px',
    padding: theme.spacing(0.5, 1),
    borderRadius: 2,
    marginRight: `${theme.spacing(4)} !important`,
    whiteSpace: 'nowrap',
  },
}));

export default function ErrorActionStatus({ flowId, resourceId }) {
  const classes = useStyles();
  const retryCount = useSelector(
    state =>
      selectors.errorActionsContext(state, { flowId, resourceId, actionType: 'retry' })
        .count || 0
  );
  const resolveCount = useSelector(
    state =>
      selectors.errorActionsContext(state, { flowId, resourceId, actionType: 'resolve' })
        .count || 0
  );

  return (
    <span className={classes.statusContainer}>
      Retries: {retryCount} | Resolves: {resolveCount}
    </span>
  );
}
