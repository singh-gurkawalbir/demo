import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import RevokeTokenIcon from '../../../../icons/RevokeTokenIcon';
import useConfirmDialog from '../../../../ConfirmDialog';

export default {
  label: 'Revoke',
  icon: RevokeTokenIcon,
  component: function Revoke({ resource: connection = {} }) {
    const { _id: connectionId, name: connectionName } = connection;
    const dispatch = useDispatch();
    const { confirmDialog } = useConfirmDialog();
    const revokeConnection = useCallback(() => {
      dispatch(actions.connection.requestRevoke(connectionId));
    }, [connectionId, dispatch]);
    const confirmRevoke = useCallback(() => {
      const message = [
        'Are you sure you want to revoke',
        connectionName || connectionId,
        'token?',
      ].join(' ');

      confirmDialog({
        title: 'Confirm',
        message,
        buttons: [
          {
            label: 'Cancel',
          },
          {
            label: 'Yes',
            onClick: revokeConnection,
          },
        ],
      });
    }, [confirmDialog, connectionId, connectionName, revokeConnection]);

    useEffect(() => {
      confirmRevoke();
    }, [confirmRevoke]);

    return null;
  },
};
