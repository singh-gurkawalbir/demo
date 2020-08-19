import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { getValidRelativePath } from '../utils/routePaths';

const usePushRightDrawer = pathProp => {
  const history = useHistory();
  const match = useRouteMatch();

  const pushRelativePath = useCallback(path => {
    let pathToPush = pathProp;

    if (path && (typeof path === 'string' || typeof path === 'number')) {
      pathToPush = path;
    }

    if (!pathToPush) { return; }
    history.push(`${match.url}/${getValidRelativePath(pathToPush)}`);
  }, [pathProp, history, match.url]);

  return pushRelativePath;
};

export default usePushRightDrawer;
