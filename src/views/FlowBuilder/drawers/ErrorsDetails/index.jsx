import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch, useLocation, matchPath } from 'react-router-dom';
import { selectors } from '../../../../reducers';
import RightDrawer from '../../../../components/drawer/Right';
import DrawerHeader from '../../../../components/drawer/Right/DrawerHeader';
import DrawerContent from '../../../../components/drawer/Right/DrawerContent';
import ErrorList from '../../../../components/ErrorList';
import ErrorDrawerAction from './ErrorDrawerAction';

export default function ErrorDetailsDrawer({ flowId }) {
  const history = useHistory();
  const match = useRouteMatch();
  const [errorType, setErrorType] = useState('open');
  const { pathname } = useLocation();
  const matchErrorDrawerPath = matchPath(pathname, {
    path: `${match.url}/errors/:resourceId`,
  });

  const resourceName = useSelector(state => {
    const { resourceId } = matchErrorDrawerPath?.params || {};

    if (!resourceId) return;

    const exportObj = selectors.resource(state, 'exports', resourceId);

    if (exportObj?.name) return exportObj.name;

    return selectors.resource(state, 'imports', resourceId)?.name;
  });

  const handleClose = useCallback(() => {
    if (history.length > 2) {
      history.goBack();
    } else {
      history.replace(match.url);
    }
    setTimeout(() => setErrorType('open'), 1000);
  }, [history, match.url]);

  return (
    <RightDrawer
      path="errors/:resourceId"
      width="full"
      onClose={handleClose}
      variant="temporary">

      <DrawerHeader title={`Errors: ${resourceName}`} hideBackButton>
        <ErrorDrawerAction
          flowId={flowId}
          errorType={errorType}
          setErrorType={setErrorType} />
      </DrawerHeader>

      <DrawerContent>
        <ErrorList
          flowId={flowId}
          errorType={errorType} />
      </DrawerContent>
    </RightDrawer>
  );
}
