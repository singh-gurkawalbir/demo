import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import { FILTER_KEYS } from '../../../../utils/errorManagement';
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
    const dispatch = useDispatch();
    const { errorType } = match.params;
    const filterKey = errorType === 'resolved' ? FILTER_KEYS.RESOLVED : FILTER_KEYS.OPEN;
    const handleClick = useCallback(() => {
      history.push(buildDrawerUrl({
        path: drawerPaths.ERROR_MANAGEMENT.V2.VIEW_ERROR_DETAILS,
        baseUrl: match.url,
        params: { errorId, mode: 'request' },
      }));
      dispatch(actions.patchFilter(filterKey, {
        activeErrorId: errorId,
      }));
    }, [dispatch, filterKey, errorId, history, match.url]);

    return handleClick;
  },
};
