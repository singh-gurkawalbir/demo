import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import CopyIcon from '../../../../icons/CopyIcon';
import { selectors } from '../../../../../reducers';
import getRoutePath from '../../../../../utils/routePaths';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import integrationAppUtil from '../../../../../utils/integrationApps';

export default {
  key: 'cloneIntegration', // todo: cloneIntegrationApp
  useLabel: () => 'Clone integration',
  icon: CopyIcon,
  useHasAccess: rowData => {
    const {name, _connectorId, _integrationId, ssLinkedConnectionId} = rowData;
    const permissions = useSelector(state => selectors.resourcePermissions(
      state,
      'integrations',
      _integrationId
    ), shallowEqual);
    const {clone, accessLevel} = permissions || {};

    const integration = useSelectorMemo(selectors.mkIntegrationAppSettings, _integrationId) || {};
    const { supportsMultiStore } = integration?.settings || {};

    const isCloningSupported = integration &&
    integrationAppUtil.isCloningSupported(
      _connectorId,
      name
    ) && accessLevel !== 'monitor';

    if (ssLinkedConnectionId) { return false; }

    return _connectorId ? (isCloningSupported && integration && !supportsMultiStore) : clone;
  },
  useOnClick: rowData => {
    const {_integrationId} = rowData;
    const history = useHistory();
    const openCloneURL = useCallback(() => {
      history.push(getRoutePath(`/clone/integrations/${_integrationId}/preview`));
    }, [_integrationId, history]);

    return openCloneURL;
  },
};
