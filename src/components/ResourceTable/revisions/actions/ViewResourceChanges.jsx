import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import HttpIcon from '../../../icons/HttpIcon';

export default {
  key: 'viewChanges',
  useLabel: () => 'View resources changed',
  icon: HttpIcon,
  useOnClick: rowData => {
    const { _id: revisionId } = rowData;
    const history = useHistory();
    const match = useRouteMatch();
    const handleClick = useCallback(() => {
      history.push(`${match.url}/view/${revisionId}/changes`);
    }, [revisionId, history, match.url]);

    return handleClick;
  },
};
