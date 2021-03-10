import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isEqual } from 'lodash';
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
  updatedRetryData,
  flowId,
  resourceId,
  onClose,
  mode = 'view',
  isResolved = false,
}) {
  const dispatch = useDispatch();
  const classes = useStyles();

  const isFlowDisabled = useSelector(state =>
    !!(selectors.resource(state, 'flows', flowId)?.disabled)
  );

  const retryId = useSelector(state =>
      selectors.resourceError(state, {
        flowId,
        resourceId,
        errorId,
      })?.retryDataKey
  );

  const retryData = useSelector(state => selectors.retryData(state, retryId));

  const updateRetry = useCallback(() => {
    dispatch(
      actions.errorManager.retryData.updateRequest({
        flowId,
        resourceId,
        retryId,
        retryData: updatedRetryData,
      })
    );

    if (onClose) onClose();
  }, [dispatch, flowId, onClose, resourceId, updatedRetryData, retryId]);

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

  const handleSaveAndRetry = useCallback(() => {
    dispatch(
      actions.errorManager.flowErrorDetails.saveAndRetry({
        flowId,
        resourceId,
        retryId,
        retryData: updatedRetryData,
      })
    );

    if (onClose) onClose();
  }, [dispatch, flowId, onClose, resourceId, retryId, updatedRetryData]);

  if (isResolved) {
    return null;
  }

  const isRetryDataChanged = updatedRetryData && !isEqual(retryData, updatedRetryData);

  if (mode === 'editRetry' && !isFlowDisabled) {
    return (
      <div className={classes.action}>
        <Button variant="outlined" color="primary" disabled={!isRetryDataChanged} onClick={handleSaveAndRetry}>
          Save &amp; retry
        </Button>
        <Button variant="outlined" color="secondary" onClick={resolve}>
          Mark resolved
        </Button>
        <Button variant="outlined" color="secondary" disabled={!isRetryDataChanged} onClick={updateRetry}>
          Save &amp; close
        </Button>
        <Button variant="text" color="primary" onClick={onClose}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className={classes.action}>
      <Button variant="outlined" color="primary" onClick={resolve}>
        Mark resolved
      </Button>
      <Button variant="text" color="primary" onClick={onClose}>
        Cancel
      </Button>
    </div>
  );
}
