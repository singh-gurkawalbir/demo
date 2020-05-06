import { useState, useCallback } from 'react';
import { useRouteMatch } from 'react-router-dom';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';
import EditRetryData from './components/EditRetryData';
import ViewErrorDetails from './components/ViewErrorDetails';

const useStyles = makeStyles(theme => ({
  wrapper: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    background: theme.palette.background.paper,
    padding: theme.spacing(1),
    height: 500,
  },
  detailsContainer: {
    minHeight: theme.spacing(20),
    position: 'relative',
    backgroundColor: 'white',
    overflow: 'auto',
    maxWidth: 680,
    color: theme.palette.text.hint,
  },
}));

export default function ErrorDetails({ flowId, resourceId }) {
  const match = useRouteMatch();
  const classes = useStyles();
  const { mode, errorId } = match.params;
  const [recordMode, setRecordMode] = useState(mode);
  const handleModeChange = useCallback((event, newMode) => {
    setRecordMode(newMode);
  }, []);

  return (
    <div className={classes.wrapper}>
      <div className={classes.detailsContainer}>
        <Tabs
          value={recordMode}
          onChange={handleModeChange}
          textColor="primary"
          indicatorColor="primary">
          <Tab label="Body" value="edit" id="tab-1" aria-controls="tab-1" />
          <Tab label="Header" value="view" id="tab-2" aria-controls="tab-2" />)
        </Tabs>
        <div>
          {recordMode === 'view' ? (
            <ViewErrorDetails
              errorId={errorId}
              flowId={flowId}
              resourceId={resourceId}
            />
          ) : (
            <EditRetryData
              errorId={errorId}
              flowId={flowId}
              resourceId={resourceId}
            />
          )}
        </div>
      </div>
    </div>
  );
}
