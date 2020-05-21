import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import Icon from '../../../../icons/RevokeTokenIcon';
import useConfirmDialog from '../../../../ConfirmDialog';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';

export default {
  component: function Revoke({ resource: connection = {} }) {
    const { _id: connectionId, name: connectionName } = connection;
    const dispatch = useDispatch();
    const { confirmDialog } = useConfirmDialog();
    const revokeConnection = useCallback(() => {
      dispatch(actions.connection.requestRevoke(connectionId));
    }, [connectionId, dispatch]);
    const handleRevokeClick = useCallback(() => {
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

    return (
      <IconButtonWithTooltip
        tooltipProps={{
          title: 'Revoke',
        }}
        data-test="revoke"
        size="small"
        onClick={handleRevokeClick}>
        <Icon />
      </IconButtonWithTooltip>
    );
  },
};
