import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import ViewDetailsIcon from '../../../icons/ViewDetailsIcon';

export default {
  key: 'viewReport',
  useLabel: () => 'View report details',
  icon: ViewDetailsIcon,
  useOnClick: function ViewReport(rowData = {}) {
    const { _id } = rowData;
    const history = useHistory();
    const match = useRouteMatch();
    const viewDetailsRoute = `${match.url}/view/reportDetails/${_id}`;

    return useCallback(() => {
      history.push(viewDetailsRoute);
    }, [history, viewDetailsRoute]);
  },
};

