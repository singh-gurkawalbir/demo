import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  Drawer,
  IconButton,
  Tabs,
  Tab,
  Typography,
  Box,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import SizeIcon from '@material-ui/icons/FormatSizeOutlined';
import clsx from 'clsx';
import * as selectors from '../../../reducers';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}>
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const useStyles = makeStyles(theme => ({
  drawer: {
    // none needed so far.
  },
  drawerPaper: {
    marginLeft: 57,
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
    // flexGrow: 1,
    flexDirection: 'row',
    width: '100%',
    // backgroundColor: theme.palette.background.paper,
  },
  tabRoot: {
    flexGrow: 1,
  },
  noScroll: {
    overflowY: 'hidden',
  },
}));

export default function BottomDrawer({ defaultSize = 1 }) {
  const classes = useStyles();
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
  const [size, setSize] = useState(defaultSize);
  const [tabValue, setTabValue] = useState(0);

  function a11yProps(index) {
    return {
      id: `scrollable-auto-tab-${index}`,
      'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
  }

  function handleSizeChange() {
    if (size === 3) return setSize(0);
    setSize(size + 1);
  }

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
          <Tab label="Item One" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
          <Tab label="Item Four" {...a11yProps(3)} />
          <Tab label="Item Five" {...a11yProps(4)} />
          <Tab label="Item Six" {...a11yProps(5)} />
          <Tab label="Item Seven" {...a11yProps(6)} />
        </Tabs>
        <IconButton onClick={handleSizeChange}>
          <SizeIcon />
        </IconButton>
      </div>

      <TabPanel value={tabValue} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        Item Three
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        Item Four
      </TabPanel>
      <TabPanel value={tabValue} index={4}>
        Item Five
      </TabPanel>
      <TabPanel value={tabValue} index={5}>
        Item Six
      </TabPanel>
      <TabPanel value={tabValue} index={6}>
        Item Seven
      </TabPanel>
    </Drawer>
  );
}
