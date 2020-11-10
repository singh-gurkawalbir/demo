import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { func, string } from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import CodePanel from '../GenericEditor/CodePanel';

const useStyles = makeStyles(theme => ({
  content: {
    display: 'inline',
    width: '100%',
    height: '100%',
  },
  tabPanel: {
    height: '100%',
  },
  tabPanelTab: {
    padding: 0,
    '& > span': {
      fontSize: 17,
      fontFamily: 'source sans pro',
    },
  },
  resourceTab: {
    flex: '1 1 auto',

  },
  dataWrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  tabsHeader: {
    background: theme.palette.common.white,
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
  },
}));
export default function SqlDataTabPanel(props) {
  const {
    sampleData,
    dataMode,
    defaultData,
    handleChange,
    showDefaultData,
    disabled,
  } = props;
  const [tabValue, setTabValue] = useState('sample');

  function handleTabChange(event, newValue) {
    setTabValue(newValue);
  }
  const classes = useStyles();

  return (
    <div className={classes.dataWrapper}>
      <div className={classes.tabsHeader}>
        <Tabs
          value={tabValue} onChange={handleTabChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary">
          <Tab
            label="Resources available for your handlebars template"
            value="sample"
            id="tab-sample"
            className={clsx(classes.tabPanelTab, classes.resourceTab)}
            aria-controls="tabpanel-sample"
        />
          {showDefaultData && (
          <Tab
            label="Defaults"
            value="default"
            textColorPrimary
            id="tab-default"
            className={classes.tabPanelTab}
            aria-controls="tabpanel-default"
          />
          )}
          <Tab
            label="Testing"
            value="testing"
            textColorPrimary
            id="tab-default"
            className={classes.tabPanelTab}
            aria-controls="tabpanel-default"
          />
          <Tab
            label="TestingNew"
            value="testingnew"
            textColorPrimary
            id="tab-default"
            className={classes.tabPanelTab}
            aria-controls="tabpanel-default"
          />
        </Tabs>
      </div>
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
            variant="body1"
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
}

SqlDataTabPanel.propTypes = {
  defaultData: string,
  sampleData: string,
  handleChange: func.isRequired,
};
