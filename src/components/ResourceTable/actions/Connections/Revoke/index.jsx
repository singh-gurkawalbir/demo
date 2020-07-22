import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import RevokeTokenIcon from '../../../../icons/RevokeTokenIcon';
import useConfirmDialog from '../../../../ConfirmDialog';

export default {
  label: 'Revoke',
  icon: RevokeTokenIcon,
  component: function Revoke({ rowData = {} }) {
    const { _id: connectionId } = rowData;
    const dispatch = useDispatch();
    const { confirmDialog } = useConfirmDialog();
    const revokeConnection = useCallback(() => {
      dispatch(actions.connection.requestRevoke(connectionId));
    }, [connectionId, dispatch]);
    const confirmRevoke = useCallback(() => {
      confirmDialog({
        title: 'Confirm revoke',
        message: 'Are you sure you want to revoke this token?',
        buttons: [
          {
            label: 'Revoke',
            onClick: revokeConnection,
          },
          {
            label: 'Cancel',
            color: 'secondary',
          },
        ],
      });
    }, [confirmDialog, revokeConnection]);

    useEffect(() => {
      confirmRevoke();
    }, [confirmRevoke]);

    return null;
  },
};
