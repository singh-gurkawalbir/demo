import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

const usePushRightDrawer = pathProp => {
  const history = useHistory();
  const match = useRouteMatch();

  const pushRightDrawer = useCallback(path => {
    const pathToPush = pathProp || path;

    if (!pathToPush) { return; }
    history.push(`${match.url}/${pathToPush}`);
  }, [pathProp, history, match.url]);

  return pushRightDrawer;
};

export default usePushRightDrawer;
