import {useEffect, useCallback} from 'react';
import { useDispatch } from 'react-redux';
import useConfirmDialog from '../../../../../../../components/ConfirmDialog';
import actions from '../../../../../../../actions';
import { JOB_STATUS } from '../../../../../../../utils/constants';

export default {
  label: 'Cancel',
  component: function CancelJob({ rowData }) {
    const dispatch = useDispatch();
    const jobId = rowData.status === JOB_STATUS.QUEUED ? rowData._id : rowData?._flowJobId;
    const { confirmDialog } = useConfirmDialog();
    const handleCancel = useCallback(() => {
      confirmDialog({
        title: 'Confirm cancel',
        message:
                    'Are you sure you want to cancel? You have unsaved changes that will be lost if you proceed. Please note that canceling this job will delete all associated data currently queued for processing.',
        buttons: [
          {
            label: 'Yes, cancel',
            onClick: () => {
              // TODO: check for cases to handle
              dispatch(actions.job.cancel({ jobId }));
            },
          },
          {
            label: 'No, go back',
            color: 'secondary',
          },
        ],
      });
    }, [jobId, dispatch, confirmDialog]);

    useEffect(() => handleCancel(), [handleCancel]);

    return null;
  },

};
