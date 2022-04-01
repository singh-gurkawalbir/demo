import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import ViewDetailsIcon from '../../../icons/ViewDetailsIcon';
import { DRAWER_URL_PREFIX } from '../../../../utils/rightDrawer';

export default {
  key: 'viewErrorDetails',
  useLabel: () => 'View error details',
  icon: ViewDetailsIcon,
  useOnClick: rowData => {
    const { errorId } = rowData;
    const history = useHistory();
    const match = useRouteMatch();
    const handleClick = useCallback(() => {
      history.push(`${match.url}/${DRAWER_URL_PREFIX}/details/${errorId}/view`);
    }, [errorId, history, match.url]);

    return handleClick;
  },
};
