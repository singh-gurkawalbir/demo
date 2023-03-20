import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import makeStyles from '@mui/styles/makeStyles';
import EditRetryData from './EditRetryData';
import ViewErrorDetails from './ViewErrorDetails';
import ViewErrorRequestResponse from './ViewErrorRequestResponse';
import { selectors } from '../../../reducers';
import { safeParse } from '../../../utils/string';
import DrawerContent from '../../drawer/Right/DrawerContent';
import DrawerFooter from '../../drawer/Right/DrawerFooter';
import ErrorDetailActions from './ErrorDetailActions';
import actions from '../../../actions';
import AddToBatch from './ErrorDetailActions/AddToBatch';
import { FILTER_KEYS } from '../../../utils/errorManagement';
import useKeydownListener from '../ErrorTable/hooks/useKeyboardNavigation';
import { useEditRetryConfirmDialog } from '../ErrorTable/hooks/useEditRetryConfirmDialog';

const useStyles = makeStyles(theme => ({
  detailsContainer: {
    height: 'calc(100vh - 315px)',
    backgroundColor: 'white',
    border: `1px solid ${theme.palette.secondary.lightest}`,
    color: theme.palette.text.hint,
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

export default function ErrorDetails({ flowId, resourceId, isResolved, onClose, onTabChange, handleNext, errorsInPage, activeErrorId, isSplitView }) {
  const match = useRouteMatch();
  const classes = useStyles();
  const dispatch = useDispatch();
  const filterKey = isResolved ? FILTER_KEYS.RESOLVED : FILTER_KEYS.OPEN;

  const { mode, errorId } = match.params;

  const isFlowDisabled = useSelector(state =>
    selectors.resource(state, 'flows', flowId)?.disabled
  );
  const errorDoc = useSelector(state =>
    selectors.resourceError(state, { flowId, resourceId, errorId, isResolved })
  );

  const { retryDataKey: retryId, reqAndResKey} = errorDoc || {};

  const retryData = useSelector(state => selectors.userRetryData(state, retryId));

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
      if (isFlowDisabled) {
        tabs.push(ERROR_DETAILS_TABS.VIEW_RETRY_DATA);
      } else {
        tabs.push(ERROR_DETAILS_TABS.EDIT_RETRY_DATA);
      }
    }

    if (reqAndResKey && isResourceNetsuite) {
      tabs.push(ERROR_DETAILS_TABS.NETSUITE_REQUEST, ERROR_DETAILS_TABS.NETSUITE_RESPONSE);
    } else if (reqAndResKey) {
      tabs.push(ERROR_DETAILS_TABS.REQUEST, ERROR_DETAILS_TABS.RESPONSE);
    }

    tabs.push(ERROR_DETAILS_TABS.VIEW_FIELDS);

    return tabs;
  }, [retryId, reqAndResKey, isResourceNetsuite, isFlowDisabled]);

  if (!mode || !availableTabs.map(tab => tab.type).includes(mode)) {
    // Incase of invalid url , redirects user to first available tab
    onTabChange(errorId, availableTabs[0].type);
  }
  const showRetryDataChangedConfirmDialog = useEditRetryConfirmDialog({flowId, resourceId, isResolved});

  useKeydownListener({showRetryDataChangedConfirmDialog, errorsInPage, filterKey, dispatch, activeErrorId, isSplitView, handleNext});

  const handleModeChange = (evt, newValue) => onTabChange(errorId, newValue);

  return (
    <>
      <DrawerContent>
        <div className={classes.detailsContainer}>
          <Tabs
            value={mode}
            onChange={handleModeChange}
            className={classes.tabHeader}
            textColor="primary"
            indicatorColor="primary"
            >
            {
                availableTabs.map(({ label, type }) =>
                  <Tab key={type} label={label} id={type} value={type} />)
            }
          </Tabs>
          <TabPanel value={mode} type="view">
            <ViewErrorDetails
              errorId={errorId}
              flowId={flowId}
              resourceId={resourceId}
              isResolved={isResolved}
            />
          </TabPanel>
          <TabPanel value={mode} type="editRetry">
            <EditRetryData
              retryId={retryId}
              onChange={onRetryDataChange}
              flowId={flowId}
              resourceId={resourceId}
            />
          </TabPanel>
          <TabPanel value={mode} type="viewRetry">
            <EditRetryData
              retryId={retryId}
              onChange={onRetryDataChange}
              flowId={flowId}
              resourceId={resourceId}
            />
          </TabPanel>
          <TabPanel value={mode} type="request">
            <ViewErrorRequestResponse
              reqAndResKey={reqAndResKey}
              flowId={flowId}
              resourceId={resourceId}
              isRequest
            />
          </TabPanel>
          <TabPanel value={mode} type="response">
            <ViewErrorRequestResponse
              reqAndResKey={reqAndResKey}
              flowId={flowId}
              resourceId={resourceId}
            />
          </TabPanel>
        </div>
        { !isResolved && (
        <AddToBatch
          error={errorDoc}
          flowId={flowId}
          resourceId={resourceId}
          isResolved={isResolved} />
        )}
      </DrawerContent>

      <DrawerFooter>
        <ErrorDetailActions
          updatedRetryData={retryData}
          flowId={flowId}
          resourceId={resourceId}
          errorId={errorId}
          onClose={onClose}
          mode={mode}
          isResolved={isResolved}
          handleNext={handleNext} />
      </DrawerFooter>
    </>
  );
}
