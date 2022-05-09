import { useCallback} from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import EditIcon from '../../../../icons/EditIcon';
import { buildDrawerUrl, drawerPaths } from '../../../../../utils/rightDrawer';

export default {
  key: 'editAlias',
  useLabel: () => 'Edit alias',
  icon: EditIcon,
  useOnClick: rowData => {
    const { alias: aliasId } = rowData;
    const history = useHistory();
    const match = useRouteMatch();
    const openEditAlias = useCallback(() => {
      history.push(buildDrawerUrl({
        path: drawerPaths.ALIASES.EDIT,
        baseUrl: match.url,
        params: { aliasId },
      }));
    }, [history, match.url, aliasId]);

    return openEditAlias;
  },
};
