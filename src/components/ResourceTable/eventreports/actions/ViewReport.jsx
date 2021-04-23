import { useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import ViewDetailsIcon from '../../../icons/ViewDetailsIcon';

export default {
  label: 'View report details',
  icon: ViewDetailsIcon,
  component: function ViewReport({ rowData = {} }) {
    const { _id } = rowData;
    const history = useHistory();
    const match = useRouteMatch();
    const viewDetailsRoute = `${match.url}/view/reportDetails/${_id}`;

    useEffect(() => {
      history.push(viewDetailsRoute);
    }, [history, viewDetailsRoute]);

    return null;
  },
};

