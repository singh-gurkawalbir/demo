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

export default function TileActions({tile}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const {_integrationId, _connectorId, name} = tile || {};
  const supportsMultiStore = useSelector(state =>
    (selectors.resource(state, 'integrations', _integrationId))?.settings?.supportsMultiStore
  );
  const canUninstall = useSelector(state => !selectors.isFormAMonitorLevelAccess(state, _integrationId));
  const { canClone, canDelete, accessLevel } = useSelector(state => {
    const {clone: canClone, delete: canDelete, accessLevel} = selectors.resourcePermissions(
      state,
      'integrations',
      _integrationId
    );

    return {
      canClone,
      canDelete,
      accessLevel,
    };
  }, shallowEqual);

  const handleClone = () => { // for IA and DIY/templates
    history.push(getRoutePath(`/clone/integrations/${_integrationId}/preview`));
  };

  const handleDelete = useHandleDelete(_integrationId);

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
      default: break;
    }
  };

  const tileActions = [];

  if (!_connectorId) { // diy / template integrations
    if (canClone) {
      tileActions.push(
        {
          Icon: CopyIcon,
          action: 'cloneIntegration',
          label: 'Clone integration',
        }
      );
    }
    tileActions.push({
      Icon: DownloadIcon,
      action: 'generateTemplateZip',
      label: 'Download integration',
    });
    if (canDelete) {
      tileActions.push(
        {
          Icon: TrashIcon,
          action: 'deleteIntegration',
          label: 'Delete integration',
        },
      );
    }
  } else { // Integration app
    const isCloningSupported = tile &&
            integrationAppUtil.isCloningSupported(
              _connectorId,
              name
            ) && accessLevel !== 'monitor' &&
            !supportsMultiStore;

    if (isCloningSupported) {
      tileActions.push(
        {
          Icon: CopyIcon,
          action: 'cloneIntegrationApp',
          label: 'Clone integration',
        }
      );
    }
    if (canUninstall) {
      tileActions.push({
        Icon: TrashIcon,
        action: 'uninstallConnector',
        label: 'Uninstall integration',
      });
    }
  }

  return (
    <EllipsisActionMenu
      actionsMenu={tileActions}
      onAction={handleAction}
      alignment="vertical" />
  );
}
