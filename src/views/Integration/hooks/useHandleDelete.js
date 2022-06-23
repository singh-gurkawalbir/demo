import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectors } from '../../../reducers';
import useConfirmDialog from '../../../components/ConfirmDialog';
import getRoutePath from '../../../utils/routePaths';
import { getIntegrationAppUrlName } from '../../../utils/integrationApps';
import { emptyObject, INTEGRATION_ACCESS_LEVELS, USER_ACCESS_LEVELS } from '../../../utils/constants';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import messageStore from '../../../utils/messageStore';
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
      enqueueSnackbar({ message: 'Contact your account owner to uninstall this integration app.' });
    } else if (supportsMultiStore) {
      enqueueSnackbar({ message: 'To uninstall, please navigate to Admin → Uninstall inside the Integration App and select the desired store.', variant: 'error' });
    } else {
      confirmDialog({
        title: 'Confirm uninstall',
        message: 'Are you sure you want to uninstall?',
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
  if (showSnackbar && cantDelete) {
    enqueueSnackbar({
      message: messageStore('INTEGRATION_DELETE_VALIDATE'),
      variant: 'info',
    });
    dispatch(actions.resource.clearReferences());
    setShowSnackbar(false);
  }
  if (showSnackbar && !cantDelete && hasConnectorDependency) {
    enqueueSnackbar({
      message: messageStore('INTEGRATION_WITH_CONNECTORS_DELETE_VALIDATE'),
      variant: 'info',
    });
    dispatch(actions.resource.clearReferences());
    setShowSnackbar(false);
  }
  const handleDelete = useCallback(() => {
    confirmDialog({
      title: 'Confirm delete',
      message: 'Are you sure you want to delete this integration?',
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
