import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import HttpIcon from '../../../icons/HttpIcon';
import { DRAWER_URL_PREFIX } from '../../../../utils/rightDrawer';

export default {
  key: 'HTTP request errors',
  useLabel: () => 'View HTTP request',
  icon: HttpIcon,
  useOnClick: rowData => {
    const { errorId } = rowData;
    const history = useHistory();
    const match = useRouteMatch();
    const handleClick = useCallback(() => {
      history.push(`${match.url}/${DRAWER_URL_PREFIX}/details/${errorId}/request`);
    }, [errorId, history, match.url]);

    return handleClick;
  },
};
