import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';
import EditRetryData from '../../ErrorDetails/EditRetryData';
import ViewErrorDetails from '../../ErrorDetails/ViewErrorDetails';
import ViewErrorRequestResponse from '../../ErrorDetails/ViewErrorRequestResponse';
import { selectors } from '../../../../reducers';
import { safeParse } from '../../../../utils/string';
import DrawerContent from '../../../drawer/Right/DrawerContent';
import ErrorDetailActions from '../../ErrorDetails/ErrorDetailActions';
import ErrorControls from './ErrorControls';
import actions from '../../../../actions';
import { useSelectorMemo } from '../../../../hooks';
import AddToBatch from '../../ErrorDetails/ErrorDetailActions/AddToBatch';

const useStyles = makeStyles(theme => ({
  detailsContainer: {
    height: '100%',
    padding: theme.spacing(0, 3),
    display: 'flex',
    flexDirection: 'column',
  },
  tabContent: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    borderTop: 'none',
    borderBottom: 'none',
  },
  tabHeader: {
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    color: theme.palette.secondary.main,
    wordBreak: 'break-word',
  },
  tabContainer: {
    padding: theme.spacing(0, 3),
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
  },
  tabPanel: {
    background: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    padding: theme.spacing(1, 2),
    overflow: 'visible',
  },
  tab: {
    minWidth: 'auto',
    color: theme.palette.secondary.main,
    fontSize: 14,
  },
}));

const ERROR_DETAILS_TABS = {
  VIEW_FIELDS: { type: 'view', label: 'Error fields' },
  EDIT_RETRY_DATA: { type: 'editRetry', label: 'Edit retry data' },
  VIEW_RETRY_DATA: { type: 'viewRetry', label: 'Retry data' },
  REQUEST: { type: 'request', label: 'HTTP request' },
  RESPONSE: { type: 'response', label: 'HTTP response' },
  NETSUITE_REQUEST: { type: 'request', label: 'View request' },
  NETSUITE_RESPONSE: { type: 'response', label: 'View response' },
};

function TabPanel({ children, value, type }) {
  const classes = useStyles();
  const hidden = value !== type;

  if (hidden) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      className={classes.tabContent}
      id={type}
      aria-labelledby={type}>
      {children}
    </div>
  );
}

export default function ErrorDetails({
  flowId,
  resourceId,
  isResolved,
}) {
  const classes = useStyles();
  const [mode, setMode] = useState('editRetry');
  const dispatch = useDispatch();

  const errorFilter = useSelector(
    state => selectors.filter(state, 'openErrors'), shallowEqual
  );

  const errorConfig = useMemo(() => ({
    flowId,
    resourceId,
    isResolved,
  }), [isResolved, flowId, resourceId]);

  const errorsInPage = useSelectorMemo(selectors.mkResourceFilteredErrorsInCurrPageSelector, errorConfig);

  const activeErrorId = useSelector(state => {
    const defaultError = errorsInPage?.[0]?.errorId;
    const e = selectors.filter(state, 'openErrors');

    return e.activeErrorId || defaultError;
  });

  useEffect(() => {
    if (errorsInPage?.length) {
      dispatch(actions.patchFilter('openErrors', {activeErrorId: errorsInPage?.[0]?.errorId}));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorFilter?.keyword, errorFilter?.paging?.currPage]);

  const isFlowDisabled = useSelector(state =>
    selectors.resource(state, 'flows', flowId)?.disabled
  );
  const errorDoc = useSelector(state =>
    selectors.resourceError(state, { flowId, resourceId, errorId: activeErrorId, isResolved })
  ) || {};

  const { retryDataKey: retryId, reqAndResKey} = errorDoc || {};
  const userRetryData = useSelector(state => selectors.userRetryData(state, retryId));

  const onRetryDataChange = useCallback(
    data =>
      // Editor onChange returns string format, so parse it to get updated retryData
      dispatch(actions.errorManager.retryData.updateUserRetryData({retryId, retryData: safeParse(data)})),
    [dispatch, retryId]
  );

  const isResourceNetsuite = useSelector(state => selectors.isResourceNetsuite(state, resourceId));

  const availableTabs = useMemo(() => {
    const tabs = [];

    if (retryId) {
      if (!isFlowDisabled) {
        tabs.push(ERROR_DETAILS_TABS.EDIT_RETRY_DATA);
      } else {
        tabs.push(ERROR_DETAILS_TABS.VIEW_RETRY_DATA);
      }
    }
    if (!reqAndResKey) return tabs;

    if (isResourceNetsuite) {
      tabs.push(ERROR_DETAILS_TABS.NETSUITE_REQUEST, ERROR_DETAILS_TABS.NETSUITE_RESPONSE);
    } else {
      tabs.push(ERROR_DETAILS_TABS.REQUEST, ERROR_DETAILS_TABS.RESPONSE);
    }

    tabs.push(ERROR_DETAILS_TABS.VIEW_FIELDS);

    return tabs;
  }, [retryId, reqAndResKey, isResourceNetsuite, isFlowDisabled]);

  const handleModeChange = useCallback((evt, newValue) => {
    setMode(newValue);
  }, []);

  return (
    <div className={classes.wrapper}>
      <span className={classes.label}>Error details</span>
      <ErrorControls
        retryId={retryId}
        flowId={flowId}
        resourceId={resourceId}
        errorsInPage={errorsInPage}
        activeErrorId={activeErrorId} />
      <DrawerContent>
        <div className={classes.detailsContainer}>
          <Tabs
            value={mode}
            onChange={handleModeChange}
            className={classes.tabHeader}
            textColor="primary"
            indicatorColor="primary" >
            { availableTabs.map(({ label, type }) => (
              <Tab
                key={type}
                label={label}
                id={type}
                value={type}
                className={classes.tab} />
            )) }
          </Tabs>
          <TabPanel value={mode} type="view">
            <ViewErrorDetails
              errorId={activeErrorId}
              flowId={flowId}
              resourceId={resourceId}
              isResolved={isResolved} />
          </TabPanel>
          <TabPanel value={mode} type="editRetry">
            <EditRetryData
              retryId={retryId}
              onChange={onRetryDataChange}
              flowId={flowId}
              resourceId={resourceId} />
          </TabPanel>
          <TabPanel value={mode} type="request">
            <ViewErrorRequestResponse
              reqAndResKey={reqAndResKey}
              flowId={flowId}
              resourceId={resourceId}
              isRequest />
          </TabPanel>
          <TabPanel value={mode} type="response">
            <ViewErrorRequestResponse
              reqAndResKey={reqAndResKey}
              flowId={flowId}
              resourceId={resourceId} />
          </TabPanel>
        </div>
        <AddToBatch
          error={errorDoc}
          flowId={flowId}
          resourceId={resourceId}
          isResolved={isResolved} />
        <ErrorDetailActions
          errorsInPage={errorsInPage}
          updatedRetryData={userRetryData}
          flowId={flowId}
          resourceId={resourceId}
          errorId={activeErrorId}
          mode={mode}
          isResolved={isResolved}
          activeErrorId={activeErrorId} />
      </DrawerContent>
    </div>
  );
}
