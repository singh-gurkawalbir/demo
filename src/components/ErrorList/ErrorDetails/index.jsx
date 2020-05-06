import { useState, useCallback, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { useRouteMatch } from 'react-router-dom';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import EditRetryData from './components/EditRetryData';
import ViewErrorDetails from './components/ViewErrorDetails';
import { resourceError } from '../../../reducers';
import actions from '../../../actions';

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
    bottom: 36,
    backgroundColor: 'white',
    overflow: 'auto',
    color: theme.palette.text.hint,
  },
  tabContent: {
    height: 464,
  },
  actionButtonsContainer: {
    position: 'relative',
    bottom: 50,
    left: 800,
    '& > button': {
      marginLeft: theme.spacing(1),
    },
    width: 400,
  },
}));

export default function ErrorDetails({
  flowId,
  resourceId,
  errorId,
  mode,
  onClose,
}) {
  // const match = useRouteMatch();
  const classes = useStyles();
  const dispatch = useDispatch();
  // const { mode, errorId } = match.params;
  const [retryData, setRetryData] = useState();
  const [recordMode, setRecordMode] = useState(mode);
  const errorDoc = useSelector(state =>
    resourceError(state, { flowId, resourceId, errorId })
  );
  const { retryDataKey: retryId, ...details } = errorDoc || {};
  const handleModeChange = useCallback((event, newMode) => {
    setRecordMode(newMode);
  }, []);
  const onRetryDataChange = useCallback(data => {
    setRetryData(data);
  }, []);
  const updateRetry = useCallback(() => {
    dispatch(actions.job.updateRetryData({ retryData, retryId }));
  }, [dispatch, retryData, retryId]);
  const resolve = useCallback(() => {
    dispatch(
      actions.errorManager.flowErrorDetails.resolve({
        flowId,
        resourceId,
        errorIds: [details.errorId],
      })
    );

    if (onClose) onClose();
  }, [details.errorId, dispatch, flowId, onClose, resourceId]);
  const retry = useCallback(() => {
    dispatch(
      actions.errorManager.flowErrorDetails.retry({
        flowId,
        resourceId,
        errorIds: [details.errorId],
      })
    );

    if (onClose) onClose();
  }, [details.errorId, dispatch, flowId, onClose, resourceId]);

  return (
    <div className={classes.wrapper}>
      <div className={classes.actionButtonsContainer}>
        {retryId && (
          <Fragment>
            <Button
              variant="outlined"
              disabled={!retryData}
              onClick={updateRetry}>
              Update Retry
            </Button>
            <Button variant="outlined" onClick={retry}>
              Retry
            </Button>
          </Fragment>
        )}
        <Button variant="outlined" onClick={resolve}>
          Resolve
        </Button>
      </div>
      <div className={classes.detailsContainer}>
        <Tabs
          value={recordMode}
          onChange={handleModeChange}
          textColor="primary"
          indicatorColor="primary">
          <Tab
            label="Edit retry data"
            value="edit"
            id="tab-1"
            aria-controls="tab-1"
          />
          {retryId && (
            <Tab
              label="View error details"
              value="view"
              id="tab-2"
              aria-controls="tab-2"
            />
          )}
        </Tabs>
        <div className={classes.tabContent}>
          {!retryId && <ViewErrorDetails details={details} />}

          {retryId &&
            (recordMode === 'view' ? (
              <ViewErrorDetails details={details} />
            ) : (
              <EditRetryData
                retryId={retryId}
                onChange={onRetryDataChange}
                flowId={flowId}
                resourceId={resourceId}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
