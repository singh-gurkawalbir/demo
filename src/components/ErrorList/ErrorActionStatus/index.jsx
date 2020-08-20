import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { selectors } from '../../../reducers';

const useStyles = makeStyles(() => ({
  statusContainer: {
    width: 'auto',
    background: '#ddd',
  },
}));

export default function ActionStatus(props) {
  const classes = useStyles();
  const { flowId, resourceId } = props;
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
      Retry: {retryCount}, Resolve: {resolveCount}
    </span>
  );
}
