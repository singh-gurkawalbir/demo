import React, { useState, useCallback, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { useSelector, shallowEqual } from 'react-redux';
import { makeStyles, Typography } from '@material-ui/core';
import { useHistory, useRouteMatch, useLocation, matchPath } from 'react-router-dom';
import { selectors } from '../../../../reducers';
import RightDrawer from '../../../../components/drawer/Right';
import DrawerHeader from '../../../../components/drawer/Right/DrawerHeader';
import DrawerContent from '../../../../components/drawer/Right/DrawerContent';
import ErrorList from '../../../../components/ErrorList';
import ErrorDrawerAction from './ErrorDrawerAction';

const emptySet = [];

const useStyles = makeStyles(theme => ({
  errorsInRun: {
    marginBottom: theme.spacing(3),
  },
  boldErrorsCount: {
    fontWeight: 'bold',
  },
}));

export default function ErrorDetailsDrawer({ flowId }) {
  const history = useHistory();
  const classes = useStyles();
  const match = useRouteMatch();
  const { pathname } = useLocation();
  const [activeTab, setActiveTab] = useState(null);

  const matchIncompleteErrorDrawerPath = matchPath(pathname, {
    path: `${match.url}/errors/:resourceId`,
  });

  if (matchIncompleteErrorDrawerPath?.isExact) {
    // when error type is not specified in the url, it adds open and opens Open errors by default
    // Note: The url specified in the emails regarding errors to the users does not specify the error type
    // This helps not to modify any dependent places to update url
    history.replace(`${matchIncompleteErrorDrawerPath.url}/open`);
  }

  const matchErrorDrawerPath = matchPath(pathname, {
    path: `${match.url}/errors/:resourceId/:errorType`,
  });

  const matchErrorDrawerPathWithFilter = matchPath(pathname, {
    path: `${match.url}/errors/:resourceId/filter/:flowJobId/:errorType`,
  });
  const flowJobId = matchErrorDrawerPathWithFilter?.params?.flowJobId;
  const allErrors = useSelector(state => {
    const allErrorDetails = selectors.allResourceErrorDetails(state, { flowId, resourceId: matchErrorDrawerPathWithFilter?.params?.resourceId });

    return allErrorDetails.errors || emptySet;
  });

  const childJob = useSelector(
    state => selectors.filter(state, `${flowId}-${flowJobId}-${matchErrorDrawerPathWithFilter?.params?.resourceId}`), shallowEqual
  );
  const isErrorFilterMetadataReceived = useSelector(state =>
    selectors.isErrorFilterMetadataReceived(state)
  );

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
    setActiveTab('errorType');
  }, [matchErrorDrawerPathWithFilter, history, match.url, matchErrorDrawerPath?.params?.resourceId]);

  useEffect(() => {
    if (!allErrors.length && childJob && !activeTab && isErrorFilterMetadataReceived) {
      handleErrorTypeChange('resolved');
      setActiveTab('resolved');
    }
  }, [activeTab, allErrors.length, childJob, handleErrorTypeChange, isErrorFilterMetadataReceived]);

  // Child job information will not be available if we reload the page. Page should be redirected to old url for this case.
  if (flowJobId && (!childJob || isEmpty(childJob))) {
    handleClose();

    return null;
  }

  return (
    <RightDrawer
      path={['errors/:resourceId/filter/:flowJobId/:errorType', 'errors/:resourceId/:errorType']}
      width="full"
      onClose={handleClose}
      variant="temporary">

      <DrawerHeader endedAt={flowJobId && childJob?.endedAt} title={`Errors: ${resourceName}`} hideBackButton>
        <ErrorDrawerAction flowId={flowId} onChange={handleErrorTypeChange} />
      </DrawerHeader>

      <DrawerContent>
        {flowJobId ? (
          <Typography variant="body2" className={classes.errorsInRun}>
            <span className={classes.boldErrorsCount}>{childJob?.numOpenError} error{childJob?.numOpenError !== 1 ? 's' : ''} in this run: </span>
            <span> {allErrors.length} open  |  </span>
            <span>{childJob?.numOpenError - allErrors.length} resolved</span>
          </Typography>
        ) : ''}
        <ErrorList flowId={flowId} />
      </DrawerContent>
    </RightDrawer>
  );
}
