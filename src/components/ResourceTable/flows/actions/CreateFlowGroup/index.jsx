import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import AddIcon from '../../../../icons/AddIcon';
import getRoutePath from '../../../../../utils/routePaths';

export default {
  key: 'addFlowGroup',
  useLabel: () => 'Add Flow Group',
  icon: AddIcon,
  useOnClick: () => {
    const history = useHistory();
    const match = useRouteMatch();
    const openCreateFlowGroup = useCallback(() => {
      history.push(getRoutePath(`${match.url}/flowgroups/add`));
    }, [history, match.url]);

    return openCreateFlowGroup;
  },
};
