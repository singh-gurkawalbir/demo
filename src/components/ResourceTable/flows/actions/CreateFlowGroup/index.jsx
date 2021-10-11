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
    const openCreateFlowGroup = useCallback(() => {
      history.push(getRoutePath('/flowgroups/add'));
    }, [history]);

    return openCreateFlowGroup;
  },
};
