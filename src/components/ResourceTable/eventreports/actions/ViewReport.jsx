import { useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import ViewDetailsIcon from '../../../icons/ViewDetailsIcon';

export default {
  label: 'View Report Details',
  icon: ViewDetailsIcon,
  component: function CancelReport({ rowData = {} }) {
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

