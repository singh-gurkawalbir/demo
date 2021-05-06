/* eslint-disable no-plusplus */
import clsx from 'clsx';
import { makeStyles, Drawer, IconButton, Tab, Tabs, useTheme } from '@material-ui/core';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import actions from '../../../../actions';
import ArrowDownIcon from '../../../../components/icons/ArrowDownIcon';
import ArrowUpIcon from '../../../../components/icons/ArrowUpIcon';
import AuditLogIcon from '../../../../components/icons/AuditLogIcon';
import CloseIcon from '../../../../components/icons/CloseIcon';
import ConnectionsIcon from '../../../../components/icons/ConnectionsIcon';
import DebugIcon from '../../../../components/icons/DebugIcon';
import DashboardIcon from '../../../../components/icons/DashboardIcon';
import RunHistoryIcon from '../../../../components/icons/ViewResolvedHistoryIcon';
import WarningIcon from '../../../../components/icons/WarningIcon';
import { selectors } from '../../../../reducers';
import ConnectionPanel from './panels/Connection';
import RunDashboardPanel from './panels/Dashboard/RunDashboardPanel';
import RunDashboardV2 from '../../../../components/JobDashboard/RunDashboardV2';
import RunHistory from '../../../../components/JobDashboard/RunHistory';
import AuditPanel from './panels/Audit';
import ScriptPanel from './panels/Script';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import RunDashboardActions from './panels/Dashboard/RunDashboardActions';
import useBottomDrawer from './useBottomDrawer';
import Spinner from '../../../../components/Spinner';
import ScriptLogs from '../../../ScriptLogs';
import ScriptsIcon from '../../../../components/icons/ScriptsIcon';
import ConnectionLogs from '../../../ConnectionLogs';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    marginLeft: theme.drawerWidthMinimized,
    padding: theme.spacing(0),
  },
  drawerPaperShift: {
    marginLeft: theme.drawerWidth,
    minHeight: 41,
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
    '& > * svg': {
      width: theme.spacing(2),
      height: theme.spacing(2),
      marginTop: -3,
    },
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
  inProgress: {
    marginLeft: theme.spacing(1),
  },
}));
// we use this to prevent the up and down resize buttons from passing mouse-down events
// to the parent draggable re-sizeable tab bar. The combination of events disrupts UX.
const preventEvent = e => {
  // console.log('stop prop');
  e.stopPropagation();
};
export const DRAGGABLE_SECTION_DIV_ID = 'draggableSectionDivId';

const TabTitleWithResourceName = ({resourceId, resourceType, postfix}) => {
  const resourceName = useSelector(state => {
    const resource = selectors.resource(state, resourceType, resourceId);

    return resource?.name || '';
  });

  return <span>{resourceName} {postfix}</span>;
};

