import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

const usePushRightDrawer = path => {
  const history = useHistory();
  const match = useRouteMatch();

  const pushRightDrawer = useCallback(_path => {
    const pathToPush = path || _path;

    if (!pathToPush) { return; }
    history.push(`${match.url}/${pathToPush}`);
  }, [path, history, match.url]);

  return pushRightDrawer;
};

export default usePushRightDrawer;
