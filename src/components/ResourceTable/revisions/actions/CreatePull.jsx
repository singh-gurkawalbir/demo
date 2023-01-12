import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { generateId } from '../../../../utils/string';
import CreatePullIcon from '../../../icons/AddIcon';
import { buildDrawerUrl, drawerPaths } from '../../../../utils/rightDrawer';

export default {
  key: 'createPull',
  useLabel: () => 'Create pull',
  icon: CreatePullIcon,
  useOnClick: () => {
    const history = useHistory();
    const match = useRouteMatch();
    const handleClick = useCallback(() => {
      history.push(buildDrawerUrl({
        path: drawerPaths.LCM.OPEN_PULL,
        baseUrl: match.url,
        params: { revId: generateId() },
      }));
    }, [history, match.url]);

    return handleClick;
  },
};
