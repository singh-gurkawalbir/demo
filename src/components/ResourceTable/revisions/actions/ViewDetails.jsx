import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import ViewDetailsIcon from '../../../icons/ViewDetailsIcon';

export default {
  key: 'viewDetails',
  useLabel: () => 'View Details',
  icon: ViewDetailsIcon,
  useOnClick: rowData => {
    const { _id: revisionId } = rowData;
    const history = useHistory();
    const match = useRouteMatch();
    const handleClick = useCallback(() => {
      history.push(`${match.url}/view/${revisionId}/mode/details`);
    }, [revisionId, history, match.url]);

    return handleClick;
  },
};
