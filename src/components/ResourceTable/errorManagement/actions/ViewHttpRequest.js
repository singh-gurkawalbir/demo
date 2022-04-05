import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import HttpIcon from '../../../icons/HttpIcon';
import { buildDrawerUrl, drawerPaths } from '../../../../utils/rightDrawer';

export default {
  key: 'HTTP request errors',
  useLabel: () => 'View HTTP request',
  icon: HttpIcon,
  useOnClick: rowData => {
    const { errorId } = rowData;
    const history = useHistory();
    const match = useRouteMatch();
    const handleClick = useCallback(() => {
      history.push(buildDrawerUrl({
        path: drawerPaths.ERROR_MANAGEMENT.V2.VIEW_ERROR_DETAILS,
        baseUrl: match.url,
        params: { errorId, mode: 'request' },
      }));
    }, [errorId, history, match.url]);

    return handleClick;
  },
};
