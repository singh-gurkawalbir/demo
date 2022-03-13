import { useCallback} from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import getRoutePath from '../../../../../utils/routePaths';
import EditIcon from '../../../../icons/EditIcon';

export default {
  key: 'editAlias',
  useLabel: () => 'Edit alias',
  icon: EditIcon,
  useOnClick: rowData => {
    const { alias } = rowData;
    const history = useHistory();
    const match = useRouteMatch();
    const openEditAlias = useCallback(() => {
      history.push(getRoutePath(getRoutePath(`${match.url}/edit/${alias}`)));
    }, [history, match.url, alias]);

    return openEditAlias;
  },
};
