import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import RevertIcon from '../../../icons/ViewResolvedHistoryIcon';

export default {
  key: 'revertToRevision',
  useLabel: () => 'Revert to this revision',
  icon: RevertIcon,
  useOnClick: rowData => {
    const { _id: revisionId } = rowData;
    const history = useHistory();
    const match = useRouteMatch();
    const handleClick = useCallback(() => {
      history.push(`${match.url}/revert/new-123/open/this/revision/${revisionId}`);
    }, [revisionId, history, match.url]);

    return handleClick;
  },
};
