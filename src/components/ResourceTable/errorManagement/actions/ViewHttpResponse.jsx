import { useCallback, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import HttpIcon from '../../../icons/HttpIcon';

export default {
  label: 'View HTTP response',
  icon: HttpIcon,
  component: function ViewHttpResponse({ rowData = {} }) {
    const { errorId } = rowData;
    const history = useHistory();
    const match = useRouteMatch();
    const handleClick = useCallback(() => {
      history.push(`${match.url}/details/${errorId}/response`);
    }, [errorId, history, match.url]);

    useEffect(() => {
      handleClick();
    }, [handleClick]);

    return null;
  },
};
