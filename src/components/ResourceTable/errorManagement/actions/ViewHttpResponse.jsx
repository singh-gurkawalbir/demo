import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import HttpIcon from '../../../icons/HttpIcon';

export default {
  useLabel: () => 'View HTTP response',
  icon: HttpIcon,
  useOnClick: rowData => {
    const { errorId } = rowData;
    const history = useHistory();
    const match = useRouteMatch();
    const handleClick = useCallback(() => {
      history.push(`${match.url}/details/${errorId}/response`);
    }, [errorId, history, match.url]);

    return handleClick;
  },
};
