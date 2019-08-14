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
  },
  tabPanel: {
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
  } = props;
  const [tabValue, setTabValue] = useState('sample');

  function handleTabChange(event, newValue) {
    setTabValue(newValue);
  }

  return (
    <React.Fragment>
      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab
          label="Sample Data"
          value="sample"
          id="tab-sample"
          aria-controls="tabpanel-sample"
        />
        {showDefaultData && (
          <Tab
            label="Default Data"
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
              onChange={data => {
                handleChange('defaultData', data);
              }}
            />
          </Typography>
        )}
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
