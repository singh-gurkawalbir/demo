import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as selectors from '../../../../../reducers';
import actions from '../../../../../actions';
import CloseIcon from '../../../../icons/CloseIcon';
import useConfirmDialog from '../../../../ConfirmDialog';

export default {
  label: 'Deregister',
  icon: CloseIcon,
  hasAccess: ({ state, integrationId }) => {
    const isStandalone = integrationId === 'none';
    const hasAccess = selectors.resourcePermissions(
      state,
      'integrations',
      integrationId,
      'connections'
    ).edit;

    return hasAccess && !isStandalone;
  },
  component: function Deregister({ rowData = {}, integrationId }) {
    const { _id: connectionId } = rowData;
    const dispatch = useDispatch();
    const { confirmDialog } = useConfirmDialog();
    const deregisterConnection = useCallback(() => {
      dispatch(
        actions.connection.requestDeregister(connectionId, integrationId)
      );
    }, [connectionId, dispatch, integrationId]);
    const confirmDeregister = useCallback(() => {
      const message = 'This connection will no longer be accessible in this integration.';

      confirmDialog({
        title: 'Deregister connection?',
        message,
        buttons: [
          {
            label: 'Cancel',
          },
          {
            label: 'Deregister connection',
            onClick: deregisterConnection,
          },
        ],
      });
    }, [confirmDialog, deregisterConnection]);

    useEffect(() => {
      confirmDeregister();
    }, [confirmDeregister]);

    return null;
  },
};
