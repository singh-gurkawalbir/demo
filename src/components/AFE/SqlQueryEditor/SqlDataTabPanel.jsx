import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { func, string } from 'prop-types';
import classNames from 'classnames';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import CodePanel from '../GenericEditor/CodePanel';

const styles = {
  content: {
    display: 'inline',
  },
  tabPanel: {
    height: '100%',
  },
  hide: {
    display: 'none',
  },
};

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
  const { sampleData, dataMode, defaultData, classes, handleChange } = props;
  const [tabValue, setTabValue] = useState(0);

  function handleTabChange(event, newValue) {
    setTabValue(newValue);
  }

  return (
    <React.Fragment>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="simple tabs example">
        <Tab
          className={classes.tab}
          label="Sample Data"
          {...customTabProps(0)}
        />
        <Tab className="tab" label="Default Data" {...customTabProps(1)} />
      </Tabs>
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
            onChange={data => {
              handleChange('sampleData', data);
            }}
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
            onChange={data => {
              handleChange('defaultData', data);
            }}
          />
        </TabPanel>
      </div>
    </React.Fragment>
  );
};

SqlDataTabPanel.propTypes = {
  defaultData: string,
  sampleData: string,
  handleChange: func.isRequired,
};

export default withStyles(styles)(SqlDataTabPanel);
