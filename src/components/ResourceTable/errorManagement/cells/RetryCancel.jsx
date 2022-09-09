import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import { JOB_STATUS } from '../../../../constants';
import TextButton from '../../../Buttons/TextButton';
import CancelIcon from '../../../icons/CancelIcon';

export default function RetryCancel({flowId, resourceId, retryJob}) {
  const dispatch = useDispatch();

  const handleCallBack = useCallback(
    () => {
      dispatch(
        actions.errorManager.retries.cancelRequest({
          flowId,
          resourceId,
          jobId: retryJob._id,
        })
      );
    },
    [dispatch, flowId, resourceId, retryJob._id],
  );

  return (
    useMemo(() => (
      <TextButton
        startIcon={<CancelIcon />}
        onClick={handleCallBack}
        disabled={retryJob.status !== JOB_STATUS.RUNNING}
        >
        Cancel retry
      </TextButton>
    ),
    [handleCallBack, retryJob.status])
  );
}
