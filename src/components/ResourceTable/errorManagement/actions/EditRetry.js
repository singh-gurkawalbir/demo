import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import { FILTER_KEYS } from '../../../../utils/errorManagement';
import { useGetTableContext } from '../../../CeligoTable/TableContext';
import EditIcon from '../../../icons/EditIcon';
import { buildDrawerUrl, drawerPaths } from '../../../../utils/rightDrawer';

export default {
  key: 'editRetryData',
  useLabel: () => 'Edit retry data',
  icon: EditIcon,
  useDisabledActionText: () => {
    const {isFlowDisabled} = useGetTableContext();

    if (isFlowDisabled) {
      return 'Enable the flow to edit retry data';
    }
  },
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
        params: { errorId, mode: 'editRetry' },
      }));
      if (filterKey === FILTER_KEYS.OPEN) {
        dispatch(actions.patchFilter(filterKey, {
          activeErrorId: errorId,
        }));
      }
    }, [dispatch, filterKey, errorId, history, match.url]);

    return handleClick;
  },
};
