import { useCallback, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import ViewDetailsIcon from '../../icons/ViewDetailsIcon';

export default {
  label: 'View error details',
  icon: ViewDetailsIcon,
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
