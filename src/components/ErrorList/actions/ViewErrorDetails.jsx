import { useCallback, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

export default {
  label: 'View error details',
  component: function ViewErrorDetails({ rowData = {} }) {
    const { errorId } = rowData;
    const history = useHistory();
    const match = useRouteMatch();
    const handleClick = useCallback(() => {
      history.push(`${match.url}/details/${errorId}/view`);
    }, [errorId, history, match.url]);

    useEffect(() => {
      handleClick();
    }, [handleClick]);

    return null;
  },
};
