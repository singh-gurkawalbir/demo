import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import CopyIcon from '../../../../../icons/CopyIcon';
import { selectors } from '../../../../../../reducers';
import getRoutePath from '../../../../../../utils/routePaths';

export default {
  key: 'cloneIntegration',
  useLabel: () => 'Clone integration',
  icon: CopyIcon,
  useHasAccess: rowData => {
    const {_integrationId} = rowData;
    const canClone = useSelector(state => selectors.resourcePermissions(
      state,
      'integrations',
      _integrationId
    )?.clone);

    return canClone;
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
