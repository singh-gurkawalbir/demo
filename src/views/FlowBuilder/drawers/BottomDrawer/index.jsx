import clsx from 'clsx';
import { makeStyles, Drawer, IconButton, Tab, Tabs } from '@material-ui/core';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../actions';
import CodePanel from '../../../../components/AFE/GenericEditor/CodePanel';
import ArrowDownIcon from '../../../../components/icons/ArrowDownIcon';
import ArrowUpIcon from '../../../../components/icons/ArrowUpIcon';
import AuditLogIcon from '../../../../components/icons/AuditLogIcon';
import CloseIcon from '../../../../components/icons/CloseIcon';
import ConnectionsIcon from '../../../../components/icons/ConnectionsIcon';
import DebugIcon from '../../../../components/icons/DebugIcon';
import DashboardIcon from '../../../../components/icons/DashboardIcon';
import WarningIcon from '../../../../components/icons/WarningIcon';
import { selectors } from '../../../../reducers';
import ConnectionPanel from './panels/Connection';
import RunDashboardPanel from './panels/Dashboard/RunDashboardPanel';
import RunDashboardV2Panel from './panels/Dashboard/RunDashboardV2Panel';
import AuditPanel from './panels/Audit';
import RefreshIcon from '../../../../components/icons/RefreshIcon';
import IconTextButton from '../../../../components/IconTextButton';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import RunDashboardActions from './panels/Dashboard/RunDashboardActions';
import useBottomDrawer from './useBottomDrawer';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    marginLeft: theme.drawerWidthMinimized,
    padding: theme.spacing(0),
  },
  drawerPaperShift: {
    marginLeft: theme.drawerWidth,
  },
  drawerTransition: {
    transition: theme.transitions.create(['height', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    cursor: 'ns-resize',
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
  customTabContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  closeBtn: {
    padding: 0,
    marginLeft: theme.spacing(1),
  },
  connectionWarning: {
    color: theme.palette.error.main,
  },
  rightActionContainer: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    alignContent: 'center',
  },
  refreshButton: {
    marginRight: theme.spacing(1),
  },
}));
// we use this to prevent the up and down resize buttons from passing mouse-down events
// to the parent draggable re-sizeable tab bar. The combination of events disrupts UX.
const preventEvent = e => {
  // console.log('stop prop');
  e.stopPropagation();
};

function TabPanel({ children, value, index, classes }) {
  const hidden = value !== index;

  return (
    <div
      role="tabpanel"
      className={classes.tabPanel}
      hidden={hidden}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}>
      {!hidden && children}
    </div>
  );
}

const connectionsFilterConfig = {
  type: 'connections',
};

