import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { Button, Typography, makeStyles } from '@material-ui/core';
import CeligoTable from '../../CeligoTable';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { NO_PENDING_QUEUED_JOBS } from '../../../utils/messageStore';
import CancelIcon from '../../icons/CancelIcon';
import LoadResources from '../../LoadResources';
import { getStatus, getPages } from '../util';
import RightDrawer from '../../drawer/Right';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import DynaSelect from '../../DynaForm/fields/DynaSelect';

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
        const resourceId = resource?._id;
        const handleCancelJob = useCallback(() => {
          dispatch(actions.connection.cancelQueuedJob(resourceId));
        }, [dispatch, resourceId]);

        return (
          <Button onClick={handleCancelJob}>
            <CancelIcon />
          </Button>
        );
      },
    },
  ],
};
const useStyles = makeStyles(theme => ({
  content: {
    padding: theme.spacing(1, 2),
  },
  select: {
    width: '300px',
  },
  drawerPaper: {
    marginTop: theme.appBarHeight,
    width: 824,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    backgroundColor: theme.palette.background.default,
    zIndex: theme.zIndex.drawer + 1,
    boxShadow: '-4px 4px 8px rgba(0,0,0,0.15)',
    overflowX: 'hidden',
  },
  fullWidthDrawerClose: {
    width: 'calc(100% - 60px)',
  },
  fullWidthDrawerOpen: {
    width: `calc(100% - ${theme.drawerWidth}px)`,
  },
  info: {
    padding: theme.spacing(1, 0),
  },
  infoNumber: {
    fontWeight: 'bold',
    paddingLeft: theme.spacing(0.5),
  },
  infoBlock: {
    marginRight: 12,
  },
}));

function QueuedJobs({ connectionId, onConnectionsChange}) {
  const classes = useStyles();
  const match = useRouteMatch();
  const { flowId } = match.params;
  const dispatch = useDispatch();
  const connections = useSelectorMemo(selectors.flowJobConnections, flowId);
  const connectionJobs = useSelector(state =>
    selectors.queuedJobs(state, connectionId)
  );
  const queueSize = useSelector(
    state => {
      const connection = selectors.resource(state, 'connections', connectionId);

      return connection ? connection.queueSize : 0;
    }
  );

  useEffect(() => {
    onConnectionsChange(connections);
  },
  [connections, onConnectionsChange]);

  useEffect(() => {
    if (connectionId) {
      dispatch(actions.connection.requestQueuedJobsPoll(connectionId));
      dispatch(actions.resource.connections.requestStatusPoll());
    }

    return () => {
      dispatch(actions.connection.cancelQueuedJobsPoll());
      dispatch(actions.resource.connections.cancelStatusPoll());
    };
  }, [connectionId, dispatch]);

  return (
    <>
      <div className={classes.content}>
        <div className={classes.info}>
          <Typography variant="body1" component="div">
            <span className={classes.infoBlock}>
              Jobs in Queue:
              <span className={classes.infoNumber}>
                {connectionJobs && connectionJobs.length}
              </span>
            </span>
            <span className={classes.infoBlock}>
              Messages in Queue:
              <span className={classes.infoNumber}>{queueSize}</span>
            </span>
          </Typography>
        </div>
        <div className={classes.info}>
          {connectionJobs && connectionJobs.length > 0 ? (
            <CeligoTable data={connectionJobs} {...metadata} />
          ) : (
            <Typography variant="body1">{NO_PENDING_QUEUED_JOBS}</Typography>
          )}
        </div>
      </div>

    </>
  );
}
const connectionsFilterConfig = {
  type: 'connections',
};
export default function QueuedJobsDrawer() {
  const match = useRouteMatch();
  const history = useHistory();
  const [connections, setConnections] = useState([]);
  const [connectionId, setConnectionId] = useState();

  const connectionsResourceList = useSelectorMemo(
    selectors.makeResourceListSelector,
    connectionsFilterConfig
  ).resources;
  const connectionName = connectionsResourceList.find(
    c => c._id === connectionId
  )?.name;

  const handleConnectionChange = useCallback(
    (id, value) => {
      setConnectionId(value);
    },
    [setConnectionId]
  );

  const handleConnectionsChange = useCallback(connections => {
    setConnections(connections);
    if (!connectionId && connections.length) {
      setConnectionId(connections[0]?.id);
    }
  }, [connectionId]);

  const handleClose = useCallback(() => {
    history.push(match.url);
  }, [history, match.url]);

  const action = useMemo(
    () => (
      <>
        <DynaSelect
          id="queuedJobs_connection"
          value={connectionId}
          skipDefault
          onFieldChange={handleConnectionChange}
          options={[
            { items: connections.map(c => ({ label: c.name, value: c.id })) },
          ]}
        />
      </>
    ),
    [connectionId, connections, handleConnectionChange]
  );

  return (
    <LoadResources required resources="flows,connections">
      <RightDrawer
        anchor="right"
        title={`Queued Jobs:${connectionName}`}
        height="tall"
        width="full"
        actions={action}
        variant="permanent"
        onClose={handleClose}
        path={['flows/:flowId/queuedJobs', ':flowId/queuedJobs']}>
        <QueuedJobs connectionId={connectionId} onConnectionsChange={handleConnectionsChange} />
      </RightDrawer>
    </LoadResources>
  );
}
