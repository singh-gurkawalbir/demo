import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch, useHistory, useLocation, matchPath } from 'react-router-dom';
import { Typography, makeStyles, Divider } from '@material-ui/core';
import CeligoTable from '../../CeligoTable';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { NO_PENDING_QUEUED_JOBS } from '../../../utils/messageStore';
import CancelIcon from '../../icons/CancelIcon';
import LoadResources from '../../LoadResources';
import { getStatus, getPages } from '../../../utils/jobdashboard';
import RightDrawer from '../../drawer/Right';
import DrawerHeader from '../../drawer/Right/DrawerHeader';
import DrawerContent from '../../drawer/Right/DrawerContent';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import DynaSelect from '../../DynaForm/fields/DynaSelect';

const metadata = {
  useColumns: () => [
    {
      key: 'integration',
      heading: 'Integration',
      isLoggable: true,
      Value: ({rowData: job}) => job._integrationId && job._integrationId.name,
    },
    {
      key: 'flow',
      heading: 'Flow',
      isLoggable: true,
      Value: ({rowData: job}) => job._flowId && job._flowId.name,
    },
    {
      key: 'status',
      heading: 'Status',
      isLoggable: true,
      Value: ({rowData: job}) => getStatus({ ...job, uiStatus: job.status }),
    },
    {
      key: 'success',
      heading: 'Success',
      isLoggable: true,
      Value: ({rowData: job}) => job.numSuccess,
    },
    {
      key: 'ignore',
      heading: 'Ignore',
      isLoggable: true,
      Value: ({rowData: job}) => job.numIgnore,
    },
    {
      key: 'error',
      heading: 'Error',
      isLoggable: true,
      Value: ({rowData: job}) => job.numError,
    },
    {
      key: 'pages',
      heading: 'Pages',
      isLoggable: true,
      Value: ({rowData: job}) => getPages(job),
    },
  ],
  useRowActions: () => [
    {
      key: 'cancel',
      label: 'Cancel',
      icon: CancelIcon,
      useOnClick: rowData => {
        const dispatch = useDispatch();
        const resourceId = rowData?._id;
        const handleCancelJob = useCallback(() => {
          dispatch(actions.connection.cancelQueuedJob(resourceId));
        }, [dispatch, resourceId]);

        return handleCancelJob;
      },
    },
  ],
};

const useStyles = makeStyles(theme => ({
  content: {
    paddingBottom: theme.spacing(1),
  },
  select: {
    width: 'auto',
    minWidth: 230,
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
  queuedDrawerHeader: {
    alignItems: 'center',
  },
  divider: {
    height: 20,
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
        <DrawerHeader title={`Queued Jobs: ${connectionName}`} className={classes.queuedDrawerHeader}>
          {/* TODO: as per the mock we need help component <Help /> beside the select field */}
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
          {/* TODO: @Azhar need to create seperate component */}
          <Divider orientation="vertical" className={classes.divider} />
        </DrawerHeader>

        <DrawerContent>
          <QueuedJobs connectionId={connectionId} />
        </DrawerContent>
      </RightDrawer>
    </LoadResources>
  );
}

