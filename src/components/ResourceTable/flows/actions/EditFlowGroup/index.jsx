import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import EditIcon from '../../../../icons/EditIcon';
import getRoutePath from '../../../../../utils/routePaths';

export default {
  key: 'editFlowGroup',
  useLabel: () => 'Edit Flow Group',
  icon: EditIcon,
  useOnClick: () => {
    const history = useHistory();
    const match = useRouteMatch();
    const openEditFlowGroup = useCallback(() => {
      history.push(getRoutePath(`${match.url}/flowgroups/edit`));
    }, [history, match.url]);

    return openEditFlowGroup;
  },
};
