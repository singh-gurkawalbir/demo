import { useCallback } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { DRAWER_URL_PREFIX } from '../../../../../utils/rightDrawer';

export default {
  key: 'managePermissions',
  useLabel: () => 'Manage permissions',
  useOnClick: user => {
    const match = useRouteMatch();
    const history = useHistory();
    const openEditDrawer = useCallback(() => {
      history.push(`${match.url}/${DRAWER_URL_PREFIX}/edit/${user._id}`);
    }, [match.url, history, user._id]);

    return openEditDrawer;
  },
};
