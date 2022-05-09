import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import ViewDetailsIcon from '../../../icons/ViewDetailsIcon';
import { buildDrawerUrl, drawerPaths } from '../../../../utils/rightDrawer';

export default {
  key: 'viewDetails',
  useLabel: () => 'View details',
  icon: ViewDetailsIcon,
  useOnClick: rowData => {
    const { _id: revisionId } = rowData;
    const history = useHistory();
    const match = useRouteMatch();
    const handleClick = useCallback(() => {
      history.push(buildDrawerUrl({
        path: drawerPaths.LCM.VIEW_REVISION_DETAILS,
        baseUrl: match.url,
        params: { revisionId, mode: 'details' },
      }));
    }, [revisionId, history, match.url]);

    return handleClick;
  },
};
