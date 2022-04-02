import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import ViewDetailsIcon from '../../../icons/ViewDetailsIcon';
import { drawerPaths, buildDrawerUrl } from '../../../../utils/rightDrawer';

export default {
  key: 'viewReport',
  useLabel: () => 'View report details',
  icon: ViewDetailsIcon,
  useOnClick: function ViewReport(rowData = {}) {
    const { _id } = rowData;
    const history = useHistory();
    const match = useRouteMatch();
    const viewDetailsRoute = buildDrawerUrl({
      path: drawerPaths.ACCOUNT.VIEW_REPORT_DETAILS,
      baseUrl: match.url,
      params: { reportId: _id },
    });

    return useCallback(() => {
      history.push(viewDetailsRoute);
    }, [history, viewDetailsRoute]);
  },
};

