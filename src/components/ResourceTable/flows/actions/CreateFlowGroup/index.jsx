import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import AddIcon from '../../../../icons/AddIcon';
import getRoutePath from '../../../../../utils/routePaths';

export default {
  key: 'addFlowGroup',
  useLabel: () => 'Add Flow Group',
  icon: AddIcon,
  useOnClick: () => {
    const history = useHistory();
    const { pathname } = history.location;
    const openCreateFlowGroup = useCallback(() => {
      history.push(getRoutePath(`${pathname}/flowgroups/add`));
    }, [history, pathname]);

    return openCreateFlowGroup;
  },
};
