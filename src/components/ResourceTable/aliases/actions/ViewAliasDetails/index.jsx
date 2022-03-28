import { useCallback} from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import getRoutePath from '../../../../../utils/routePaths';
import ViewDetailsIcon from '../../../../icons/ViewDetailsIcon';

export default {
  key: 'viewAliasDetails',
  useLabel: () => 'View details',
  icon: ViewDetailsIcon,
  useOnClick: rowData => {
    const { alias: aliasId, parentResourceId } = rowData;
    const history = useHistory();
    const match = useRouteMatch();
    const openViewDetails = useCallback(() => {
      history.push(getRoutePath(parentResourceId ? `${match.url}/viewdetails/${aliasId}/inherited/${parentResourceId}` : `${match.url}/viewdetails/${aliasId}`));
    }, [history, match.url, aliasId, parentResourceId]);

    return openViewDetails;
  },
};
