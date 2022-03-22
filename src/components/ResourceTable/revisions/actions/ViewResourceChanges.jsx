import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import ViewResourcesChangedIcon from '../../../icons/ViewResourcesChangedIcon';

export default {
  key: 'viewChanges',
  useLabel: () => 'View resources changed',
  icon: ViewResourcesChangedIcon,
  useOnClick: rowData => {
    const { _id: revisionId } = rowData;
    const history = useHistory();
    const match = useRouteMatch();
    const handleClick = useCallback(() => {
      history.push(`${match.url}/view/${revisionId}/mode/changes`);
    }, [revisionId, history, match.url]);

    return handleClick;
  },
};
