import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import CopyIcon from '../../../../../icons/CopyIcon';
import { selectors } from '../../../../../../reducers';
import getRoutePath from '../../../../../../utils/routePaths';
import useSelectorMemo from '../../../../../../hooks/selectors/useSelectorMemo';
import integrationAppUtil from '../../../../../../utils/integrationApps';

export default {
  key: 'cloneIntegrationApp',
  useLabel: () => 'Clone integration',
  icon: CopyIcon,
  useHasAccess: ({name, _connectorId, _integrationId}) => {
    const accessLevel = useSelector(state => selectors.resourcePermissions(
      state,
      'integrations',
      _integrationId
    )?.accessLevel);

    const integration = useSelectorMemo(selectors.mkIntegrationAppSettings, _integrationId) || {};
    const supportsMultiStore = integration?.settings?.supportsMultiStore;

    const isCloningSupported = integration &&
    integrationAppUtil.isCloningSupported(
      _connectorId,
      name
    ) && accessLevel !== 'monitor';

    return isCloningSupported && integration && !supportsMultiStore;
  },
  useOnClick: ({_integrationId}) => {
    const history = useHistory();
    const openCloneURL = useCallback(() => {
      history.push(getRoutePath(`/clone/integrations/${_integrationId}/preview`));
    }, [_integrationId, history]);

    return openCloneURL;
  },
};
