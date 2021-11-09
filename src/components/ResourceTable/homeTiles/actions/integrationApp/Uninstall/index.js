import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import TrashIcon from '../../../../../icons/TrashIcon';
import { selectors } from '../../../../../../reducers';
import useSelectorMemo from '../../../../../../hooks/selectors/useSelectorMemo';
import useConfirmDialog from '../../../../../ConfirmDialog';
import getRoutePath from '../../../../../../utils/routePaths';
import { getIntegrationAppUrlName } from '../../../../../../utils/integrationApps';
import { emptyObject, INTEGRATION_ACCESS_LEVELS, USER_ACCESS_LEVELS } from '../../../../../../utils/constants';
import useEnqueueSnackbar from '../../../../../../hooks/enqueueSnackbar';

export default {
  key: 'uninstallConnector',
  useLabel: () => 'Uninstall integration',
  icon: TrashIcon,
  useHasAccess: rowData => {
    const {_integrationId} = rowData;

    const canUninstall = useSelector(state => !selectors.isFormAMonitorLevelAccess(state, _integrationId));

    return canUninstall;
  },
  useOnClick: rowData => {
    const {_integrationId} = rowData;
    const history = useHistory();
    const [enquesnackbar] = useEnqueueSnackbar();
    const { confirmDialog } = useConfirmDialog();
    const integration = useSelectorMemo(selectors.mkIntegrationAppSettings, _integrationId) || emptyObject;
    const integrationAppTileName = getIntegrationAppUrlName(integration.name) || '';
    const supportsMultiStore = integration?.settings?.supportsMultiStore;
    const accessLevel = rowData.integration?.permissions?.accessLevel;

    const handleUninstall = useCallback(() => {
      if (![INTEGRATION_ACCESS_LEVELS.OWNER, USER_ACCESS_LEVELS.ACCOUNT_ADMIN].includes(accessLevel)) {
        enquesnackbar({ message: 'Contact your account owner to uninstall this integration app.' });
      } else if (supportsMultiStore) {
        enquesnackbar({ message: 'To uninstall, please navigate to Admin → Uninstall inside the Integration App and select the desired store.', variant: 'error' });
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
    }, [accessLevel, confirmDialog, enquesnackbar, history, integrationAppTileName, _integrationId, supportsMultiStore]);

    return handleUninstall;
  },
};
