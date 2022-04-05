import { useCallback } from 'react';
import nanoid from 'nanoid';
import { useHistory, useRouteMatch } from 'react-router-dom';
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
        params: { revId: nanoid() },
      }));
    }, [history, match.url]);

    return handleClick;
  },
};
