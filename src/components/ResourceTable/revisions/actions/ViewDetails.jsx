import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import ViewDetailsIcon from '../../../icons/ViewDetailsIcon';
import { DRAWER_URL_PREFIX } from '../../../../utils/drawerURLs';

export default {
  key: 'viewDetails',
  useLabel: () => 'View details',
  icon: ViewDetailsIcon,
  useOnClick: rowData => {
    const { _id: revisionId } = rowData;
    const history = useHistory();
    const match = useRouteMatch();
    const handleClick = useCallback(() => {
      history.push(`${match.url}/${DRAWER_URL_PREFIX}/view/${revisionId}/mode/details`);
    }, [revisionId, history, match.url]);

    return handleClick;
  },
};
