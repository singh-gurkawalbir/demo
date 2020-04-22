import { Fragment, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch, Route, useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { Button, Drawer, Typography, makeStyles } from '@material-ui/core';
import CeligoTable from '../../CeligoTable';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import { NO_PENDING_QUEUED_JOBS } from '../../../utils/messageStore';
import CancelIcon from '../../icons/CancelIcon';
import LoadResources from '../../LoadResources';
import { getStatus, getPages } from '../util';
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
        const handleCancelJob = useCallback(() => {
          dispatch(actions.connection.cancelQueuedJob(resource._id));
        }, [dispatch, resource._id]);

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
  drawerPaper: {
    marginTop: theme.appBarHeight,
    width: 824,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    backgroundColor: theme.palette.background.default,
    zIndex: theme.zIndex.drawer + 1,
    boxShadow: `-4px 4px 8px rgba(0,0,0,0.15)`,
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
  const queueSize = useSelector(
    state =>
      selectors.resource(state, 'connections', connectionId).queueSize || 0
  );

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

  const drawerOpened = useSelector(state => selectors.drawerOpened(state));

  return (
    <Fragment>
      <Drawer
        anchor="right"
        open={!!match}
        classes={{
          paper: clsx(classes.drawerPaper, {
            [classes.fullWidthDrawerClose]: !drawerOpened,
            [classes.fullWidthDrawerOpen]: drawerOpened,
          }),
        }}
        onClose={handleClose}>
        <DrawerTitleBar
          flowId={flowId}
          connectionId={connectionId}
          backToParent
          onConnChange={handleConnectionChange}
          parentUrl={parentUrl}
        />
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
