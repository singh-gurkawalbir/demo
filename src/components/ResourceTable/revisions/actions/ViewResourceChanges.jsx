import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import ViewResourcesChangedIcon from '../../../icons/ViewResourcesChangedIcon';
import { buildDrawerUrl, drawerPaths } from '../../../../utils/rightDrawer';

export default {
  key: 'viewChanges',
  useLabel: () => 'View resources changed',
  icon: ViewResourcesChangedIcon,
  useOnClick: rowData => {
    const { _id: revisionId } = rowData;
    const history = useHistory();
    const match = useRouteMatch();
    const handleClick = useCallback(() => {
      history.push(buildDrawerUrl({
        path: drawerPaths.LCM.VIEW_REVISION_DETAILS,
        baseUrl: match.url,
        params: { revisionId, mode: 'changes' },
      }));
    }, [revisionId, history, match.url]);

    return handleClick;
  },
};
