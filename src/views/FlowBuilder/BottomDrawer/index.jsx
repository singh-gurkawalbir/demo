import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Drawer, IconButton, Tabs, Tab, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import ArrowUpIcon from '../../../components/icons/ArrowUpIcon';
import ArrowDownIcon from '../../../components/icons/ArrowDownIcon';
import * as selectors from '../../../reducers';
import ConnectionPanel from './panels/Connection';
import RunDashboardPanel from './panels/RunDashboard';
import AuditPanel from './panels/Audit';

const useStyles = makeStyles(theme => ({
  drawer: {
    // none needed so far.
  },
  drawerPaper: {
    marginLeft: theme.drawerWidthMinimized,
    padding: theme.spacing(1),
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
  tabBar: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  tabRoot: {
    flexGrow: 1,
  },
  noScroll: {
    overflowY: 'hidden',
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}>
      <Box p={3}>{children}</Box>
    </div>
  );
}

export default function BottomDrawer({ size, setSize, flow }) {
  const classes = useStyles();
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
  const [tabValue, setTabValue] = useState(0);

  function a11yProps(index) {
    return {
      id: `tab-${index}`,
      'aria-controls': `tabpanel-${index}`,
    };
  }

  // set maxStep to 4 to allow 100% drawer coverage.
  const maxStep = 3;
  const handleSizeChange = direction => () => {
    if (size === maxStep && direction === 1) return setSize(0);

    if (size === 0 && direction === -1) return setSize(maxStep);

    setSize(size + direction);
  };

  function handleTabChange(event, newValue) {
    setTabValue(newValue);

    if (size === 0) setSize(1);
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
          className={classes.tabRoot}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example">
          <Tab label="Connections" {...a11yProps(0)} />
          <Tab label="Run Dashboard" {...a11yProps(1)} />
          <Tab label="Audit Log" {...a11yProps(2)} />
        </Tabs>
        <IconButton
          data-test="increaseFlowBuilderBottomDrawer"
          onClick={handleSizeChange(1)}>
          <ArrowUpIcon />
        </IconButton>
        <IconButton
          data-test="decreaseFlowBuilderBottomDrawer"
          onClick={handleSizeChange(-1)}>
          <ArrowDownIcon />
        </IconButton>
      </div>

      <TabPanel value={tabValue} index={0}>
        <ConnectionPanel flow={flow} />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <RunDashboardPanel />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <AuditPanel flow={flow} />
      </TabPanel>
    </Drawer>
  );
}
