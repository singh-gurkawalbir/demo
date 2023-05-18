import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { TextButton } from '@celigo/fuse-ui';
import actions from '../../../../actions';
import { JOB_STATUS } from '../../../../constants';
import { message } from '../../../../utils/messageStore';
import { useGetTableContext } from '../../../CeligoTable/TableContext';
import useConfirmDialog from '../../../ConfirmDialog';
import CancelIcon from '../../../icons/CancelIcon';

export default function CancelRetryJob({retryJob}) {
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();

  const {
    flowId,
    resourceId,
  } = useGetTableContext();
  const handleCancelRetryJob = useCallback(() => {
    dispatch(
      actions.errorManager.retries.cancelRequest({
        flowId,
        resourceId,
        jobId: retryJob._id,
      })
    );
    dispatch(
      actions.analytics.gainsight.trackEvent('RETRIES_TAB_CANCEL_RETRY')
    );
  }, [dispatch, flowId, resourceId, retryJob._id]);

  const handleCallBack = useCallback(
    () => {
      confirmDialog({
        title: 'Confirm cancel retry',
        message: message.RETRY.CANCEL_RETRY_CONFIRM,
        buttons: [
          {
            label: 'Cancel retry',
            onClick: handleCancelRetryJob,
          },
          {
            label: 'No, go back',
            variant: 'text',
          },
        ],
      });
    },
    [confirmDialog, handleCancelRetryJob],
  );

  return (
    useMemo(() => (
      <TextButton
        startIcon={<CancelIcon />}
        onClick={handleCallBack}
        disabled={![JOB_STATUS.QUEUED, JOB_STATUS.RUNNING].includes(retryJob.status)}
        >
        Cancel retry
      </TextButton>
    ),
    [handleCallBack, retryJob.status])
  );
}
