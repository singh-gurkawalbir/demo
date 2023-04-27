import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Drawer, IconButton, Tabs, Tab } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import ArrowUpIcon from '../../../../../components/icons/ArrowUpIcon';
import ArrowDownIcon from '../../../../../components/icons/ArrowDownIcon';
import ConnectionsIcon from '../../../../../components/icons/ConnectionsIcon';
import WarningIcon from '../../../../../components/icons/WarningIcon';
import RunIcon from '../../../../../components/icons/RunIcon';
import { selectors } from '../../../../../reducers';
import ConnectionPanel from './panels/Connection';
import RunDashboardPanel from './panels/RunDashboard';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';

const useStyles = makeStyles(theme => ({
  drawer: {
    // none needed so far.
  },
  drawerPaper: {
    marginLeft: theme.drawerWidthMinimized,
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
    display: 'flex',
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

export default function BottomDrawer({
  ssLinkedConnectionId,
  size,
  setSize,
  flowId,
  setTabValue,
  tabValue,
  _flowId, /* Scenario Id on the flow record in NS */
}) {
  const classes = useStyles();
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
  const isAnyFlowConnectionOffline = useSelectorMemo(selectors.mkIsAnyFlowConnectionOffline, flowId);
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
  const tabProps = useCallback(
    index => ({
      id: `tab-${index}`,
      'aria-controls': `tabpanel-${index}`,
    }),
    []
  );

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
          <Tab {...tabProps(1)} icon={<RunIcon />} label="Run dashboard" />
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

      <>
        <TabPanel value={tabValue} index={0} classes={classes}>
          <ConnectionPanel
            ssLinkedConnectionId={ssLinkedConnectionId}
            flowId={flowId}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={1} classes={classes}>
          <RunDashboardPanel
            ssLinkedConnectionId={ssLinkedConnectionId}
            flowId={_flowId}
          />
        </TabPanel>
      </>
    </Drawer>
  );
}
