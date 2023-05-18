import React, { useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { isEqual } from 'lodash';
import { TextButton, FilledButton, OutlinedButton } from '@celigo/fuse-ui';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import { useHandleNextAndPreviousError } from '../../ErrorTable/hooks/useHandleNextAndPreviousError';
import { ERROR_DETAIL_ACTIONS_ASYNC_KEY } from '../../../../constants';
import useHandleCancelBasic from '../../../SaveAndCloseButtonGroup/hooks/useHandleCancelBasic';
import useClearAsyncStateOnUnmount from '../../../SaveAndCloseButtonGroup/hooks/useClearAsyncStateOnUnmount';
import useTriggerCancelFromContext from '../../../SaveAndCloseButtonGroup/hooks/useTriggerCancelFromContext';
import ActionGroup from '../../../ActionGroup';

export default function Actions({
  errorId,
  updatedRetryData,
  flowId,
  resourceId,
  onClose,
  mode = 'view',
  isResolved = false,
  errorsInPage,
  handleNext,
}) {
  const dispatch = useDispatch();
  const isFlowDisabled = useSelector(state =>
    !!(selectors.resource(state, 'flows', flowId)?.disabled)
  );

  const error = useSelector(state =>
    selectors.resourceError(state, {
      flowId,
      resourceId,
      errorId,
      isResolved,
    }),
  shallowEqual
  );
  const {retryDataKey: retryId, reqAndResKey} = error || {};
  const {
    handleNextError,
  } = useHandleNextAndPreviousError({
    errorsInPage,
    activeErrorId: errorId,
    flowId,
    isResolved,
    resourceId,
    retryId,
    handleNext,
  });
  const s3BlobKey = useSelector(state => {
    if (!['request', 'response'].includes(mode)) {
      return;
    }
    const isHttpRequestMode = mode === 'request';

    return selectors.s3HttpBlobKey(state, reqAndResKey, isHttpRequestMode);
  });

  const retryData = useSelector(state => selectors.retryData(state, retryId));

  const handleRetry = useCallback(() => {
    dispatch(
      actions.errorManager.flowErrorDetails.retry({
        flowId,
        resourceId,
        retryIds: [retryId],
        isResolved,
      })
    );

    handleNextError(true);
  }, [dispatch, flowId, handleNextError, isResolved, resourceId, retryId]);

  const updateRetry = useCallback(closeAfterSave => {
    dispatch(
      actions.errorManager.retryData.updateRequest({
        flowId,
        resourceId,
        retryId,
        retryData: updatedRetryData,
      })
    );

    if (closeAfterSave === true || isResolved) {
      onClose?.();
    } else {
      handleNextError(true);
    }
  }, [dispatch, flowId, resourceId, retryId, updatedRetryData, isResolved, onClose, handleNextError]);

  const resolve = useCallback(() => {
    dispatch(
      actions.errorManager.flowErrorDetails.resolve({
        flowId,
        resourceId,
        errorIds: [errorId],
      })
    );

    if (isResolved) {
      onClose?.();
    } else {
      handleNextError(true);
    }
  }, [dispatch, errorId, flowId, handleNextError, isResolved, onClose, resourceId]);

  const handleSaveAndRetry = useCallback(() => {
    dispatch(
      actions.errorManager.flowErrorDetails.saveAndRetry({
        flowId,
        resourceId,
        retryId,
        retryData: updatedRetryData,
      })
    );

    if (isResolved) {
      onClose?.();
    } else {
      handleNextError(true);
    }
  }, [dispatch, flowId, handleNextError, isResolved, onClose, resourceId, retryId, updatedRetryData]);

  const handleDownloadBlob = useCallback(
    () => {
      dispatch(actions.errorManager.errorHttpDoc.downloadBlobDoc(flowId, resourceId, reqAndResKey));
    },
    [flowId, resourceId, reqAndResKey, dispatch],
  );

  const isRetryDataChanged = updatedRetryData && !isEqual(retryData, updatedRetryData);

  const handleClose = useCallback(() => {
    dispatch(actions.errorManager.retryData.updateUserRetryData({retryId}));
    onClose?.();
  }, [dispatch, onClose, retryId]);

  const handleCancel = useHandleCancelBasic({isDirty: isRetryDataChanged, onClose: handleClose, handleSave: updateRetry});

  useClearAsyncStateOnUnmount(ERROR_DETAIL_ACTIONS_ASYNC_KEY);
  useTriggerCancelFromContext(ERROR_DETAIL_ACTIONS_ASYNC_KEY, handleCancel);

  let retryButtonLabel = 'Retry & next';
  let dataTestForRetryButton = 'retryAndNext';

  if (isResolved) {
    retryButtonLabel = 'Save & retry';
    dataTestForRetryButton = undefined;
  } else if (isRetryDataChanged) {
    retryButtonLabel = 'Save, retry & next';
    dataTestForRetryButton = 'saveRetryAndNext';
  }

  if (mode === 'editRetry' && !isFlowDisabled) {
    return (
      <ActionGroup>
        <FilledButton
          disabled={isResolved && !isRetryDataChanged}
          onClick={isRetryDataChanged ? handleSaveAndRetry : handleRetry}
          data-test={dataTestForRetryButton}>
          {retryButtonLabel}
        </FilledButton>
        <FilledButton
          disabled={!isRetryDataChanged}
          onClick={updateRetry}
          data-test={!isResolved ? 'saveAndNext' : undefined}>
          {isResolved ? 'Save & close' : 'Save & next'}
        </FilledButton>
        {!isResolved && (
          <OutlinedButton onClick={resolve} data-test="resolveAndNext">
            Resolve &amp; next
          </OutlinedButton>
        )}
        {!!onClose && (
          <TextButton onClick={handleCancel}>
            Close
          </TextButton>
        )}
      </ActionGroup>
    );
  }

  return (
    <ActionGroup>
      {!isResolved && (
        <OutlinedButton onClick={resolve}>
          Resolve &amp; next
        </OutlinedButton>
      )}
      {
        !!s3BlobKey && (
        <OutlinedButton color="secondary" onClick={handleDownloadBlob}>
          Download file
        </OutlinedButton>
        )
      }
      {!!onClose && (
        <TextButton onClick={onClose}>
          Close
        </TextButton>
      )}
    </ActionGroup>
  );
}
