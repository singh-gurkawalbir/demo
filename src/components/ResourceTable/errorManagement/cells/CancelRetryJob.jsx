import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import { JOB_STATUS } from '../../../../constants';
import messageStore from '../../../../utils/messageStore';
import TextButton from '../../../Buttons/TextButton';
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
  }, [dispatch, flowId, resourceId, retryJob._id]);

  const handleCallBack = useCallback(
    () => {
      confirmDialog({
        title: 'Confirm cancel retry',
        message: messageStore('CANCEL_RETRY_CONFIRM'),
        buttons: [
          {
            label: 'Cancel retry',
            onClick: () => {
              handleCancelRetryJob();
            },
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
        disabled={retryJob.status !== JOB_STATUS.RUNNING}
        >
        Cancel retry
      </TextButton>
    ),
    [handleCallBack, retryJob.status])
  );
}
