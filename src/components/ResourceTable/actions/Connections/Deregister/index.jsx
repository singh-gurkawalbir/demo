import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../../reducers';
import actions from '../../../../../actions';
import CloseIcon from '../../../../icons/CloseIcon';
import useConfirmDialog from '../../../../ConfirmDialog';

export default {
  label: 'Deregister',
  icon: CloseIcon,
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
    const deregisterConnection = useCallback(() => {
      dispatch(
        actions.connection.requestDeregister(connection._id, integrationId)
      );
    }, [connection._id, dispatch, integrationId]);
    const confirmDeregister = useCallback(() => {
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
            onClick: deregisterConnection,
          },
        ],
      });
    }, [confirmDialog, connectionId, connectionName, deregisterConnection]);

    useEffect(() => {
      if (canAccess && !isStandalone) {
        confirmDeregister();
      }
    }, [canAccess, confirmDeregister, isStandalone]);

    return null;
  },
};
