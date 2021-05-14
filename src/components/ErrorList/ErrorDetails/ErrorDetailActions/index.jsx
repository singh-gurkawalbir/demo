import React, { useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
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

  const {retryDataKey: retryId, reqAndResKey} = useSelector(state =>
    selectors.resourceError(state, {
      flowId,
      resourceId,
      errorId,
      isResolved,
    }),
  shallowEqual
  );

  const s3BlobKey = useSelector(state => {
    if (!['request', 'response'].includes(mode)) {
      return;
    }
    const isHttpRequestMode = mode === 'request';

    return selectors.s3HttpBlobKey(state, reqAndResKey, isHttpRequestMode);
  });

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

  const handleDownloadBlob = useCallback(
    () => {
      dispatch(actions.errorManager.errorHttpDoc.downloadBlobDoc(flowId, resourceId, s3BlobKey));
    },
    [flowId, resourceId, s3BlobKey, dispatch],
  );

  const isRetryDataChanged = updatedRetryData && !isEqual(retryData, updatedRetryData);

  if (mode === 'editRetry' && !isFlowDisabled) {
    return (
      <div className={classes.action}>
        <Button variant="outlined" color="primary" disabled={!isRetryDataChanged} onClick={handleSaveAndRetry}>
          Save &amp; retry
        </Button>
        <Button variant="outlined" color="secondary" disabled={!isRetryDataChanged} onClick={updateRetry}>
          Save &amp; close
        </Button>
        { !isResolved && (
          <Button variant="outlined" color="secondary" onClick={resolve}>
            Resolve
          </Button>
        )}
        <Button variant="text" color="primary" onClick={onClose}>
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className={classes.action}>
      {!isResolved && (
        <Button variant="outlined" color="primary" onClick={resolve}>
          Resolve
        </Button>
      )}
      {
        !!s3BlobKey && (
        <Button variant="outlined" color="secondary" onClick={handleDownloadBlob}>
          Download file
        </Button>
        )
      }
      <Button variant="text" color="primary" onClick={onClose}>
        Close
      </Button>
    </div>
  );
}
