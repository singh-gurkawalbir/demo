import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch, useHistory, useLocation, matchPath } from 'react-router-dom';
import { Typography, makeStyles } from '@material-ui/core';
import CeligoTable from '../../CeligoTable';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { NO_PENDING_QUEUED_JOBS } from '../../../utils/messageStore';
import CancelIcon from '../../icons/CancelIcon';
import LoadResources from '../../LoadResources';
import { getStatus, getPages } from '../util';
import RightDrawer from '../../drawer/Right';
import DrawerHeader from '../../drawer/Right/DrawerHeader';
import DrawerContent from '../../drawer/Right/DrawerContent';
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
      icon: CancelIcon,
      component: function CancelQueuedJobAction({ rowData = {} }) {
        const dispatch = useDispatch();
        const resourceId = rowData?._id;
        const handleCancelJob = useCallback(() => {
          dispatch(actions.connection.cancelQueuedJob(resourceId));
        }, [dispatch, resourceId]);

        useEffect(() => {
          handleCancelJob();
        }, [handleCancelJob]);

        return null;
      },
    },
  ],
};

const useStyles = makeStyles(theme => ({
  content: {
    padding: theme.spacing(1, 2),
  },
  select: {
    width: 'auto',
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

function QueuedJobs({ connectionId}) {
  const classes = useStyles();
  const dispatch = useDispatch();
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
  );
}

const connectionsFilterConfig = {
  type: 'connections',
};
const paths = ['flows/:flowId/queuedJobs', ':flowId/queuedJobs'];
const flowJobConnectionsOptions = { ignoreBorrowedConnections: true };

export default function QueuedJobsDrawer() {
  const classes = useStyles();
  const location = useLocation();
  const match = useRouteMatch();
  const history = useHistory();
  const [connectionId, setConnectionId] = useState();
  const matchedPath = paths.find(p => matchPath(location.pathname, {path: `${match.path}/${p}`}));
  const { params: { flowId } = {} } = matchPath(location.pathname, {path: `${match.path}/${matchedPath}`}) || {};
  const connectionsResourceList = useSelectorMemo(
    selectors.makeResourceListSelector,
    connectionsFilterConfig
  ).resources;
  const connectionName = connectionsResourceList.find(
    c => c._id === connectionId
  )?.name;
  const connections = useSelectorMemo(selectors.flowJobConnections, flowId, flowJobConnectionsOptions);

  const handleConnectionChange = useCallback(
    (id, value) => {
      setConnectionId(value);
    },
    [setConnectionId]
  );

  useEffect(() => {
    if (connections.length && !connectionId) {
      setConnectionId(connections[0].id);
    }
  }, [connectionId, connections]);
  const handleClose = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <LoadResources required resources="flows,connections">
      <RightDrawer
        height="tall"
        width="full"
        variant="permanent"
        hideBackButton
        onClose={handleClose}
        path={paths}>

        <DrawerHeader title={`Queued Jobs: ${connectionName}`}>
          <DynaSelect
            rootClassName={classes.select}
            id="queuedJobs_connection"
            value={connectionId}
            skipDefault
            onFieldChange={handleConnectionChange}
            options={[
              { items: connections.map(c => ({ label: c.name, value: c.id })) },
            ]}
          />
        </DrawerHeader>

        <DrawerContent>
          <QueuedJobs connectionId={connectionId} />
        </DrawerContent>
      </RightDrawer>
    </LoadResources>
  );
}
