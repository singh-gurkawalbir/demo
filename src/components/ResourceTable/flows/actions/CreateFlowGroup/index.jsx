import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import AddIcon from '../../../../icons/AddIcon';
import getRoutePath from '../../../../../utils/routePaths';
import { DRAWER_URL_PREFIX } from '../../../../../utils/rightDrawer';

export default {
  key: 'createFlowGroup',
  useLabel: () => 'Create flow group',
  icon: AddIcon,
  useOnClick: () => {
    const history = useHistory();
    const match = useRouteMatch();
    const openCreateFlowGroup = useCallback(() => {
      history.push(getRoutePath(`${match.url}/${DRAWER_URL_PREFIX}/flowgroups/add`));
    }, [history, match.url]);

    return openCreateFlowGroup;
  },
};
