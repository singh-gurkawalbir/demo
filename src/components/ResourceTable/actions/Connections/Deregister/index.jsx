import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../../reducers';
import actions from '../../../../../actions';
import CloseIcon from '../../../../icons/CloseIcon';
import useConfirmDialog from '../../../../ConfirmDialog';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';

export default {
  key: 'deRegister',
  component: function Deregister({ resource: connection, integrationId }) {
    const isStandalone = integrationId === 'none';
    const { _id: connectionId, name: connectionName } = connection;
    const dispatch = useDispatch();
    const { confirmDialog } = useConfirmDialog();
    // todo when to show deregister
    const canAccess = useSelector(
      state =>
        selectors.resourcePermissions(
          state,
          'integrations',
          integrationId,
          'connections'
        ).edit
    );
    const deregiterConnection = useCallback(() => {
      dispatch(
        actions.connection.requestDeregister(connection._id, integrationId)
      );
    }, [connection._id, dispatch, integrationId]);
    const handleDeregisterClick = useCallback(() => {
      const message = [
        'Are you sure you want to deregister',
        connectionName || connectionId,
        'connection from this integration?',
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
            onClick: deregiterConnection,
          },
        ],
      });
    }, [confirmDialog, connectionId, connectionName, deregiterConnection]);

    if (!canAccess || isStandalone) {
      return null;
    }

    return (
      <IconButtonWithTooltip
        tooltipProps={{
          title: 'Deregister',
        }}
        data-test="closeDeregisterModal"
        size="small"
        onClick={handleDeregisterClick}>
        <CloseIcon />
      </IconButtonWithTooltip>
    );
  },
};
