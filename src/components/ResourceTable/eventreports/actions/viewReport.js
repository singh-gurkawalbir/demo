import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import ViewDetailsIcon from '../../../icons/ViewDetailsIcon';
import { DRAWER_URL_PREFIX } from '../../../../utils/drawerURLs';

export default {
  key: 'viewReport',
  useLabel: () => 'View report details',
  icon: ViewDetailsIcon,
  useOnClick: function ViewReport(rowData = {}) {
    const { _id } = rowData;
    const history = useHistory();
    const match = useRouteMatch();
    const viewDetailsRoute = `${match.url}/${DRAWER_URL_PREFIX}/view/reportDetails/${_id}`;

    return useCallback(() => {
      history.push(viewDetailsRoute);
    }, [history, viewDetailsRoute]);
  },
};

