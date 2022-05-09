import { useCallback } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { drawerPaths, buildDrawerUrl } from '../../../../../utils/rightDrawer';

export default {
  key: 'managePermissions',
  useLabel: () => 'Manage permissions',
  useOnClick: user => {
    const match = useRouteMatch();
    const history = useHistory();
    const openEditDrawer = useCallback(() => {
      history.push(buildDrawerUrl({
        path: drawerPaths.ACCOUNT.MANAGE_USER_PERMISSIONS,
        baseUrl: match.url,
        params: { userId: user._id},
      }));
    }, [match.url, history, user._id]);

    return openEditDrawer;
  },
};
