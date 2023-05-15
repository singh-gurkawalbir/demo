import clsx from 'clsx';
import { Drawer, IconButton, useTheme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Spinner, TabContext, TabList, TabPanel, Tab, Box } from '@celigo/fuse-ui';
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
import RunningFlowsIcon from '../../../../components/icons/RunningFlowsIcon';
import RunHistoryIcon from '../../../../components/icons/CompletedFlowsIcon';
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
import ScriptLogs from '../../../ScriptLogs';
import ScriptsIcon from '../../../../components/icons/ScriptsIcon';
import ConnectionLogs from '../../../ConnectionLogs';
import OfflineConnectionsIcon from '../../../../components/icons/OfflineConnectionsIcon';

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
  noScroll: {
    overflowY: 'hidden',
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
export const DRAGGABLE_SECTION_DIV_ID = 'draggableSectionDivId';

const TabTitleWithResourceName = ({resourceId, resourceType, postfix}) => {
  const resourceName = useSelector(state => {
    const resource = selectors.resource(state, resourceType, resourceId);

    return resource?.name || '';
  });

  return <span>{resourceName} {postfix}</span>;
};

export default function BottomDrawer({
  flowId,
  integrationId,
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
  const isScriptTabShown = tabs?.find(a => a.tabType === 'scripts');
  const isAnyFlowConnectionOffline = useSelectorMemo(selectors.mkIsAnyFlowConnectionOffline, flowId);
  const isFlowRunInProgress = useSelector(state =>
    !!selectors.getInProgressLatestJobs(state, flowId).length
  );
  const flowScripts = useSelector(state =>
    selectors.getScriptsTiedToFlow(state, flowId)
  );

  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
  const defaultBottomDrawerTab = useSelector(
    state => selectors.filter(state, 'bottomDrawer')?.defaultTab
  );

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
      dispatch(actions.bottomDrawer.switchTab({ index: newValue }));

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
    if (defaultBottomDrawerTab && tabs?.length) {
      const defaultTabIndex = tabs?.findIndex(a => a.tabType === defaultBottomDrawerTab);

      dispatch(actions.bottomDrawer.setActiveTab({index: defaultTabIndex}));
      dispatch(actions.clearFilter('bottomDrawer'));
    }
  },
  [defaultBottomDrawerTab, dispatch, tabs]);

  useEffect(() => {
    if (isDragging === false) {
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
            <Spinner size="small" sx={{ml: 1}} />
          }
        </>
      );
    }

    return 'Dashboard';
  }, [isUserInErrMgtTwoDotZero, isFlowRunInProgress]);

  useEffect(() => {
    dispatch(actions.bottomDrawer.init(flowId));
  }, [dispatch, flowId]);

  useEffect(() => {
    if ((flowScripts?.length && !isScriptTabShown) || (!flowScripts?.length && isScriptTabShown)) {
      dispatch(actions.bottomDrawer.init(flowId));
    }
  }, [dispatch, flowId, flowScripts?.length, isScriptTabShown]);

  return (
    <div>
      <Drawer
        open
        classes={drawerClasses}
        PaperProps={drawerPaperProps}
        variant="persistent"
        BackdropProps={{ invisible: true }}
        anchor="bottom">
        <TabContext value={activeTabIndex}>
          <Box
            id={DRAGGABLE_SECTION_DIV_ID}
            onMouseDown={handleMouseDown}
            sx={theme => ({
              backgroundColor: theme.palette.background.paper,
              border: '1px solid',
              borderColor: theme.palette.secondary.lightest,
              borderTop: 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              cursor: 'ns-resize',
              '& .MuiTab-iconWrapper': {
                mr: `${theme.spacing(0.5)} !important`,
              },
            })}
          >
            <TabList
              onChange={handleTabChange}
              variant="scrollable"
              aria-label="scrollable auto tabs example"
            >
              {tabs?.map(({label, tabType, resourceId}, index) => {
                const tabProps = {};

                switch (tabType) {
                  case 'dashboard':
                    tabProps.icon = isUserInErrMgtTwoDotZero ? <RunningFlowsIcon /> : <DashboardIcon />;
                    tabProps.label = dashboardLabel;
                    break;

                  case 'runHistory':
                    tabProps.icon = <RunHistoryIcon />;
                    break;

                  case 'connections':
                    tabProps.icon = isAnyFlowConnectionOffline ? <OfflineConnectionsIcon /> : <ConnectionsIcon />;
                    break;

                  case 'scripts':
                    tabProps.icon = <ScriptsIcon />;
                    break;

                  case 'auditLogs':
                    tabProps.icon = <AuditLogIcon />;
                    break;

                  case 'scriptLogs':
                    tabProps.icon = <AuditLogIcon />;
                    tabProps.label = (
                      <Box>
                        <TabTitleWithResourceName
                          resourceId={resourceId}
                          resourceType="scripts"
                          postfix=" - Execution log"
                        />
                        <IconButton
                          sx={{ p: 0, ml: theme => theme.spacing(1) }}
                          onClick={handleScriptLogsClose(resourceId)}
                          size="large">
                          <CloseIcon
                            sx={theme => ({
                              width: theme.spacing(2),
                              height: theme.spacing(2),
                              mt: '-3px',
                            })} />
                        </IconButton>
                      </Box>
                    );
                    tabProps.sx = { maxWidth: 500 };
                    break;

                  case 'connectionLogs':
                    tabProps.icon = <DebugIcon />;
                    tabProps.label = (
                      <Box>
                        <TabTitleWithResourceName
                          resourceId={resourceId}
                          resourceType="connections"
                          postfix=" - DEBUG"
                      />
                        <IconButton
                          sx={{ p: 0, ml: theme => theme.spacing(1) }}
                          onClick={handleDebugLogsClose(resourceId)}
                          size="large">
                          <CloseIcon
                            sx={theme => ({
                              width: theme.spacing(2),
                              height: theme.spacing(2),
                              mt: '-3px',
                            })} />
                        </IconButton>
                      </Box>
                    );
                    tabProps.sx = { maxWidth: 500 };
                    break;

                  default: return;
                }

                return (
                  <Tab
                    key={tabType}
                    id={tabType}
                    data-test={tabType}
                    aria-controls={`tabpanel-${index}`}
                    label={label}
                    {...tabProps}
                   />
                );
              })}
            </TabList>

            { isUserInErrMgtTwoDotZero && activeTabIndex === 0 && <RunDashboardActions flowId={flowId} /> }

            <Box
              sx={{
                paddingRight: theme => theme.spacing(3),
                display: 'flex',
                justifyContent: 'center',
              }}
            >
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
            </Box>
          </Box>

          {tabs?.map(({ tabType, resourceId}, index) => {
            let tabPanelValue;

            switch (tabType) {
              case 'dashboard':
                tabPanelValue = isUserInErrMgtTwoDotZero
                  ? <RunDashboardV2 flowId={flowId} />
                  : <RunDashboardPanel flowId={flowId} />;
                break;

              case 'runHistory':
                tabPanelValue = isUserInErrMgtTwoDotZero ? <RunHistory flowId={flowId} integrationId={integrationId} /> : null;
                break;

              case 'connections':
                tabPanelValue = <ConnectionPanel flowId={flowId} />;
                break;
              case 'scripts':
                tabPanelValue = <ScriptPanel flowId={flowId} />;
                break;
              case 'auditLogs':
                tabPanelValue = <AuditPanel flowId={flowId} integrationId={integrationId} />;

                break;
              case 'scriptLogs':
                tabPanelValue = <ScriptLogs flowId={flowId} scriptId={resourceId} />;
                break;

              case 'connectionLogs':
                tabPanelValue = (
                  <ConnectionLogs
                    connectionId={resourceId}
                    flowId={flowId} />
                );
                break;

              default:
                break;
            }

            if (!tabPanelValue) { return null; }

            return (
              <TabPanel
                key={tabType}
                id={`tabpanel-${index}`}
                aria-labelledby={`tab-${index}`}
                value={index}
              >
                <Box sx={{ overflow: 'auto', height: '100%' }}>
                  {tabPanelValue}
                </Box>
              </TabPanel>
            );
          })}
        </TabContext>
      </Drawer>
    </div>
  );
}
