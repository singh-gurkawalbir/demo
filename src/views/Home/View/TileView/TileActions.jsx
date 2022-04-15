import React, { useCallback } from 'react';
import {useSelector, shallowEqual, useDispatch} from 'react-redux';
import { useHistory } from 'react-router-dom';
import EllipsisActionMenu from '../../../../components/EllipsisActionMenu';
import actions from '../../../../actions';
import CopyIcon from '../../../../components/icons/CopyIcon';
import DownloadIcon from '../../../../components/icons/DownloadIcon';
import TrashIcon from '../../../../components/icons/TrashIcon';
import { selectors } from '../../../../reducers';
import integrationAppUtil from '../../../../utils/integrationApps';
import getRoutePath from '../../../../utils/routePaths';
import useHandleDelete from '../../../Integration/hooks/useHandleDelete';
import { STANDALONE_INTEGRATION, TILE_STATUS } from '../../../../utils/constants';

export default function TileActions({tile}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { _integrationId, _connectorId, name, status, supportsMultiStore, mode } = tile || {};
  const isStandalone = STANDALONE_INTEGRATION.id === _integrationId;

  const canDownloadDiy = useSelector(state => selectors.resourcePermissionsForTile(state, 'integrations', undefined, tile)?.create);
  const { clone: canCloneDiy, delete: canDeleteDiy, accessLevel } = useSelector(state => selectors.resourcePermissionsForTile(
    state,
    'integrations',
    _integrationId,
    tile
  ), shallowEqual);

  const canUninstallIA = useSelector(state => !selectors.isFormAMonitorLevelAccess(state, _integrationId));

  console.log('canUninstallIA', canUninstallIA);
  const isConfigPending = status === TILE_STATUS.IS_PENDING_SETUP || status === TILE_STATUS.UNINSTALL;

  const canCloneIA = integrationAppUtil.isCloningSupported(_connectorId, name) && accessLevel !== 'monitor' && !supportsMultiStore;

  const handleClone = () => { // for IA and DIY/templates
    history.push(getRoutePath(`/clone/integrations/${_integrationId}/preview`));
  };

  const handleDelete = useHandleDelete(_integrationId, { _connectorId, supportsMultiStore, name, mode});

  const handleDownload = useCallback(() => { // for DIY/templates
    dispatch(actions.template.generateZip(_integrationId));
  }, [_integrationId, dispatch]);

  const handleAction = action => {
    switch (action) {
      case 'cloneIntegration': // for IA and DIY/templates
      case 'cloneIntegrationApp':
        handleClone();
        break;
      case 'generateTemplateZip': // for DIY/templates
        handleDownload();
        break;
      case 'deleteIntegration': // for DIY/templates
      case 'uninstallConnector': // for IA
        handleDelete();
        break;
      default:
    }
  };

  const tileActions = [];

  if (!_connectorId && !isStandalone) { // diy / template integrations except standalone flows
    if (canCloneDiy && !isConfigPending) {
      tileActions.push(
        {
          Icon: CopyIcon,
          action: 'cloneIntegration',
          label: 'Clone integration',
        }
      );
    }
    if (canDownloadDiy && !isConfigPending) {
      tileActions.push({
        Icon: DownloadIcon,
        action: 'generateTemplateZip',
        label: 'Download integration',
      });
    }
    if (canDeleteDiy) {
      tileActions.push(
        {
          Icon: TrashIcon,
          action: 'deleteIntegration',
          label: 'Delete integration',
        },
      );
    }
  } else if (_connectorId) { // Integration app
    if (canCloneIA && !isConfigPending) {
      tileActions.push(
        {
          Icon: CopyIcon,
          action: 'cloneIntegrationApp',
          label: 'Clone integration',
        }
      );
    }
    if (canUninstallIA) {
      tileActions.push({
        Icon: TrashIcon,
        action: 'uninstallConnector',
        label: 'Uninstall integration',
      });
    }
  }

  return tileActions.length > 0 ? (
    <EllipsisActionMenu
      actionsMenu={tileActions}
      onAction={handleAction}
      alignment="vertical" />
  ) : null;
}
