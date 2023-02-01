import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../../actions';
import CancelIcon from '../../../../../icons/CancelIcon';
import useConfirmDialog from '../../../../../ConfirmDialog';
import { message } from '../../../../../../utils/messageStore';

export default {
  key: 'account-dashboard-cancel-run',
  useLabel: () => 'Cancel run',
  icon: CancelIcon,
  useOnClick: rowData => {
    const dispatch = useDispatch();

    const { confirmDialog } = useConfirmDialog();
    const confirmCancel = useCallback(() => {
      confirmDialog({
        title: 'Confirm cancel',
        message: message.JOBS.CANCEL_JOB,
        buttons: [
          {
            label: 'Yes, cancel',
            onClick: () => {
              dispatch(actions.job.dashboard.running.cancel({ jobId: rowData._id }));
            },
          },
          {
            label: 'No, go back',
            variant: 'text',
          },
        ],
      });
    }, [confirmDialog, dispatch, rowData._id]);

    return confirmCancel;
  },
};
