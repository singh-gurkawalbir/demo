import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';
import EditRetryData from './EditRetryData';
import ViewErrorDetails from './ViewErrorDetails';
import { selectors } from '../../../reducers';
import { safeParse } from '../../../utils/string';
import DrawerContent from '../../drawer/Right/DrawerContent';
import DrawerFooter from '../../drawer/Right/DrawerFooter';

import ErrorDetailActions from './ErrorDetailActions';

const useStyles = makeStyles(theme => ({
  detailsContainer: {
    height: 'calc(100% - 38px)',
    backgroundColor: 'white',
    color: theme.palette.text.hint,
  },
  tabContent: {
    height: '100%',
    border: `1px solid ${theme.palette.secondary.lightest}`,
    borderTop: 'none',
    borderBottom: 'none',
    overflow: 'auto',
  },
  tabHeader: {
    border: `1px solid ${theme.palette.secondary.lightest}`,
  },
}));

const TabContent = ({ retryId, errorId, flowId, resourceId, recordMode, onChange, isResolved }) => {
  if (!retryId || recordMode === 'view' || isResolved) {
    return (
      <ViewErrorDetails
        errorId={errorId}
        flowId={flowId}
        resourceId={resourceId}
        isResolved={isResolved}
      />
    );
  }

  // Incase of recordMode = 'edit' show edit retry data content
  return (
    <EditRetryData
      retryId={retryId}
      onChange={onChange}
      flowId={flowId}
      resourceId={resourceId}
    />
  );
};

export default function ErrorDetails({ flowId, resourceId, isResolved, onClose }) {
  const match = useRouteMatch();
  const classes = useStyles();
  const { mode, errorId } = match.params;
  const [retryData, setRetryData] = useState();
  const [recordMode, setRecordMode] = useState(mode);
  const isFlowDisabled = useSelector(state =>
    selectors.resource(state, 'flows', flowId)?.disabled
  );
  const retryId = useSelector(state => {
    const errorDoc =
      selectors.resourceError(state, { flowId, resourceId, errorId }) || {};

    return errorDoc.retryDataKey;
  });
  const handleModeChange = useCallback((event, newMode) => {
    setRecordMode(newMode);
  }, []);
  const onRetryDataChange = useCallback(
    data =>
      // Editor onChange returns string format, so parse it to get updated retryData
      setRetryData(safeParse(data)),
    []
  );

  return (
    <>
      <DrawerContent>
        <div className={classes.detailsContainer}>
          {(retryId && !isResolved) ? (
            <Tabs
              className={classes.tabHeader}
              value={recordMode}
              onChange={handleModeChange}
              textColor="primary"
              indicatorColor="primary">
              <Tab label={isFlowDisabled ? 'Retry data' : 'Edit retry data'} value="edit" id="tab-2" aria-controls="tab-2" />
              <Tab label="Error fields" value="view" id="tab-1" aria-controls="tab-1" />
            </Tabs>
          ) : (
            <Tabs
              className={classes.tabHeader}
              value={recordMode}
              onChange={handleModeChange}
              textColor="primary"
              indicatorColor="primary">

              <Tab label="Error fields" value="view" id="tab-1" aria-controls="tab-1" />
            </Tabs>
          )}
          <div className={classes.tabContent}>
            <TabContent
              flowId={flowId}
              resourceId={resourceId}
              retryId={retryId}
              errorId={errorId}
              onChange={onRetryDataChange}
              recordMode={recordMode}
              isResolved={isResolved}
          />
          </div>
        </div>
      </DrawerContent>

      <DrawerFooter>
        <ErrorDetailActions
          updatedRetryData={retryData}
          flowId={flowId}
          resourceId={resourceId}
          errorId={errorId}
          onClose={onClose}
          mode={recordMode}
          isResolved={isResolved}
        />
      </DrawerFooter>
    </>
  );
}
