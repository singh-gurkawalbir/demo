import { useCallback } from 'react';
import { nanoid } from 'nanoid';
import { useHistory, useRouteMatch } from 'react-router-dom';
import CreatePullIcon from '../../../icons/AddIcon';

export default {
  key: 'createPull',
  useLabel: () => 'Create pull',
  icon: CreatePullIcon,
  useOnClick: () => {
    const history = useHistory();
    const match = useRouteMatch();
    const handleClick = useCallback(() => {
      history.push(`${match.url}/pull/${nanoid()}/open`);
    }, [history, match.url]);

    return handleClick;
  },
};
