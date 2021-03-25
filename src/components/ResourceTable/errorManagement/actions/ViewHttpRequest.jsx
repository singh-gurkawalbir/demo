import { useCallback, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import HttpIcon from '../../../icons/HttpIcon';

export default {
  label: 'View HTTP request',
  icon: HttpIcon,
  component: function ViewHttpRequest({ rowData = {} }) {
    const { errorId } = rowData;
    const history = useHistory();
    const match = useRouteMatch();
    const handleClick = useCallback(() => {
      history.push(`${match.url}/details/${errorId}/request`);
    }, [errorId, history, match.url]);

    useEffect(() => {
      handleClick();
    }, [handleClick]);

    return null;
  },
};
