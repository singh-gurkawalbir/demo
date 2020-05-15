import { Fragment, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import actions from '../../../../actions';
import { resourceError } from '../../../../reducers';

export default function Actions({
  errorId,
  retryData,
  flowId,
  resourceId,
  onClose,
}) {
  const dispatch = useDispatch();
  const retryId = useSelector(state => {
    const errorDoc =
      resourceError(state, { flowId, resourceId, errorId }) || {};

    return errorDoc.retryDataKey;
  });
  const updateRetry = useCallback(() => {
    dispatch(actions.job.updateRetryData({ retryData, retryId }));
  }, [dispatch, retryData, retryId]);
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
    <Fragment>
      {retryId && (
        <Button variant="outlined" onClick={retry}>
          Retry
        </Button>
      )}
      <Button variant="outlined" onClick={resolve}>
        Resolve
      </Button>
      {retryId ? (
        <Button variant="outlined" disabled onClick={updateRetry}>
          Save &amp; close
        </Button>
      ) : (
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      )}
    </Fragment>
  );
}
