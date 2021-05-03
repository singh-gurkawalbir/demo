import { useCallback, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import ViewDetailsIcon from '../../../icons/ViewDetailsIcon';

export default {
  useLabel: () => 'View error details',
  icon: ViewDetailsIcon,
  component: function ViewErrorDetails({ rowData = {} }) {
    const { errorId } = rowData;
    const history = useHistory();
    const match = useRouteMatch();
    const handleClick = useCallback(() => {
      history.push(`${match.url}/details/${errorId}/view`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errorId, history]);

    useEffect(() => {
      handleClick();
    }, [handleClick]);

    return null;
  },
};
