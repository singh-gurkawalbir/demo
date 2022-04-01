import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import AddIcon from '../../../../icons/AddIcon';
import { buildDrawerUrl, drawerPaths } from '../../../../../utils/rightDrawer';

export default {
  key: 'createFlowGroup',
  useLabel: () => 'Create flow group',
  icon: AddIcon,
  useOnClick: () => {
    const history = useHistory();
    const match = useRouteMatch();
    const openCreateFlowGroup = useCallback(() => {
      history.push(buildDrawerUrl({ path: drawerPaths.FLOW_GROUP.ADD, baseUrl: match.url }));
    }, [history, match.url]);

    return openCreateFlowGroup;
  },
};
