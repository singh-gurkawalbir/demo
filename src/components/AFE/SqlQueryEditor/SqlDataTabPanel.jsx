import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { func, string } from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import CodePanel from '../GenericEditor/CodePanel';

const styles = {
  content: {
    display: 'inline',
    width: '100%',
    height: '100%',
  },
  tabPanel: {
    height: '100%',
  },
  dataWrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
};
const SqlDataTabPanel = props => {
  const {
    sampleData,
    dataMode,
    defaultData,
    classes,
    handleChange,
    showDefaultData,
    disabled,
  } = props;
  const [tabValue, setTabValue] = useState('sample');

  function handleTabChange(event, newValue) {
    setTabValue(newValue);
  }

  return (
    <div className={classes.dataWrapper}>
      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab
          label="Sample data"
          value="sample"
          id="tab-sample"
          aria-controls="tabpanel-sample"
        />
        {showDefaultData && (
          <Tab
            label="Default data"
            value="default"
            id="tab-default"
            aria-controls="tabpanel-default"
          />
        )}
      </Tabs>
      <div className={classes.content}>
        {tabValue === 'sample' && (
          <Typography
            component="div"
            role="tabpanel"
            id="tabpanel-sample"
            aria-labelledby="tab-sample"
            className={classes.tabPanel}>
            <CodePanel
              name="sampleData"
              value={sampleData}
              mode={dataMode}
              readOnly={disabled}
              onChange={data => {
                handleChange('sampleData', data);
              }}
            />
          </Typography>
        )}
        {tabValue === 'default' && showDefaultData && (
          <Typography
            component="div"
            role="tabpanel"
            id="tabpanel-default"
            aria-labelledby="tab-default"
            className={classes.tabPanel}>
            <CodePanel
              name="defaultData"
              value={defaultData}
              mode={dataMode}
              readOnly={disabled}
              onChange={data => {
                handleChange('defaultData', data);
              }}
            />
          </Typography>
        )}
      </div>
    </div>
  );
};

SqlDataTabPanel.propTypes = {
  defaultData: string,
  sampleData: string,
  handleChange: func.isRequired,
};

export default withStyles(styles)(SqlDataTabPanel);
