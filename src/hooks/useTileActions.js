import {useSelector, shallowEqual} from 'react-redux';
import {TILE_STATUS} from '../utils/constants';
import CopyIcon from '../components/icons/CopyIcon';
import DownloadIcon from '../components/icons/DownloadIcon';
import TrashIcon from '../components/icons/TrashIcon';
import { selectors } from '../reducers';
import integrationAppUtil, { isIntegrationAppVerion2 } from '../utils/integrationApps';
import ReactivateIcon from '../components/icons/ReactivateIcon';
import RenewIcon from '../components/icons/RenewIcon';

export default function useTileActions(integration) {
  const tileActions = [];

  console.log('integration', integration);
  // const handleClone = () => {
  //   history.push(getRoutePath(`/clone/integrations/${integration._id}/preview`));
  // };
  const handleAction = action => {
    switch (action) {
      case 'clone':
        // handleClone();
        break;
      case 'download':
        // handleDownload();
        break;
      case 'delete':
        // handleDelete();
        break;
      default: break;
    }
  };

  const {_id: integrationId, _connectorId} = integration || {};
  const { supportsMultiStore } = integration?.settings || {};
  const isIntegrationApp = _connectorId;
  const canUninstall = useSelector(state => !selectors.isFormAMonitorLevelAccess(state, integrationId));
  const {expired, trialExpired, showTrialLicenseMessage, resumable} = useSelector(state =>
    selectors.tileLicenseDetails(state, integration), shallowEqual
  );
  const { canClone, canDelete, accessLevel } = useSelector(state => {
    const {clone: canClone, delete: canDelete, accessLevel} = selectors.resourcePermissions(
      state,
      'integrations',
      integrationId
    );

    return {
      canClone,
      canDelete,
      accessLevel,
    };
  }, shallowEqual);

  if (!integration) return tileActions;
  if (!isIntegrationApp) { // diy / template integrations
    if (canClone) {
      tileActions.push(
        {
          Icon: CopyIcon,
          action: 'clone',
          label: 'Clone integration',
        }
      );
    }
    if (canDelete) {
      tileActions.push(
        {
          Icon: TrashIcon,
          action: 'delete',
          label: 'Delete integration',
        },
      );
    }
    tileActions.push({
      Icon: DownloadIcon,
      action: 'download',
      label: 'Download integration',
    });
  } else { // Integration app
    const isCloningSupported = integration &&
            integrationAppUtil.isCloningSupported(
              integration._connectorId,
              integration.name
            ) && accessLevel !== 'monitor' &&
            !supportsMultiStore;
    const isIntegrationV2 = isIntegrationAppVerion2(integration, true);
    const single = integration.status === TILE_STATUS.IS_PENDING_SETUP || (!trialExpired && (isIntegrationV2 || !expired));

    if (single && !showTrialLicenseMessage) {
      resumable ? tileActions.push(
        {
          Icon: ReactivateIcon,
          action: 'clone',
          label: 'Reactivate integration',
        }
      ) : tileActions.push(
        {
          Icon: RenewIcon,
          action: 'clone',
          label: 'Renew integration',
        }
      );
    }
    if (isCloningSupported) {
      tileActions.push(
        {
          Icon: CopyIcon,
          action: 'clone',
          label: 'Clone integration',
        }
      );
    }
    if (canUninstall) {
      tileActions.push({
        Icon: TrashIcon,
        action: 'uninstall',
        label: 'Uninstall integration',
      });
    }
  }

  return {tileActions, handleAction};
}
