import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Drawer, IconButton, Tabs, Tab } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import ArrowUpIcon from '../../../../components/icons/ArrowUpIcon';
import ArrowDownIcon from '../../../../components/icons/ArrowDownIcon';
import ConnectionsIcon from '../../../../components/icons/ConnectionsIcon';
import WarningIcon from '../../../../components/icons/WarningIcon';
import AuditLogIcon from '../../../../components/icons/AuditLogIcon';
import DebugIcon from '../../../../components/icons/DebugIcon';
import RunIcon from '../../../../components/icons/RunIcon';
import CloseIcon from '../../../../components/icons/CloseIcon';
import * as selectors from '../../../../reducers';
import ConnectionPanel from './panels/Connection';
import RunDashboardPanel from './panels/RunDashboard';
import AuditPanel from './panels/Audit';
import actions from '../../../../actions';

const useStyles = makeStyles(theme => ({
  drawer: {
    // none needed so far.
  },
  drawerPaper: {
    marginLeft: theme.drawerWidthMinimized,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(0),
    transition: theme.transitions.create(['height', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  drawerPaperShift: {
    marginLeft: theme.drawerWidth,
    transition: theme.transitions.create(['height', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  actionsContainer: {
    paddingRight: theme.spacing(3),
    justifyContent: 'center',
  },
  tabBar: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    borderTop: 0,
    display: 'flex',
    justifyContent: `space-between`,
    alignItems: 'center',
    width: '100%',
  },
  tabPanel: {
    overflow: 'auto',
    height: '100%',
  },
  noScroll: {
    overflowY: 'hidden',
  },
  customTab: {
    maxWidth: 500,
  },
  connectionWarning: {
    color: theme.palette.error.main,
  },
}));

function TabPanel({ children, value, index, classes }) {
  const hidden = value !== index;

  return (
    <div
      role="tabpanel"
      className={classes.tabPanel}
      hidden={hidden}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}>
      <div>{!hidden && children}</div>
    </div>
  );
}

export default function BottomDrawer({
  size,
  setSize,
  flow,
  setTabValue,
  tabValue,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
  const isAnyFlowConnectionOffline = useSelector(state =>
    selectors.isAnyFlowConnectionOffline(state, flow._id)
  );
  const connectionDebugLogs = useSelector(state => selectors.debugLogs(state));
  const connectionIdNameMap = useSelector(state =>
    selectors.resourceNamesByIds(state, 'connections')
  );
  const [clearConnectionLogs, setClearConnectionLogs] = useState(true);
  const maxStep = 3; // set maxStep to 4 to allow 100% drawer coverage.
  const handleSizeChange = useCallback(
    direction => () => {
      if (size === maxStep && direction === 1) return setSize(0);

      if (size === 0 && direction === -1) return setSize(maxStep);

      setSize(size + direction);
    },
    [setSize, size]
  );
  const handleTabChange = useCallback(
    (event, newValue) => {
      setTabValue(newValue);

      if (size === 0) setSize(1);
    },
    [setSize, setTabValue, size]
  );
  const handleDebugLogsClose = useCallback(
    connectionId => event => {
      event.stopPropagation();
      setTabValue(0);
      dispatch(actions.connection.clearDebugLogs(connectionId));
    },
    [dispatch, setTabValue]
  );

  useEffect(() => {
    if (clearConnectionLogs) {
      connectionDebugLogs &&
        Object.keys(connectionDebugLogs).forEach(connectionId =>
          dispatch(actions.connection.clearDebugLogs(connectionId))
        );
      setClearConnectionLogs(false);
    }
  }, [clearConnectionLogs, connectionDebugLogs, dispatch]);

  function tabProps(index) {
    return {
      id: `tab-${index}`,
      'aria-controls': `tabpanel-${index}`,
    };
  }

  return (
    <Drawer
      open
      className={classes.drawer}
      classes={{
        paper: clsx(classes.drawerPaper, {
          [classes.drawerPaperShift]: drawerOpened,
          [classes.noScroll]: size === 0,
        }),
      }}
      PaperProps={{ style: { height: size ? `${size * 25}%` : '41px' } }}
      variant="persistent"
      anchor="bottom">
      <div className={classes.tabBar}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example">
          <Tab
            {...tabProps(0)}
            icon={
              isAnyFlowConnectionOffline ? (
                <WarningIcon className={classes.connectionWarning} />
              ) : (
                <ConnectionsIcon />
              )
            }
            label="Connections"
          />
          <Tab {...tabProps(1)} icon={<RunIcon />} label="Run Dashboard" />
          <Tab {...tabProps(2)} icon={<AuditLogIcon />} label="Audit Log" />
          {connectionDebugLogs &&
            Object.keys(connectionDebugLogs).map(
              (connectionId, cIndex) =>
                connectionDebugLogs[connectionId] && (
                  <Tab
                    className={classes.customTab}
                    {...tabProps(cIndex + 3)}
                    icon={<DebugIcon />}
                    key={connectionId}
                    component="div"
                    label={
                      <div>
                        {connectionIdNameMap[connectionId]} - DEBUG
                        <IconButton
                          onClick={handleDebugLogsClose(connectionId)}>
                          <CloseIcon />
                        </IconButton>
                      </div>
                    }
                  />
                )
            )}
        </Tabs>
        <div className={classes.actionsContainer}>
          <IconButton
            data-test="increaseFlowBuilderBottomDrawer"
            size="small"
            onClick={handleSizeChange(1)}>
            <ArrowUpIcon />
          </IconButton>
          <IconButton
            data-test="decreaseFlowBuilderBottomDrawer"
            size="small"
            onClick={handleSizeChange(-1)}>
            <ArrowDownIcon />
          </IconButton>
        </div>
      </div>

      <TabPanel value={tabValue} index={0} classes={classes}>
        <ConnectionPanel flow={flow} />
      </TabPanel>
      <TabPanel value={tabValue} index={1} classes={classes}>
        <RunDashboardPanel flow={flow} />
      </TabPanel>
      <TabPanel value={tabValue} index={2} classes={classes}>
        <AuditPanel flow={flow} />
      </TabPanel>
      {connectionDebugLogs &&
        Object.keys(connectionDebugLogs).map(
          (connectionId, cIndex) =>
            connectionDebugLogs[connectionId] && (
              <TabPanel
                value={tabValue}
                key={connectionId}
                index={cIndex + 3}
                classes={classes}>
                {connectionDebugLogs[connectionId]}
              </TabPanel>
            )
        )}
    </Drawer>
  );
}
