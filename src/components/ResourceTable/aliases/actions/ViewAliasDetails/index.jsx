import { useCallback} from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import getRoutePath from '../../../../../utils/routePaths';
import ViewDetailsIcon from '../../../../icons/ViewDetailsIcon';

export default {
  key: 'viewAliasDetails',
  useLabel: () => 'View details',
  icon: ViewDetailsIcon,
  useOnClick: rowData => {
    const { alias, parentResourceId } = rowData;
    const history = useHistory();
    const match = useRouteMatch();
    const openViewDetails = useCallback(() => {
      history.push(getRoutePath(parentResourceId ? `${match.url}/viewdetails/inherited/${alias}` : `${match.url}/viewdetails/${alias}`));
    }, [history, match.url, alias, parentResourceId]);

    return openViewDetails;
  },
};
