import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import { FILTER_KEYS } from '../../../../utils/errorManagement';
import ViewDetailsIcon from '../../../icons/ViewDetailsIcon';
import { drawerPaths, buildDrawerUrl } from '../../../../utils/rightDrawer';

export default {
  key: 'viewErrorDetails',
  useLabel: () => 'View error details',
  icon: ViewDetailsIcon,
  useOnClick: rowData => {
    const { errorId } = rowData;
    const history = useHistory();
    const match = useRouteMatch();
    const dispatch = useDispatch();
    const { errorType } = match.params;
    const handleClick = useCallback(() => {
      history.push(buildDrawerUrl({
        path: drawerPaths.ERROR_MANAGEMENT.V2.VIEW_ERROR_DETAILS,
        baseUrl: match.url,
        params: { errorId, mode: 'view' },
      }));
      if (errorType === 'open') {
        dispatch(actions.patchFilter(FILTER_KEYS.OPEN, {
          activeErrorId: errorId,
        }));
      }
    }, [history, match.url, errorId, errorType, dispatch]);

    return handleClick;
  },
};
