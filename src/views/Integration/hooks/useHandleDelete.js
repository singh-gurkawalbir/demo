import { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSelectorMemo } from '../../../hooks';
import { selectors } from '../../../reducers';
import useConfirmDialog from '../../../components/ConfirmDialog';
import getRoutePath from '../../../utils/routePaths';
import { getIntegrationAppUrlName } from '../../../utils/integrationApps';
import { emptyObject, INTEGRATION_ACCESS_LEVELS, STANDALONE_INTEGRATION, USER_ACCESS_LEVELS } from '../../../utils/constants';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import { INTEGRATION_DELETE_VALIDATE } from '../../../utils/messageStore';
import actions from '../../../actions';

export default function useHandleDelete(_integrationId) {
  // this hook returns a callback function to handle deleting/uninstalling integrations
  const history = useHistory();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const { confirmDialog } = useConfirmDialog();
  const integration = useSelectorMemo(selectors.mkIntegrationAppSettings, _integrationId) || emptyObject;
  const integrationAppTileName = getIntegrationAppUrlName(integration.name) || '';
  const supportsMultiStore = integration?.settings?.supportsMultiStore;
  const accessLevel = useSelector(
    state => selectors.resourcePermissions(state).accessLevel
  );
  const {_connectorId} = integration;
  const dispatch = useDispatch();
  const flowsFilterConfig = useMemo(
    () => ({
      type: 'flows',
      filter: {
        _integrationId:
          _integrationId === STANDALONE_INTEGRATION.id
            ? undefined
            : _integrationId,
      },
    }),
    [_integrationId]
  );
  const flows = useSelectorMemo(
    selectors.makeResourceListSelector,
    flowsFilterConfig
  ).resources;
  const cantDelete = flows.length > 0;

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
  const handleDelete = useCallback(() => {
    if (cantDelete) {
      enqueueSnackbar({
        message: INTEGRATION_DELETE_VALIDATE,
        variant: 'info',
      });

      return;
    }
    confirmDialog({
      title: 'Confirm delete',
      message: 'Are you sure you want to delete this integration?',
      buttons: [
        {
          label: 'Delete',
          onClick: () => {
            dispatch(actions.resource.integrations.delete(_integrationId));
          },
        },
        {
          label: 'Cancel',
          variant: 'text',
        },
      ],
    });
  }, [cantDelete, confirmDialog, enqueueSnackbar, dispatch, _integrationId]);

  return _connectorId ? handleUninstall : handleDelete;
}
