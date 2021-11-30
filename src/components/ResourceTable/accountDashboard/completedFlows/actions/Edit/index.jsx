import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import {useHistory} from 'react-router-dom';
import { selectors } from '../../../../../../reducers';
import EditIcon from '../../../../../icons/EditIcon';
import getRoutePath from '../../../../../../utils/routePaths';

export default {
  key: 'account-dashboard-edit-run',
  useLabel: () => 'Edit flow',
  icon: EditIcon,
  useOnClick: rowData => {
    const history = useHistory();
    const routePath = useSelector(state =>
      selectors.getResourceEditUrl(state, 'flows', rowData?._flowId)
    );

    return useCallback(() => {
      history.push(getRoutePath(routePath));
    }, [history, routePath]);
  },
};
