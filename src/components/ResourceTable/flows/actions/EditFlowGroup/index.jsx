import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import EditIcon from '../../../../icons/EditIcon';
import getRoutePath from '../../../../../utils/routePaths';

export default {
  key: 'editFlowGroup',
  useLabel: () => 'Edit Flow Group',
  icon: EditIcon,
  useOnClick: () => {
    const history = useHistory();
    const openEditFlowGroup = useCallback(() => {
      history.push(getRoutePath('/flowgroups/edit'));
    }, [history]);

    return openEditFlowGroup;
  },
};
