import { useCallback } from 'react';
import { nanoid } from 'nanoid';
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
      history.push(`${match.url}/revert/${nanoid()}/open/toBefore/revision/${revisionId}`);
    }, [revisionId, history, match.url]);

    return handleClick;
  },
};
