import { useCallback} from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import getRoutePath from '../../../../../utils/routePaths';
import EditIcon from '../../../../icons/EditIcon';

export default {
  key: 'editAlias',
  useLabel: () => 'Edit alias',
  icon: EditIcon,
  useOnClick: rowData => {
    const { alias: aliasId } = rowData;
    const history = useHistory();
    const match = useRouteMatch();
    const openEditAlias = useCallback(() => {
      history.push(getRoutePath(`${match.url}/edit/${aliasId}`));
    }, [history, match.url, aliasId]);

    return openEditAlias;
  },
};
