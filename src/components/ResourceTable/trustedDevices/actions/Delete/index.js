import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import actions from '../../../../../actions';
import messageStore from '../../../../../utils/messageStore';
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
        message: messageStore('DELETE_TRUSTED_DEVICE'),
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
