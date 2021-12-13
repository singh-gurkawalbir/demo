import React, { useCallback } from 'react';
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
  const { pathname } = useLocation();

  const matchIncompleteErrorDrawerPath = matchPath(pathname, {
    path: `${match.url}/errors/:resourceId`,
  });
  const matchIncompleteErrorDrawerPathWithFilter = matchPath(pathname, {
    path: `${match.url}/errors/:resourceId/filter/:flowJobId`,
  });
  const flowJobId = matchIncompleteErrorDrawerPathWithFilter?.params?.flowJobId;

  if (matchIncompleteErrorDrawerPath?.isExact) {
    // when error type is not specified in the url, it adds open and opens Open errors by default
    // Note: The url specified in the emails regarding errors to the users does not specify the error type
    // This helps not to modify any dependent places to update url
    history.replace(`${matchIncompleteErrorDrawerPath.url}/open`);
  }
  if (matchIncompleteErrorDrawerPathWithFilter?.isExact) {
    history.replace(`${matchIncompleteErrorDrawerPathWithFilter.url}/open`);
  }

  const matchErrorDrawerPath = matchPath(pathname, {
    path: `${match.url}/errors/:resourceId/:errorType`,
  });

  const matchErrorDrawerPathWithFilter = matchPath(pathname, {
    path: `${match.url}/errors/:resourceId/filter/:flowJobId/:errorType`,
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
  }, [history, match.url]);

  const handleErrorTypeChange = useCallback(errorType => {
    if (matchErrorDrawerPathWithFilter) {
      history.replace(`${match.url}/errors/${matchErrorDrawerPathWithFilter.params.resourceId}/filter/${matchErrorDrawerPathWithFilter.params.flowJobId}/${errorType}`);
    } else {
      history.replace(`${match.url}/errors/${matchErrorDrawerPath.params.resourceId}/${errorType}`);
    }
  }, [matchErrorDrawerPathWithFilter, history, match.url, matchErrorDrawerPath?.params?.resourceId]);

  return (
    <RightDrawer
      path={['errors/:resourceId/filter/:flowJobId/:errorType', 'errors/:resourceId/:errorType']}
      width="full"
      onClose={handleClose}
      variant="temporary">

      <DrawerHeader title={`Errors: ${resourceName}`} hideBackButton>
        <ErrorDrawerAction flowId={flowId} onChange={handleErrorTypeChange} />
      </DrawerHeader>

      <DrawerContent>
        <ErrorList flowId={flowId} flowJobId={flowJobId} />
      </DrawerContent>
    </RightDrawer>
  );
}
