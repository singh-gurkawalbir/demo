import { useCallback } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';

export default {
  key: 'managePermissions',
  useLabel: () => 'Manage permissions',
  useOnClick: user => {
    const match = useRouteMatch();
    const history = useHistory();
    const openEditDrawer = useCallback(() => {
      history.push(`${match.url}/edit/${user._id}`);
    }, [match.url, history, user._id]);

    return openEditDrawer;
  },
};
