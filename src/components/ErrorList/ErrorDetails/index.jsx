import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { Box, TabContext, TabList, Tab, TabPanel } from '@celigo/fuse-ui';
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

const ERROR_DETAILS_TABS = {
  VIEW_FIELDS: { type: 'view', label: 'Error fields' },
  EDIT_RETRY_DATA: { type: 'editRetry', label: 'Edit retry data' },
  VIEW_RETRY_DATA: { type: 'viewRetry', label: 'Retry data' },
  REQUEST: { type: 'request', label: 'HTTP request' },
  RESPONSE: { type: 'response', label: 'HTTP response' },
  NETSUITE_REQUEST: { type: 'request', label: 'View request' },
  NETSUITE_RESPONSE: { type: 'response', label: 'View response' },
};

const TabPanelWrapper = ({ children, value }) => (
  <TabPanel value={value} sx={{height: '100%'}}>
    <Box
      id={value}
      aria-labelledby={value}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderTop: 'none',
        borderBottom: 'none',
        height: '100%',
      }}>
      {children}
    </Box>
  </TabPanel>
);

export default function ErrorDetails({ flowId, resourceId, isResolved, onClose, onTabChange, handleNext, errorsInPage, activeErrorId, isSplitView }) {
  const match = useRouteMatch();
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
        <TabContext value={mode}>
          <Box
            sx={{
              height: 'calc(100vh - 315px)',
              backgroundColor: 'white',
              border: theme => `1px solid ${theme.palette.secondary.lightest}`,
              color: theme => theme.palette.text.hint,
              display: 'flex',
              flexDirection: 'column',
            }}>
            <TabList
              onChange={handleModeChange}
              sx={{ borderBottom: theme => `1px solid ${theme.palette.secondary.lightest}` }}
          >
              {
                availableTabs.map(({ label, type }) =>
                  <Tab key={type} label={label} id={type} value={type} />)
              }
            </TabList>

            <TabPanelWrapper value="view">
              <ViewErrorDetails
                errorId={errorId}
                flowId={flowId}
                resourceId={resourceId}
                isResolved={isResolved}
            />
            </TabPanelWrapper>
            <TabPanelWrapper value="editRetry">
              <EditRetryData
                retryId={retryId}
                onChange={onRetryDataChange}
                flowId={flowId}
                resourceId={resourceId}
            />
            </TabPanelWrapper>
            <TabPanelWrapper value="viewRetry">
              <EditRetryData
                retryId={retryId}
                onChange={onRetryDataChange}
                flowId={flowId}
                resourceId={resourceId}
            />
            </TabPanelWrapper>
            <TabPanelWrapper value="request">
              <ViewErrorRequestResponse
                reqAndResKey={reqAndResKey}
                flowId={flowId}
                resourceId={resourceId}
                isRequest
            />
            </TabPanelWrapper>
            <TabPanelWrapper value="response">
              <ViewErrorRequestResponse
                reqAndResKey={reqAndResKey}
                flowId={flowId}
                resourceId={resourceId}
            />
            </TabPanelWrapper>
          </Box>
        </TabContext>
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
