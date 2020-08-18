import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

const usePushRightDrawer = pathProp => {
  const history = useHistory();
  const match = useRouteMatch();

  const pushRelativePath = useCallback(path => {
    let pathToPush = pathProp;

    if (path && (typeof path === 'string' || typeof path === 'number')) {
      pathToPush = path;
    }
    try {
      // remove dot and whitespace from path
      pathToPush = pathToPush.replace(/\.|\s/g, '');
    } catch (e) {
      // do nothing
    }

    if (!pathToPush) { return; }
    history.push(`${match.url}/${pathToPush}`);
  }, [pathProp, history, match.url]);

  return pushRelativePath;
};

export default usePushRightDrawer;
