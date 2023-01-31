import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectors } from '../../../reducers';
import useConfirmDialog from '../../../components/ConfirmDialog';
import getRoutePath from '../../../utils/routePaths';
import { getIntegrationAppUrlName } from '../../../utils/integrationApps';
import { emptyObject, INTEGRATION_ACCESS_LEVELS, USER_ACCESS_LEVELS } from '../../../constants';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import { message } from '../../../utils/messageStore';
import actions from '../../../actions';

export default function useHandleDelete(_integrationId, ops = emptyObject) {
  // this hook returns a callback function to handle deleting/uninstalling integrations
  const history = useHistory();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const { confirmDialog } = useConfirmDialog();
  const { supportsMultiStore, _connectorId, name } = ops;

  const integrationAppTileName = getIntegrationAppUrlName(name) || '';
  const accessLevel = useSelector(
    state => selectors.resourcePermissions(state).accessLevel
  );
  const dispatch = useDispatch();

  const resourceReferences = useSelector(state =>
    selectors.resourceReferences(state)
  );

  const cantDelete = resourceReferences?.some(ref => ref.resourceType === 'flows');
  const hasConnectorDependency = resourceReferences?.some(ref => ref.resourceType === 'connectors');

  // For IA
  const handleUninstall = useCallback(() => {
    if (![INTEGRATION_ACCESS_LEVELS.OWNER, USER_ACCESS_LEVELS.ACCOUNT_ADMIN].includes(accessLevel)) {
      enqueueSnackbar({message: message.INTEGRATION.CONTACT_OWNER, variant: 'error'});
    } else if (supportsMultiStore) {
      enqueueSnackbar({ message: message.INTEGRATION.UNINSTALL_SELECT_STORE, variant: 'error' });
    } else {
      confirmDialog({
        title: 'Confirm uninstall',
        message: message.SURE_UNINSTALL,
        buttons: [
          {
            label: 'Uninstall',
            onClick: () => {
              history.push(
                getRoutePath(
                  `integrationapps/${integrationAppTileName}/${_integrationId}/uninstall`
                )
              );
            },
          },
          {
            label: 'Cancel',
            variant: 'text',
          },
        ],
      });
    }
  }, [accessLevel, confirmDialog, enqueueSnackbar, history, integrationAppTileName, _integrationId, supportsMultiStore]);

  // For Diy/templates
  if (showSnackbar && (cantDelete || hasConnectorDependency)) {
    enqueueSnackbar({
      message: cantDelete ? message.INTEGRATION.INTEGRATION_DELETE_VALIDATE : message.INTEGRATION.INTEGRATION_WITH_CONNECTORS_DELETE_VALIDATE,
      variant: 'info',
    });
    dispatch(actions.resource.clearReferences());
    setShowSnackbar(false);
  }
  const handleDelete = useCallback(() => {
    confirmDialog({
      title: 'Confirm delete',
      message: message.INTEGRATION.DELETE_INTEGRATION,
      buttons: [
        {
          label: 'Delete',
          error: true,
          onClick: () => {
            dispatch(actions.resource.integrations.delete(_integrationId));
            setShowSnackbar(true);
          },
        },
        {
          label: 'Cancel',
          variant: 'text',
        },
      ],
    });
  }, [confirmDialog, dispatch, _integrationId]);

  return _connectorId ? handleUninstall : handleDelete;
}
