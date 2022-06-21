import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import actions from '../../../../../actions';
import TrashIcon from '../../../../icons/TrashIcon';
import useConfirmDialog from '../../../../ConfirmDialog';

export default {
  key: 'deleteDevice',
  useLabel: () => 'Delete device',
  icon: TrashIcon,
  useOnClick: rowData => {
    const { _id: deviceId} = rowData;
    const dispatch = useDispatch();
    const { confirmDialog } = useConfirmDialog();

    const handleClick = useCallback(() => {
      confirmDialog({
        title: 'Delete trusted MFA device?',
        message: "Are you sure you want to delete your trusted MFA device? You'll need to re-authenticate your account the next time you sign into integrator.io with the device.",
        buttons: [
          {
            label: 'Delete',
            error: true,
            onClick: () => {
              dispatch(actions.mfa.deleteDevice(deviceId));
            },
          },
          {
            label: 'Cancel',
            variant: 'text',
          },
        ],
      });
    }, [confirmDialog, dispatch, deviceId]);

    return handleClick;
  },
};
