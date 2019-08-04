import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { func, string } from 'prop-types';
import classNames from 'classnames';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import CodePanel from '../GenericEditor/CodePanel';

const customTabsStyle = () => ({
  root: {
    borderBottom: '1px solid #e8e8e8',
  },
  indicator: {
    backgroundColor: '#1890ff',
  },
});
const CustomTabs = withStyles(customTabsStyle)(Tabs);
const CustomTab = withStyles({
  root: {
    textTransform: 'none',
    minWidth: 72,
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: 400,
    fontFamily: 'source sans pro',
    '&:hover': {
      color: '#40a9ff',
      opacity: 1,
    },
    '&$selected': {
      color: '#1890ff',
    },
    '&:focus': {
      color: '#40a9ff',
    },
  },
  selected: {},
})(props => <Tab disableRipple {...props} />);
const styles = () => ({
  content: {
    display: 'contents',
  },
  tabPanel: {
    height: '100%',
  },
  hide: {
    display: 'none',
  },
});

function TabPanel(props) {
  const { index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    />
  );
}

function customTabProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const SqlDataTabPanel = props => {
  const {
    sampleData,
    dataMode,
    defaultData,
    classes,
    handleDefaultDataChange,
    handleSampleDataChange,
  } = props;
  const [tabValue, setTabValue] = useState(0);

  function handleChange(event, newValue) {
    setTabValue(newValue);
  }

  return (
    <React.Fragment>
      <CustomTabs
        value={tabValue}
        onChange={handleChange}
        aria-label="simple tabs example">
        <CustomTab className="tab" label="Sample Data" {...customTabProps(0)} />
        <CustomTab
          className="tab"
          label="Default Data"
          {...customTabProps(1)}
        />
      </CustomTabs>
      <div className={classes.content}>
        <TabPanel
          className={classNames(
            classes.tabPanel,
            tabValue === 0 ? '' : classes.hide
          )}
          value={tabValue}
          index={0}>
          <CodePanel
            name="sampleData"
            value={sampleData}
            mode={dataMode}
            onChange={handleSampleDataChange}
          />
        </TabPanel>
        <TabPanel
          className={classNames(
            classes.tabPanel,
            tabValue === 1 ? '' : classes.hide
          )}
          value={tabValue}
          index={1}>
          <CodePanel
            name="defaultData"
            value={defaultData}
            mode={dataMode}
            onChange={handleDefaultDataChange}
          />
        </TabPanel>
      </div>
    </React.Fragment>
  );
};

SqlDataTabPanel.propTypes = {
  defaultData: string,
  sampleData: string,
  handleSampleDataChange: func.isRequired,
  handleDefaultDataChange: func.isRequired,
};

export default withStyles(styles)(SqlDataTabPanel);
