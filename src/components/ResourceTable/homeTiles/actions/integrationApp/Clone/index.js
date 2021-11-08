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
  useHasAccess: rowData => {
    const {name, _connectorId, _integrationId} = rowData;
    const accessLevel = useSelector(state => selectors.resourcePermissions(
      state,
      'integrations',
      _integrationId
    )?.accessLevel);

    const integration = useSelectorMemo(selectors.mkIntegrationAppSettings, _integrationId) || {};
    const { supportsMultiStore } = integration?.settings || {};

    const isCloningSupported = integration &&
    integrationAppUtil.isCloningSupported(
      _connectorId,
      name
    ) && accessLevel !== 'monitor';

    return isCloningSupported && integration && !supportsMultiStore;
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
