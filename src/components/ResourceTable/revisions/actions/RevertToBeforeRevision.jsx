import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import RevertIcon from '../../../icons/ViewResolvedHistoryIcon';

export default {
  key: 'revertToBefore',
  useLabel: () => 'Revert to before this revision',
  icon: RevertIcon,
  useOnClick: rowData => {
    const { _id: revisionId } = rowData;
    const history = useHistory();
    const match = useRouteMatch();
    const handleClick = useCallback(() => {
      history.push(`${match.url}/revert?toBefore=${revisionId}/new-123/open`);
    }, [revisionId, history, match.url]);

    return handleClick;
  },
};
