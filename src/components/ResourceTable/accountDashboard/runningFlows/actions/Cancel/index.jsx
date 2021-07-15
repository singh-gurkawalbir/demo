import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../../actions';
import CancelIcon from '../../../../../icons/CancelIcon';
import useConfirmDialog from '../../../../../ConfirmDialog';

export default {
  key: 'cancel',
  useLabel: () => 'Cancel',
  icon: CancelIcon,
  useOnClick: rowData => {
    const dispatch = useDispatch();

    const { confirmDialog } = useConfirmDialog();
    const confirmCancel = useCallback(() => {
      confirmDialog({
        title: 'Confirm cancel',
        message:
          'Are you sure you want to cancel?  Please note that canceling this job will discard all associated data currently queued for processing.',
        buttons: [
          {
            label: 'Yes, cancel',
            onClick: () => {
              dispatch(actions.job.cancel({ jobId: rowData._id, isDashboardJob: true }));
            },
          },
          {
            label: 'No, go back',
            color: 'secondary',
          },
        ],
      });
    }, [confirmDialog, dispatch, rowData._id]);

    return confirmCancel;
  },
};
