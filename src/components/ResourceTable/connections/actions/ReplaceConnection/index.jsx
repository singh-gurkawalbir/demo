import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../reducers';
import { buildDrawerUrl, drawerPaths } from '../../../../../utils/rightDrawer';
import ReplaceIcon from '../../../../icons/ReplaceIcon';

export default {
  key: 'replaceConnection',
  useLabel: () => 'Replace connection',
  icon: ReplaceIcon,
  useHasAccess: rowData => {
    const { _integrationId } = rowData;
    const hasAccess = useSelector(state => selectors.resourcePermissions(
      state,
      'integrations',
      _integrationId,
      'connections'
    ))?.edit;

    return hasAccess;
  },
  useOnClick: rowData => {
    const { _id: connectionId } = rowData;
    const history = useHistory();
    const match = useRouteMatch();

    return useCallback(() => {
      history.push(buildDrawerUrl({
        path: drawerPaths.CONNECTION.REPLACE,
        baseUrl: match.url,
        params: { connId: connectionId },
      }));
    }, [history, connectionId, match.url]);
  },
};
