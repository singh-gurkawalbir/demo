import { useCallback } from 'react';
import nanoid from 'nanoid';
import { useHistory, useRouteMatch } from 'react-router-dom';
import CreatePullIcon from '../../../icons/AddIcon';
import { DRAWER_URL_PREFIX } from '../../../../utils/rightDrawer';

export default {
  key: 'createPull',
  useLabel: () => 'Create pull',
  icon: CreatePullIcon,
  useOnClick: () => {
    const history = useHistory();
    const match = useRouteMatch();
    const handleClick = useCallback(() => {
      history.push(`${match.url}/${DRAWER_URL_PREFIX}/pull/${nanoid()}/open`);
    }, [history, match.url]);

    return handleClick;
  },
};
