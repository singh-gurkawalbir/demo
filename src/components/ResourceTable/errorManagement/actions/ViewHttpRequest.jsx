import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import HttpIcon from '../../../icons/HttpIcon';

export default {
  key: 'HTTP request errors',
  useLabel: ({source}) => source === 'NetSuite' ? 'View request' : 'View HTTP request',
  icon: HttpIcon,
  useOnClick: rowData => {
    const { errorId } = rowData;
    const history = useHistory();
    const match = useRouteMatch();
    const handleClick = useCallback(() => {
      history.push(`${match.url}/details/${errorId}/request`);
    }, [errorId, history, match.url]);

    return handleClick;
  },
};
