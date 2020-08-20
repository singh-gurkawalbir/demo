import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { selectors } from '../../../../reducers';

const useStyles = makeStyles(theme => ({
  statusContainer: {
    background: theme.palette.secondary.lightest,
    marginRight: theme.spacing(1),
    padding: theme.spacing(1),
    fontSize: 12,
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
      Retries: {retryCount}, Resolves: {resolveCount}
    </span>
  );
}
