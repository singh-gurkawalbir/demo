import React, { useCallback, useEffect, useState } from 'react';
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
import CeligoTimeAgo from '../../../../components/CeligoTimeAgo';
import DrawerHeaderSubTitle from '../../../../components/DrawerHeaderSubTitle';
import Tabs from './Tabs';
import { buildDrawerUrl, drawerPaths } from '../../../../utils/rightDrawer';
import { useEditRetryConfirmDialog } from '../../../../components/ErrorList/ErrorTable/hooks/useEditRetryConfirmDialog';
import RetryList from '../../../../components/JobDashboard/RetryList';
import { FILTER_KEYS } from '../../../../utils/errorManagement';

const emptySet = [];

const useStyles = makeStyles(theme => ({
  errorsInRun: {
    marginBottom: theme.spacing(3),
  },
  boldErrorsCount: {
    fontWeight: 'bold',
  },
  drawerErrorTitle: {
    borderBottom: 'none',
    '&>.MuiTypography-root': {
      alignSelf: 'flex-start',
    },
  },
  errorDetailsDrawerContent: {
    overflowY: 'hidden',
  },
}));
export default function ErrorDetailsDrawer({ flowId }) {
  const history = useHistory();
  const classes = useStyles();
  const match = useRouteMatch();
  const { pathname } = useLocation();
  const [changeTab, setChangeTab] = useState(true);

  const matchIncompleteErrorDrawerPath = matchPath(pathname, {
    path: `${match.url}/errors/:resourceId`,
  });

  if (matchIncompleteErrorDrawerPath?.isExact) {
    // when error type is not specified in the url, it adds open and opens Open errors by default
    // Note: The url specified in the emails regarding errors to the users does not specify the error type
    // This helps not to modify any dependent places to update url
    const openErrorsUrl = buildDrawerUrl({
      path: drawerPaths.ERROR_MANAGEMENT.V2.ERROR_DETAILS,
      baseUrl: match.url,
      params: {...matchIncompleteErrorDrawerPath.params, errorType: 'open'},
    });

    history.replace(openErrorsUrl);
  }

  const matchErrorDrawerPath = matchPath(pathname, {
    path: buildDrawerUrl({
      path: drawerPaths.ERROR_MANAGEMENT.V2.ERROR_DETAILS,
      baseUrl: match.url,
    }),
  });

  const matchErrorDrawerPathWithFilter = matchPath(pathname, {
    path: buildDrawerUrl({
      path: drawerPaths.ERROR_MANAGEMENT.V2.JOB_ERROR_DETAILS,
      baseUrl: match.url,
    }),
  });
  const resourceId = matchErrorDrawerPathWithFilter?.params?.resourceId || matchErrorDrawerPath?.params?.resourceId;
  const errorType = matchErrorDrawerPathWithFilter?.params?.errorType || matchErrorDrawerPath?.params?.errorType;

  const isOpenErrorsLoaded = useSelector(state => {
    const openErrorDetails = selectors.allResourceErrorDetails(state, { flowId, resourceId});

    return openErrorDetails.status === 'received';
  });
  const flowJobId = matchErrorDrawerPathWithFilter?.params?.flowJobId;
  const allErrors = useSelector(state => {
    const allErrorDetails = selectors.allResourceErrorDetails(state, { flowId, resourceId });

    return allErrorDetails.errors || emptySet;
  });

  const childJob = useSelector(
    state => selectors.filter(state, `${flowId}-${flowJobId}-${matchErrorDrawerPathWithFilter?.params?.resourceId}`), shallowEqual
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
    setChangeTab(true);
  }, [history, match.url]);

  const showRetryDataChangedConfirmDialog = useEditRetryConfirmDialog({flowId, resourceId, isResolved: errorType !== 'open'});
  const handleDrawerClose = useCallback(() => {
    showRetryDataChangedConfirmDialog(handleClose);
  }, [handleClose, showRetryDataChangedConfirmDialog]);

  const handleErrorTypeChange = useCallback(errorType => {
    if (matchErrorDrawerPathWithFilter) {
      const changedFilteredErrorUrl = buildDrawerUrl({
        path: drawerPaths.ERROR_MANAGEMENT.V2.JOB_ERROR_DETAILS,
        baseUrl: match.url,
        params: { ...matchErrorDrawerPathWithFilter.params, errorType},
      });

      history.replace(changedFilteredErrorUrl);
    } else {
      const changedErrorUrl = buildDrawerUrl({
        path: drawerPaths.ERROR_MANAGEMENT.V2.ERROR_DETAILS,
        baseUrl: match.url,
        params: { ...matchErrorDrawerPath.params, errorType },
      });

      history.replace(changedErrorUrl);
    }
  }, [matchErrorDrawerPathWithFilter, history, match.url, matchErrorDrawerPath]);

  useEffect(() => {
    if (isOpenErrorsLoaded && !allErrors.length && errorType === 'open' && changeTab) {
      handleErrorTypeChange('resolved');
      setChangeTab(false);
    }
    if (isOpenErrorsLoaded && allErrors.length) {
      setChangeTab(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenErrorsLoaded]);

  // Child job information will not be available if we reload the page. Page should be redirected to old url for this case.
  if (flowJobId && (!childJob || isEmpty(childJob))) {
    handleClose();

    return null;
  }
  const endedAt = childJob?.endedAt;
  const Title = () => (
    <>
      {`Errors: ${resourceName}`}
      {endedAt && <DrawerHeaderSubTitle>Run completed: <CeligoTimeAgo date={endedAt} /></DrawerHeaderSubTitle>}
    </>
  );

  return (
    <RightDrawer
      path={[
        drawerPaths.ERROR_MANAGEMENT.V2.JOB_ERROR_DETAILS,
        drawerPaths.ERROR_MANAGEMENT.V2.ERROR_DETAILS,
      ]}
      width="full"
      onClose={handleClose}>
      <DrawerHeader className={classes.drawerErrorTitle} title={<Title />} handleClose={handleDrawerClose} hideBackButton>
        <ErrorDrawerAction flowId={flowId} onChange={handleErrorTypeChange} errorType={errorType} />
      </DrawerHeader>
      <Tabs flowId={flowId} onChange={handleErrorTypeChange} />

      <DrawerContent className={classes.errorDetailsDrawerContent}>
        {flowJobId ? (
          <Typography variant="body2" className={classes.errorsInRun}>
            <span className={classes.boldErrorsCount}>{childJob?.numOpenError} error{childJob?.numOpenError !== 1 ? 's' : ''} in this run </span>
            {childJob?.numOpenError <= 1000 ? (<span><span>: {allErrors.length} open  |  </span><span>{childJob?.numOpenError - allErrors.length} resolved</span></span>) : ''}
          </Typography>
        ) : ''}
        {errorType === FILTER_KEYS.RETRIES ? <RetryList flowId={flowId} /> : <ErrorList flowId={flowId} errorsInRun={flowJobId} />}
      </DrawerContent>
    </RightDrawer>
  );
}
