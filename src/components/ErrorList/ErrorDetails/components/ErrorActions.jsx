import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';

const useStyles = makeStyles(theme => ({
  action: {
    '& button': {
      margin: theme.spacing(1),
    },
  },
}));
export default function Actions({
  errorId,
  retryData,
  flowId,
  resourceId,
  onClose,
}) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const retryId = useSelector(state => {
    const errorDoc =
      selectors.resourceError(state, { flowId, resourceId, errorId }) || {};

    return errorDoc.retryDataKey;
  });
  const updateRetry = useCallback(() => {
    dispatch(
      actions.errorManager.retryData.updateRequest({
        flowId,
        resourceId,
        retryId,
        retryData,
      })
    );

    if (onClose) onClose();
  }, [dispatch, flowId, onClose, resourceId, retryData, retryId]);
  const resolve = useCallback(() => {
    dispatch(
      actions.errorManager.flowErrorDetails.resolve({
        flowId,
        resourceId,
        errorIds: [errorId],
      })
    );

    if (onClose) onClose();
  }, [dispatch, errorId, flowId, onClose, resourceId]);
  const retry = useCallback(() => {
    dispatch(
      actions.errorManager.flowErrorDetails.retry({
        flowId,
        resourceId,
        retryIds: [retryId],
      })
    );

    if (onClose) onClose();
  }, [dispatch, flowId, onClose, resourceId, retryId]);

  return (
    <div className={classes.action}>
      {retryId && (
        <Button variant="outlined" color="primary" onClick={retry}>
          Retry
        </Button>
      )}
      <Button variant="outlined" color="secondary" onClick={resolve}>
        Mark resolved
      </Button>
      {retryId && (
        <Button variant="outlined" color="secondary" disabled={!retryData} onClick={updateRetry}>
          Save &amp; close
        </Button>
      )}
      <Button variant="text" color="primary" onClick={onClose}>
        Cancel
      </Button>
    </div>
  );
}
