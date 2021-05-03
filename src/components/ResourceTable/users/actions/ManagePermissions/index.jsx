import { useCallback, useEffect } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';

export default {
  useLabel: () => 'Manage permissions',
  component: function ManagePermissions({ rowData: user }) {
    const match = useRouteMatch();
    const history = useHistory();
    const openEditDrawer = useCallback(() => {
      history.push(`${match.url}/edit/${user._id}`);
    }, [match.url, history, user._id]);

    useEffect(() => {
      openEditDrawer();
    }, [openEditDrawer]);

    return null;
  },
};
