import React, { useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { isEqual } from 'lodash';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import { TextButton, FilledButton, OutlinedButton } from '../../../Buttons';
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
    // handlePreviousError,
    // disabledPrevious,
    // disableNext,
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

  const updateRetry = useCallback(closeAfterSave => {
    dispatch(
      actions.errorManager.retryData.updateRequest({
        flowId,
        resourceId,
        retryId,
        retryData: updatedRetryData,
      })
    );
    closeAfterSave ? onClose() : handleNextError(true);
  }, [dispatch, flowId, resourceId, retryId, updatedRetryData, onClose, handleNextError]);

  const resolve = useCallback(() => {
    dispatch(
      actions.errorManager.flowErrorDetails.resolve({
        flowId,
        resourceId,
        errorIds: [errorId],
      })
    );
    handleNextError(true);
  }, [dispatch, errorId, flowId, handleNextError, resourceId]);

  const handleSaveAndRetry = useCallback(() => {
    dispatch(
      actions.errorManager.flowErrorDetails.saveAndRetry({
        flowId,
        resourceId,
        retryId,
        retryData: updatedRetryData,
      })
    );
    handleNextError(true);
  }, [dispatch, flowId, handleNextError, resourceId, retryId, updatedRetryData]);

  const handleDownloadBlob = useCallback(
    () => {
      dispatch(actions.errorManager.errorHttpDoc.downloadBlobDoc(flowId, resourceId, reqAndResKey));
    },
    [flowId, resourceId, reqAndResKey, dispatch],
  );

  const isRetryDataChanged = updatedRetryData && !isEqual(retryData, updatedRetryData);

  const handleClose = useCallback(() => {
    dispatch(actions.errorManager.retryData.updateUserRetryData({retryId, retryData: undefined}));
    onClose && onClose();
  }, [dispatch, onClose, retryId]);

  const handleCancel = useHandleCancelBasic({isDirty: isRetryDataChanged, onClose: handleClose, handleSave: updateRetry});

  useClearAsyncStateOnUnmount(ERROR_DETAIL_ACTIONS_ASYNC_KEY);
  useTriggerCancelFromContext(ERROR_DETAIL_ACTIONS_ASYNC_KEY, handleCancel);

  if (mode === 'editRetry' && !isFlowDisabled) {
    return (
      <ActionGroup>
        <FilledButton onClick={handleSaveAndRetry}>
          {isRetryDataChanged ? 'Save, retry & next' : 'Retry & next'}
        </FilledButton>
        <FilledButton disabled={!isRetryDataChanged} onClick={updateRetry}>
          Save &amp; next
        </FilledButton>
        {!isResolved && (
          <OutlinedButton onClick={resolve}>
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
