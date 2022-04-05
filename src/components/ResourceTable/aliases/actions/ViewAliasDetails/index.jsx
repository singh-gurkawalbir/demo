import { useCallback} from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import ViewDetailsIcon from '../../../../icons/ViewDetailsIcon';
import { buildDrawerUrl, drawerPaths } from '../../../../../utils/rightDrawer';

export default {
  key: 'viewAliasDetails',
  useLabel: () => 'View details',
  icon: ViewDetailsIcon,
  useOnClick: rowData => {
    const { alias: aliasId, parentResourceId } = rowData;
    const history = useHistory();
    const match = useRouteMatch();
    const openViewDetails = useCallback(() => {
      const inheritedAliasDetailsDrawerPath = buildDrawerUrl({
        path: drawerPaths.ALIASES.VIEW_INHERITED_DETAILS,
        baseUrl: match.url,
        params: { aliasId, parentResourceId },
      });
      const aliasDetailsDrawerPath = buildDrawerUrl({
        path: drawerPaths.ALIASES.VIEW_DETAILS,
        baseUrl: match.url,
        params: { aliasId },
      });

      history.push(parentResourceId ? inheritedAliasDetailsDrawerPath : aliasDetailsDrawerPath);
    }, [history, match.url, aliasId, parentResourceId]);

    return openViewDetails;
  },
};
