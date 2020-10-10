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
import ErrorDetailActions from './ErrorDetailActions';

const useStyles = makeStyles(theme => ({
  detailsContainer: {
    height: `calc(100% - ${50}px)`,
    backgroundColor: 'white',
    overflow: 'auto',
    color: theme.palette.text.hint,
  },
  tabContent: {
    height: '100%',
    border: `1px solid ${theme.palette.secondary.lightest}`,
    borderTop: 'none',
    borderBottom: 'none',
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    height: '100%',
  },
  actions: {
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
    padding: theme.spacing(2, 0, 1, 0),
    display: 'flex',
    justifyContent: 'space-between',
  },
  tabHeader: {
    border: `1px solid ${theme.palette.secondary.lightest}`,
  },
}));

const TabContent = ({ retryId, errorId, flowId, resourceId, recordMode, onChange, isFlowDisabled }) => {
  if (!retryId || recordMode === 'view' || isFlowDisabled) {
    return (
      <ViewErrorDetails
        errorId={errorId}
        flowId={flowId}
        resourceId={resourceId}
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
    <div className={classes.root}>
      <div className={classes.detailsContainer}>
        {(retryId && !isFlowDisabled && !isResolved) ? (
          <Tabs
            className={classes.tabHeader}
            value={recordMode}
            onChange={handleModeChange}
            textColor="primary"
            indicatorColor="primary">
            <Tab label="Edit retry data" value="edit" id="tab-2" aria-controls="tab-2" />
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
            isFlowDisabled={isFlowDisabled}
            isResolved={isResolved}
          />
        </div>
      </div>
      <div className={classes.actions}>
        <ErrorDetailActions
          retryData={retryData}
          flowId={flowId}
          resourceId={resourceId}
          errorId={errorId}
          onClose={onClose}
          mode={recordMode}
          isResolved={isResolved}
        />
      </div>
    </div>
  );
}
