import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import HttpIcon from '../../../icons/HttpIcon';

export default {
  key: 'createPull',
  useLabel: () => 'Create pull',
  icon: HttpIcon,
  useOnClick: () => {
    const history = useHistory();
    const match = useRouteMatch();
    const handleClick = useCallback(() => {
      history.push(`${match.url}/pull/123/open`);
    }, [history, match.url]);

    return handleClick;
  },
};