function TabPanel({ children, value, index, className }) {
  const hidden = value !== index;

  return (
    <div
      role="tabpanel"
      className={className}
      hidden={hidden}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}>
      {!hidden && children}
    </div>
  );
}
export default function BottomDrawer({
  flowId,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [isDragging, setIsDragging] = useState(null);
  const [startY, setStartY] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [drawerHeight, setDrawerHeight] = useBottomDrawer();
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
  const {tabs, activeTabIndex} = useSelector(state => selectors.bottomDrawerTabs(state), shallowEqual);
  const isAnyFlowConnectionOffline = useSelectorMemo(selectors.mkIsAnyFlowConnectionOffline, flowId);
  const isFlowRunInProgress = useSelector(state =>
    !!selectors.getInProgressLatestJobs(state, flowId).length
  );
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
  const flowConnectionsWithLogEntry = useSelectorMemo(selectors.flowConnectionsWithLogEntry, flowId);
  const flowScripts = useSelectorMemo(selectors.mkGetScriptsTiedToFlow, flowId);
  const flowScriptsWithLogEntry = useSelector(state => selectors.flowExecutionLogScripts(state, flowId), shallowEqual);

  const minDrawerHeight = 41;
  const maxHeight = window.innerHeight - theme.appBarHeight - theme.pageBarHeight + 1; // border 1px
  const stepSize = parseInt((maxHeight - minDrawerHeight) / 4, 10);

  let tempDrawerHeight = drawerHeight + (startY - dragY);

  if (tempDrawerHeight > maxHeight) tempDrawerHeight = maxHeight;

  const handleSizeUp = useCallback(() => {
    if (drawerHeight + stepSize >= maxHeight) return setDrawerHeight(maxHeight);

    setDrawerHeight(drawerHeight + stepSize);
  },
  [maxHeight, setDrawerHeight, drawerHeight, stepSize]
  );

  const handleSizeDown = useCallback(() => {
    if (drawerHeight - stepSize < minDrawerHeight) return setDrawerHeight(minDrawerHeight);

    setDrawerHeight(drawerHeight - stepSize);
  },
  [setDrawerHeight, drawerHeight, stepSize]
  );

  const handleDragEnd = useCallback(() => setIsDragging(false), []);

  const trackMouseY = useCallback(e => {
    if (e.movementY === 0) return; // skip x axis movement

    setDragY(e.clientY);
  }, []);

  const handleMouseDown = useCallback(e => {
    if (e.target.id !== DRAGGABLE_SECTION_DIV_ID) {
      return;
    }
    setIsDragging(true);
    setStartY(e.nativeEvent.clientY);
    setDragY(e.nativeEvent.clientY);

    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('mousemove', trackMouseY);
  }, [trackMouseY, handleDragEnd]);

  const handleTabChange = useCallback(
    (event, newValue) => {
      dispatch(actions.bottomDrawer.setActiveTab({ index: newValue }));

      if (drawerHeight < minDrawerHeight) setDrawerHeight(minDrawerHeight);
    },
    [dispatch, drawerHeight, setDrawerHeight]
  );
  const handleScriptLogsClose = useCallback(
    scriptId => event => {
      event.stopPropagation();
      dispatch(actions.bottomDrawer.removeTab(({tabType: 'scriptLogs', resourceId: scriptId})));
      dispatch(actions.logs.scripts.clear({scriptId, flowId}));
    },
    [dispatch, flowId]
  );

  const handleDebugLogsClose = useCallback(
    connectionId => event => {
      event.stopPropagation();
      dispatch(actions.bottomDrawer.removeTab(({tabType: 'connectionLogs', resourceId: connectionId})));
      dispatch(actions.logs.connections.clear({connectionId}));
    },
    [dispatch]
  );

  useEffect(() =>
    () => {
      dispatch(actions.logs.scripts.clear({flowId}));
    },
  [dispatch, flowId]);

  useEffect(() =>
    () => {
      dispatch(actions.logs.connections.clear({clearAllLogs: true}));
    },
  [dispatch]);

  useEffect(() => {
    if (isDragging === false) {
      // console.log('drag end: ', tempDrawerHeight);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('mousemove', trackMouseY);

      setIsDragging(false);

      if (drawerHeight !== tempDrawerHeight) {
        setDrawerHeight(tempDrawerHeight);
      }
      setStartY(0);
      setDragY(0);
    }
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [isDragging]);

  const tabProps = index => ({
    'aria-controls': `tabpanel-${index}`,
  });

  const drawerClasses = useMemo(() => ({ paper: clsx(classes.drawerPaper, {
    [classes.drawerPaperShift]: drawerOpened,
    [classes.noScroll]: drawerHeight === 0,
    [classes.drawerTransition]: !isDragging,
  })}), [
    classes.drawerPaper,
    classes.drawerPaperShift,
    classes.drawerTransition,
    classes.noScroll,
    drawerHeight, drawerOpened, isDragging,
  ]);
  const drawerPaperProps = useMemo(() =>
    ({ style: { height: tempDrawerHeight } }),
  [tempDrawerHeight]);

  const dashboardLabel = useMemo(() => {
    if (isUserInErrMgtTwoDotZero) {
      return (
        <>
          Run console
          {
            isFlowRunInProgress &&
            <Spinner size="small" className={classes.inProgress} />
          }
        </>
      );
    }

    return 'Dashboard';
  }, [isUserInErrMgtTwoDotZero, classes.inProgress, isFlowRunInProgress]);
  let tabIndex = 0;
  let tabContentIndex = 0;

  useEffect(() => {
    dispatch(actions.bottomDrawer.init(flowId));
  }, [dispatch, flowId]);

  return (
    <div>
      <Drawer
        open
        classes={drawerClasses}
        PaperProps={drawerPaperProps}
        variant="persistent"
        anchor="bottom">
        <div
          className={classes.tabBar}
          id={DRAGGABLE_SECTION_DIV_ID}
          onMouseDown={handleMouseDown}>
          <Tabs
            value={activeTabIndex}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example">
            {tabs?.map(({label, tabType, resourceId}) => {
              switch (tabType) {
                case 'dashboard':
                  return (
                    <Tab
                      {...tabProps(tabIndex++)}
                      id={tabType}
                      key={tabType}
                      icon={<DashboardIcon />}
                      label={dashboardLabel} />
                  );
                case 'runHistory':
                  return (
                    <Tab
                      id={tabType}
                      key={tabType}
                      {...tabProps(tabIndex++)}
                      icon={<RunHistoryIcon />}
                      label={label} />
                  );
                case 'connections':
                  return (
                    <Tab
                      {...tabProps(tabIndex++)}
                      id={tabType}
                      key={tabType}
                      icon={
                        isAnyFlowConnectionOffline ? (
                          <WarningIcon className={classes.connectionWarning} />
                        ) : (
                          <ConnectionsIcon />
                        )
                      }
                      label={label}
                    />
                  );
                case 'scripts':
                  return (
                    <Tab
                      {...tabProps(tabIndex++)}
                      id={tabType}
                      key={tabType}
                      icon={<ScriptsIcon />}
                      label={label}
                      />
                  );
                case 'auditLogs':
                  return (
                    <Tab
                      {...tabProps(tabIndex++)}
                      id={tabType}
                      key={tabType}
                      icon={<AuditLogIcon />}
                      label={label}
                      />
                  );
                case 'scriptLogs':
                  return (
                    <Tab
                      className={classes.customTab}
                      key={`${tabType}-${resourceId}`}
                      id={`${tabType}-${resourceId}`}
                      {...tabProps(tabIndex++)}
                      icon={<AuditLogIcon />}
                      component="div"
                      label={(
                        <div className={classes.customTabContainer}>
                          <TabTitleWithResourceName
                            resourceId={resourceId}
                            resourceType="scripts"
                            postfix=" - Execution log"
                    />
                          <IconButton
                            className={classes.closeBtn}
                            onClick={handleScriptLogsClose(resourceId)}>
                            <CloseIcon />
                          </IconButton>
                        </div>
                      )}
                    />
                  );

                case 'connectionLogs':
                  return (
                    <Tab
                      className={classes.customTab}
                      key={`${tabType}-${resourceId}`}
                      // id={`connection-logs-${resourceId}`}
                      id={`${tabType}-${resourceId}`}
                      {...tabProps(tabIndex++)}
                      icon={<DebugIcon />}
                      component="div"
                      label={(
                        <div className={classes.customTabContainer}>
                          <TabTitleWithResourceName
                            resourceId={resourceId}
                            resourceType="connections"
                            postfix=" - DEBUG"
                          />
                          <IconButton
                            className={classes.closeBtn}
                            onClick={handleDebugLogsClose(resourceId)}>
                            <CloseIcon />
                          </IconButton>
                        </div>
                      )}
                    />
                  );
                default:
              }
            })}

          </Tabs>
          {
         isUserInErrMgtTwoDotZero && activeTabIndex === 0 &&
         <RunDashboardActions flowId={flowId} />
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
          <TabPanel value={activeTabIndex} index={tabContentIndex++} className={classes.tabPanel}>
            { isUserInErrMgtTwoDotZero
              ? <RunDashboardV2 flowId={flowId} />
              : <RunDashboardPanel flowId={flowId} />}
          </TabPanel>
          {
            isUserInErrMgtTwoDotZero &&
            (
              <TabPanel value={activeTabIndex} index={tabContentIndex++} className={classes.tabPanel}>
                <RunHistory flowId={flowId} />
              </TabPanel>
            )
          }
          <TabPanel value={activeTabIndex} index={tabContentIndex++} className={classes.tabPanel}>
            <ConnectionPanel flowId={flowId} />
          </TabPanel>
          {!!flowScripts?.length && (
            <TabPanel value={activeTabIndex} index={tabContentIndex++} className={classes.tabPanel}>
              <ScriptPanel flowId={flowId} />
            </TabPanel>
          )}

          <TabPanel value={activeTabIndex} index={tabContentIndex++} className={classes.tabPanel}>
            <AuditPanel flowId={flowId} />
          </TabPanel>
          {flowScriptsWithLogEntry.map(script => (
            <TabPanel key={script.scriptId} value={activeTabIndex} index={tabContentIndex++} className={classes.tabPanel}>
              <ScriptLogs flowId={flowId} scriptId={script.scriptId} />
            </TabPanel>
          ))}
          {flowConnectionsWithLogEntry?.map(
              connection =>
                (
                  <TabPanel
                    value={activeTabIndex}
                    key={connection._id}
                    index={tabContentIndex++}
                    className={classes.tabPanel}>
                    <>
                      <ConnectionLogs
                        connectionId={connection._id}
                        flowId={flowId}
                      />
                    </>
                  </TabPanel>
                )
            )}
        </>
      </Drawer>
    </div>
  );
}
