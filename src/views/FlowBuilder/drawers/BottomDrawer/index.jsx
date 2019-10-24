import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Drawer, IconButton, Tabs, Tab } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import ArrowUpIcon from '../../../../components/icons/ArrowUpIcon';
import ArrowDownIcon from '../../../../components/icons/ArrowDownIcon';
import ConnectionsIcon from '../../../../components/icons/ConnectionsIcon';
import AuditLogIcon from '../../../../components/icons/AuditLogIcon';
import RunIcon from '../../../../components/icons/RunIcon';
import * as selectors from '../../../../reducers';
import ConnectionPanel from './panels/Connection';
import RunDashboardPanel from './panels/RunDashboard';
import AuditPanel from './panels/Audit';

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
  muiTabsRoot: {
    minHeight: 36,
    paddingLeft: theme.spacing(2),
  },
  muiTabRoot: {
    minHeight: 36,
  },
  muiTabWrapper: {
    flexDirection: 'row',
    '& > *:first-child': {
      marginBottom: '0 !important',
      marginRight: theme.spacing(1),
    },
  },
  actionsContainer: {
    paddingRight: theme.spacing(3),
    justifyContent: 'center',
  },
  tabBar: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  tabRoot: {
    flexGrow: 1,
  },
  tabPanel: {
    overflow: 'auto',
    height: '100%',
  },
  noScroll: {
    overflowY: 'hidden',
  },
}));

function TabPanel({ children, value, index, classes, ...props }) {
  return (
    <div
      role="tabpanel"
      className={classes.tabPanel}
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...props}>
      <div>{children}</div>
    </div>
  );
}

export default function BottomDrawer({ size, setSize, flow }) {
  const classes = useStyles();
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
  const [tabValue, setTabValue] = useState(0);
  const maxStep = 3; // set maxStep to 4 to allow 100% drawer coverage.

  function handleSizeChange(direction) {
    if (size === maxStep && direction === 1) return setSize(0);

    if (size === 0 && direction === -1) return setSize(maxStep);

    setSize(size + direction);
  }

  function handleTabChange(event, newValue) {
    setTabValue(newValue);

    if (size === 0) setSize(1);
  }

  function tabProps(index) {
    return {
      classes: {
        root: classes.muiTabRoot,
        wrapper: classes.muiTabWrapper,
      },
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
      PaperProps={{ style: { height: size ? `${size * 25}%` : '64px' } }}
      variant="persistent"
      anchor="bottom">
      <div className={classes.tabBar}>
        <Tabs
          value={tabValue}
          classes={{ root: classes.muiTabsRoot }}
          className={classes.tabRoot}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example">
          <Tab
            {...tabProps(0)}
            icon={<ConnectionsIcon />}
            label="Connections"
          />
          <Tab {...tabProps(1)} icon={<RunIcon />} label="Run Dashboard" />
          <Tab {...tabProps(2)} icon={<AuditLogIcon />} label="Audit Log" />
        </Tabs>
        <div className={classes.actionsContainer}>
          <IconButton
            data-test="increaseFlowBuilderBottomDrawer"
            size="small"
            onClick={() => handleSizeChange(1)}>
            <ArrowUpIcon />
          </IconButton>
          <IconButton
            data-test="decreaseFlowBuilderBottomDrawer"
            size="small"
            onClick={() => handleSizeChange(-1)}>
            <ArrowDownIcon />
          </IconButton>
        </div>
      </div>

      <TabPanel value={tabValue} index={0} size={size} classes={classes}>
        <ConnectionPanel flow={flow} />
      </TabPanel>
      <TabPanel value={tabValue} index={1} size={size} classes={classes}>
        <RunDashboardPanel flow={flow} />
      </TabPanel>
      <TabPanel value={tabValue} index={2} size={size} classes={classes}>
        <AuditPanel flow={flow} />
      </TabPanel>
    </Drawer>
  );
}
