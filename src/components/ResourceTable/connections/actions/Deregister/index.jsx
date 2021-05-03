import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import CloseIcon from '../../../../icons/CloseIcon';
import useConfirmDialog from '../../../../ConfirmDialog';
import { useGetTableContext } from '../../../../CeligoTable/TableContext';

export default {
  useLabel: () => 'Deregister connection',
  icon: CloseIcon,
  useHasAccess: () => {
    const {integrationId} = useGetTableContext();

    const isStandalone = integrationId === 'none';
    const hasAccess = useSelector(state => selectors.resourcePermissions(
      state,
      'integrations',
      integrationId,
      'connections'
    ))?.edit;

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
      confirmDialog({
        title: 'Confirm deregister',
        message: 'Are you sure you want to deregister this connection? The connection will no longer be accessible to this integration.',
        buttons: [
          {
            label: 'Deregister',
            onClick: deregisterConnection,
          },
          {
            label: 'Cancel',
            color: 'secondary',
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
