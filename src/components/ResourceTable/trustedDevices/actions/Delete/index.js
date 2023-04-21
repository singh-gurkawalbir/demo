import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import { message } from '../../../../../utils/messageStore';
import { MFA_DELETE_DEVICE_ASYNC_KEY, FORM_SAVE_STATUS } from '../../../../../constants';
import TrashIcon from '../../../../icons/TrashIcon';
import useConfirmDialog from '../../../../ConfirmDialog';
import useEnqueueSnackbar from '../../../../../hooks/enqueueSnackbar';

export default {
  key: 'deleteDevice',
  useLabel: () => 'Delete device',
  icon: TrashIcon,
  mode: 'delete',
  Component: ({ rowData }) => {
    const { _id: deviceId} = rowData;
    const dispatch = useDispatch();
    const [enquesnackbar] = useEnqueueSnackbar();
    const { confirmDialog } = useConfirmDialog();
    const deleteDeviceSuccess = useSelector(state => selectors.asyncTaskStatus(state, MFA_DELETE_DEVICE_ASYNC_KEY) === FORM_SAVE_STATUS.COMPLETE);
    const handleClick = useCallback(() => {
      confirmDialog({
        title: 'Delete trusted MFA device?',
        message: message.MFA.DELETE_TRUSTED_DEVICE,
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

    useEffect(() => {
      handleClick();
    }, [handleClick]);

    useEffect(() => {
      if (deleteDeviceSuccess) {
        enquesnackbar({
          message: message.MFA.DELETE_DEVICE_SUCCESS,
          variant: 'success',
        });
        dispatch(actions.asyncTask.clear(MFA_DELETE_DEVICE_ASYNC_KEY));
      }
    }, [deleteDeviceSuccess, enquesnackbar, dispatch]);

    return null;
  },
};
