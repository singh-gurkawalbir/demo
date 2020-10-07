import { useCallback, useEffect } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';

export default {
  label: 'Manage notifications',
  component: function ManageNotifications({ rowData: user }) {
    const match = useRouteMatch();
    const history = useHistory();
    const userEmail = user.sharedWithUser.email;
    const openEditDrawer = useCallback(() => {
      history.push(`${match.url}/${userEmail}/manageNotifications`);
    }, [match.url, history, userEmail]);

    useEffect(() => {
      openEditDrawer();
    }, [openEditDrawer]);

    return null;
  },
};
