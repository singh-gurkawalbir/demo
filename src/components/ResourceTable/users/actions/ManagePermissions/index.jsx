import { useCallback } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useGetTableContext } from '../../../../CeligoTable/TableContext';

export default {
  useLabel: () => 'Manage permissions',
  useOnClick: () => {
    const match = useRouteMatch();
    const history = useHistory();
    const {user} = useGetTableContext();
    const openEditDrawer = useCallback(() => {
      history.push(`${match.url}/edit/${user._id}`);
    }, [match.url, history, user._id]);

    return openEditDrawer;
  },
};