export default function BottomDrawer({
  flow,
  setTabValue,
  tabValue,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [drawerHeight, setDrawerHeight] = useBottomDrawer();
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
  const isAnyFlowConnectionOffline = useSelector(state =>
    selectors.isAnyFlowConnectionOffline(state, flow._id)
  );
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
  const connectionDebugLogs = useSelector(state => selectors.debugLogs(state));
  const connections = useSelectorMemo(
    selectors.makeResourceListSelector,
    connectionsFilterConfig
  ).resources;
  const connectionIdNameMap = useMemo(() => {
    const resourceIdNameMap = {};

    connections.forEach(r => { resourceIdNameMap[r._id] = r.name || r._id; });

    return resourceIdNameMap;
  }, [connections]);
  const [clearConnectionLogs, setClearConnectionLogs] = useState(true);
  const tempDrawerHeight = drawerHeight + (dragStart - dragY);
  const minDrawerHeight = 41;
  const maxHeight = window.innerHeight; // set maxStep to 4 to allow 100% drawer coverage.
  const stepSize = parseInt((maxHeight - minDrawerHeight) / 4, 10);

  const handleSizeUp = useCallback(() => {
    if (drawerHeight + stepSize >= maxHeight) return setDrawerHeight(minDrawerHeight);

    setDrawerHeight(drawerHeight + stepSize);
  },
  [maxHeight, setDrawerHeight, drawerHeight, stepSize]
  );

  const handleSizeDown = useCallback(() => {
    if (drawerHeight - stepSize < minDrawerHeight) return setDrawerHeight(maxHeight - stepSize);

    setDrawerHeight(drawerHeight - stepSize);
  },
  [maxHeight, setDrawerHeight, drawerHeight, stepSize]
  );

  const trackMouseY = useCallback(e => {
    if (e.movementY === 0) return; // skip x axis movement

    setDragY(e.clientY);
  }, []);

  const handleMouseDown = useCallback(e => {
    // console.log('dragging');
    setIsDragging(true);
    setDragStart(e.nativeEvent.clientY);
    setDragY(e.nativeEvent.clientY);

    window.addEventListener('mousemove', trackMouseY);
  }, [trackMouseY]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;

    // console.log('persist size: ', tempDrawerHeight);
    window.removeEventListener('mousemove', trackMouseY);

    setIsDragging(false);
    setDrawerHeight(tempDrawerHeight);
    setDragStart(0);
    setDragY(0);
  }, [tempDrawerHeight, isDragging, setDrawerHeight, trackMouseY]);

  const handleTabChange = useCallback(
    (event, newValue) => {
      setTabValue(newValue);

      if (drawerHeight < minDrawerHeight) setDrawerHeight(minDrawerHeight);
    },
    [setDrawerHeight, setTabValue, drawerHeight]
  );
  const handleDebugLogsClose = useCallback(
    connectionId => event => {
      event.stopPropagation();
      setTabValue(0);
      dispatch(actions.connection.clearDebugLogs(connectionId));
    },
    [dispatch, setTabValue]
  );
  const handleDebugLogsRefresh = useCallback(
    connectionId => event => {
      event.stopPropagation();
      dispatch(actions.connection.requestDebugLogs(connectionId));
    },
    [dispatch]
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

  useEffect(() =>
    // force removal of mousemove event listener on component unmount.
    () => window.removeEventListener('mousemove', trackMouseY),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);
  const tabProps = index => ({
    id: `tab-${index}`, 'aria-controls': `tabpanel-${index}`,
  });

  return (
    <Drawer
      open
      classes={{
        paper: clsx(classes.drawerPaper, {
          [classes.drawerPaperShift]: drawerOpened,
          [classes.noScroll]: drawerHeight === 0,
          [classes.drawerTransition]: !isDragging,
        }),
      }}
      PaperProps={{ style: { height: tempDrawerHeight } }}
      variant="persistent"
      anchor="bottom">
      <div
        className={classes.tabBar}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseUp}
        onMouseUp={handleMouseUp}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example">
          <Tab {...tabProps(0)} icon={<DashboardIcon />} label="Dashboard" />
          <Tab
            {...tabProps(1)}
            icon={
                isAnyFlowConnectionOffline ? (
                  <WarningIcon className={classes.connectionWarning} />
                ) : (
                  <ConnectionsIcon />
                )
              }
            label="Connections"
            />
          <Tab {...tabProps(2)} icon={<AuditLogIcon />} label="Audit log" />
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
                      label={(
                        <div className={classes.customTabContainer}>
                          {connectionIdNameMap[connectionId]} - DEBUG
                          <IconButton
                            className={classes.closeBtn}
                            onClick={handleDebugLogsClose(connectionId)}>
                            <CloseIcon />
                          </IconButton>
                        </div>
                      )}
                    />
                  )
              )}
        </Tabs>
        {
         isUserInErrMgtTwoDotZero && tabValue === 0 &&
         <RunDashboardActions flowId={flow._id} />
        }
        <div className={classes.actionsContainer}>
          <IconButton
            data-test="increaseFlowBuilderBottomDrawer"
            size="small"
            onMouseDown={preventEvent}
            onClick={handleSizeUp}>
            <ArrowUpIcon />
          </IconButton>
          <IconButton
            data-test="decreaseFlowBuilderBottomDrawer"
            size="small"
            onMouseDown={preventEvent}
            onClick={handleSizeDown}>
            <ArrowDownIcon />
          </IconButton>
        </div>
      </div>
      <>
        <TabPanel value={tabValue} index={0} classes={classes}>
          { isUserInErrMgtTwoDotZero
            ? <RunDashboardV2Panel flow={flow} />
            : <RunDashboardPanel flow={flow} />}
        </TabPanel>
        <TabPanel value={tabValue} index={1} classes={classes}>
          <ConnectionPanel flow={flow} />
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
                    <>
                      <div className={classes.rightActionContainer}>
                        <IconTextButton
                          className={classes.refreshButton}
                          onClick={handleDebugLogsRefresh(connectionId)}>
                          <RefreshIcon /> Refresh
                        </IconTextButton>
                      </div>
                      <CodePanel
                        name="code"
                        readOnly
                        value={connectionDebugLogs[connectionId]}
                        mode="javascript"
                        overrides={{ useWorker: false }}
                      />
                    </>
                  </TabPanel>
                )
            )}
      </>
    </Drawer>
  );
}
