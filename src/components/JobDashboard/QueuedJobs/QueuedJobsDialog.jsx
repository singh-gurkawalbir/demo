import { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch, Route, useHistory } from 'react-router-dom';
import {
  MenuItem,
  FormControl,
  Button,
  Drawer,
  InputLabel,
  Typography,
  makeStyles,
} from '@material-ui/core';
import CeligoSelect from '../../CeligoSelect';
import CeligoTable from '../../CeligoTable';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import { getStatus, getPages } from '../util';
import { NO_PENDING_QUEUED_JOBS } from '../../../utils/messageStore';
import LoadResources from '../../LoadResources';
import DrawerTitleBar from './TitleBar';

const metadata = {
  columns: [
    {
      heading: 'Integration',
      value: job => job._integrationId && job._integrationId.name,
    },
    {
      heading: 'Flow',
      value: job => job._flowId && job._flowId.name,
    },
    {
      heading: 'Status',
      value: job => getStatus({ ...job, uiStatus: job.status }),
    },
    {
      heading: 'Success',
      value: job => job.numSuccess,
    },
    {
      heading: 'Ignore',
      value: job => job.numIgnore,
    },
    {
      heading: 'Error',
      value: job => job.numError,
    },
    {
      heading: 'Pages',
      value: job => getPages(job),
    },
  ],
  rowActions: [
    {
      label: 'Cancel',
      component: function CancelQueuedJobAction({ resource }) {
        const dispatch = useDispatch();

        return (
          <Button
            onClick={() =>
              dispatch(actions.connection.cancelQueuedJob(resource._id))
            }>
            Cancel
          </Button>
        );
      },
    },
  ],
};
const useStyles = makeStyles(theme => ({
  drawerPaper: {
    marginTop: theme.appBarHeight,
    width: `90%`,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    backgroundColor: theme.palette.background.default,
    zIndex: theme.zIndex.drawer + 1,
    boxShadow: `-4px 4px 8px rgba(0,0,0,0.15)`,
    overflowX: 'hidden',
  },
}));

function QueuedJobs({ parentUrl }) {
  const classes = useStyles();
  const match = useRouteMatch();
  const history = useHistory();
  const { flowId } = match.params;
  const [requestJobs, setRequestJobs] = useState(true);
  const dispatch = useDispatch();
  const [connectionId, setConnectionId] = useState(null);
  const connections = useSelector(
    state => selectors.flowJobConnections(state, flowId),
    (left, right) => left.length === right.length
  );
  const connectionJobs = useSelector(state =>
    selectors.queuedJobs(state, connectionId)
  );
  const queueSize = useSelector(state => {
    const { resources: connections } = selectors.resourceListWithPermissions(
      state,
      {
        type: 'connections',
      }
    );
    const connection = connections.find(c => c._id === connectionId);

    return connection ? connection.queueSize : 0;
  });

  useEffect(() => {
    if (requestJobs && connections && connections.length > 0) {
      setConnectionId(connections[0].id);
      dispatch(actions.connection.requestQueuedJobs(connections[0].id));
      setRequestJobs(false);
    }
  }, [connections, dispatch, requestJobs]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (connectionId) {
        dispatch(actions.connection.requestQueuedJobs(connectionId));
        dispatch(actions.resource.connections.refreshStatus());
      }
    }, 5 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [connectionId, dispatch]);
  const handleConnectionChange = value => {
    setConnectionId(value);
    dispatch(actions.connection.requestQueuedJobs(value));
  };

  const handleClose = () => {
    history.push(parentUrl);
  };

  return (
    <Fragment>
      <Drawer
        anchor="right"
        open={!!match}
        classes={{
          paper: classes.drawerPaper,
        }}
        onClose={handleClose}>
        <DrawerTitleBar
          flowId={flowId}
          connectionId={connectionId}
          backToParent
          onConnChange={handleConnectionChange}
          parentUrl={parentUrl}
          onClose={handleClose}
        />
        <Fragment>
          Jobs in Queue: {connectionJobs && connectionJobs.length} Messages in
          Queue: {queueSize}
          <FormControl>
            <InputLabel htmlFor="connections">Connection:</InputLabel>
            <CeligoSelect
              id="connections"
              value={connectionId}
              onChange={handleConnectionChange}
              margin="dense">
              {connections &&
                connections.map(conn => (
                  <MenuItem key={conn.id} value={conn.id}>
                    {conn.name}
                  </MenuItem>
                ))}
            </CeligoSelect>
          </FormControl>
        </Fragment>
        <Fragment>
          {connectionJobs && connectionJobs.length > 0 ? (
            <CeligoTable data={connectionJobs} {...metadata} />
          ) : (
            <Typography>{NO_PENDING_QUEUED_JOBS}</Typography>
          )}
        </Fragment>
      </Drawer>
    </Fragment>
  );
}

export default function QueuedJobsDrawer() {
  const match = useRouteMatch();

  return (
    <Route exact path={`${match.url}/flows/:flowId/queuedJobs`}>
      <LoadResources required resources="flows,exports,imports,connections">
        <QueuedJobs parentUrl={match.url} />
      </LoadResources>
    </Route>
  );
}
