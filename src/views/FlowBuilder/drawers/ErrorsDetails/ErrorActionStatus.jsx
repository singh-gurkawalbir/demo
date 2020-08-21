import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, fade } from '@material-ui/core/styles';
import { selectors } from '../../../../reducers';

const useStyles = makeStyles(theme => ({
  statusContainer: {
    background: fade(theme.palette.secondary.lightest, 0.7),
    color: theme.palette.secondary.main,
    marginRight: theme.spacing(1),
    fontSize: 12,
    display: 'flex',
    lineHeight: '16px',
    padding: theme.spacing(0.5, 1),
    borderRadius: 2,
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
      Retries: {retryCount} Resolves: {resolveCount}
    </span>
  );
}
