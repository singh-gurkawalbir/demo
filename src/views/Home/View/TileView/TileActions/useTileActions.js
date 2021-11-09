import { useCallback, useMemo } from 'react';

import {useSelector, shallowEqual, useDispatch} from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useSelectorMemo } from '../../../../../hooks';
import actions from '../../../../../actions';
import useConfirmDialog from '../../../../../components/ConfirmDialog';
import CopyIcon from '../../../../../components/icons/CopyIcon';
import DownloadIcon from '../../../../../components/icons/DownloadIcon';
import TrashIcon from '../../../../../components/icons/TrashIcon';
import { selectors } from '../../../../../reducers';
import { INTEGRATION_ACCESS_LEVELS, STANDALONE_INTEGRATION, USER_ACCESS_LEVELS } from '../../../../../utils/constants';
import integrationAppUtil, { getIntegrationAppUrlName } from '../../../../../utils/integrationApps';
import { INTEGRATION_DELETE_VALIDATE } from '../../../../../utils/messageStore';
import getRoutePath from '../../../../../utils/routePaths';
import useEnqueueSnackbar from '../../../../../hooks/enqueueSnackbar';

export default function useTileActions(tile) {
  const tileActions = [];
  const history = useHistory();
  const dispatch = useDispatch();
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', tile && tile._integrationId)
  );
  const {_id: integrationId, _connectorId} = integration || {};
  const { supportsMultiStore } = integration?.settings || {};
  const isIntegrationApp = _connectorId;
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const {confirmDialog} = useConfirmDialog();
  const canUninstall = useSelector(state => !selectors.isFormAMonitorLevelAccess(state, integrationId));
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

  const handleClone = () => { // for IA and DIY/templates
    history.push(getRoutePath(`/clone/integrations/${integration._id}/preview`));
  };
  const flowsFilterConfig = useMemo(
    () => ({
      type: 'flows',
      filter: {
        _integrationId:
              integrationId === STANDALONE_INTEGRATION.id
                ? undefined
                : integrationId,
      },
    }),
    [integrationId]
  );

  const flows = useSelectorMemo(
    selectors.makeResourceListSelector,
    flowsFilterConfig
  ).resources;
  const cantDelete = flows.length > 0;

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
            dispatch(actions.resource.integrations.delete(integrationId));
          },
        },
        {
          label: 'Cancel',
          variant: 'text',
        },
      ],
    });
  }, [
    cantDelete,
    confirmDialog,
    dispatch,
    enqueueSnackbar,
    integrationId,
  ]);

  const handleDownload = useCallback(() => { // for DIY/templates
    dispatch(actions.template.generateZip(integrationId));
  }, [integrationId, dispatch]);

  const integrationAppTileName = getIntegrationAppUrlName(integration?.name) || '';

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
                  `integrationapps/${integrationAppTileName}/${integrationId}/uninstall`
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
  }, [accessLevel, confirmDialog, enqueueSnackbar, history, integrationAppTileName, integrationId, supportsMultiStore]);

  const handleAction = action => {
    switch (action) {
      case 'clone': // for IA and DIY/templates
        handleClone();
        break;
      case 'download': // for DIY/templates
        handleDownload();
        break;
      case 'delete': // for DIY/templates
        handleDelete();
        break;
      case 'uninstall': // for IA
        handleUninstall();
        break;
      default: break;
    }
  };

  if (!tile) return tileActions;
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
              integration?.name
            ) && accessLevel !== 'monitor' &&
            !supportsMultiStore;

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
