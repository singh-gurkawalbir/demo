import React, { useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';
import { FormControlLabel, Typography } from '@material-ui/core';
import EditRetryData from '../../ErrorDetails/EditRetryData';
import ViewErrorDetails from '../../ErrorDetails/ViewErrorDetails';
import ViewErrorRequestResponse from '../../ErrorDetails/ViewErrorRequestResponse';
import { selectors } from '../../../../reducers';
import { safeParse } from '../../../../utils/string';
import DrawerContent from '../../../drawer/Right/DrawerContent';
import DrawerFooter from '../../../drawer/Right/DrawerFooter';
import ErrorDetailActions from '../../ErrorDetails/ErrorDetailActions';
import DrawerHeader from '../../../drawer/Right/DrawerHeader';
import SelectError from '../../../ResourceTable/errorManagement/cells/SelectError';

const useStyles = makeStyles(theme => ({
  detailsContainer: {
    height: '100%',
    // backgroundColor: 'white',
    // border: `1px solid ${theme.palette.secondary.lightest}`,
    padding: theme.spacing(0, 3),
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    // color: theme.palette.text.hint,
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

export default function ErrorDetails({ flowId, resourceId, isResolved, onClose, onTabChange, mode, errorId}) {
  const match = useRouteMatch();
  const classes = useStyles();
  // const { mode, errorId } = match.params;
  const [retryData, setRetryData] = useState();
  const isFlowDisabled = useSelector(state =>
    selectors.resource(state, 'flows', flowId)?.disabled
  );
  const errorDoc = useSelector(state =>
    selectors.resourceError(state, { flowId, resourceId, errorId, isResolved })
  );

  const { retryDataKey: retryId, reqAndResKey} = errorDoc || {};

  const onRetryDataChange = useCallback(
    data =>
      // Editor onChange returns string format, so parse it to get updated retryData
      setRetryData(safeParse(data)),
    []
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

  if (!mode || !availableTabs.map(tab => tab.type).includes(mode)) {
    // Incase of invalid url , redirects user to View Error fields tab
    onTabChange(errorId, 'view');
  }

  const handleModeChange = (evt, newValue) => onTabChange(errorId, newValue);

  return (
    <div className={classes.wrapper}>
      <Typography variant="h4" className={classes.title}>
        Error details
      </Typography>
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
                availableTabs.map(({ label, type }) => (
                  <Tab
                    key={type}
                    label={label}
                    id={type}
                    value={type}
                    className={classes.tab}
                  />
                ))
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
      </DrawerContent>

      <div className={classes.addToBatch}>
        <Typography variant="h4">
          <SelectError error={errorDoc} flowId={flowId} resourceId={resourceId} isResolved={isResolved} />
          Add to batch
        </Typography>
      </div>
      {/* <DrawerFooter>
        <ErrorDetailActions
          updatedRetryData={retryData}
          flowId={flowId}
          resourceId={resourceId}
          errorId={errorId}
          onClose={onClose}
          mode={mode}
          isResolved={isResolved}
        />
      </DrawerFooter> */}
    </div>
  );
}
