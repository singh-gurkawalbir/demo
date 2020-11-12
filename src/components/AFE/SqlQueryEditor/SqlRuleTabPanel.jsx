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
export default function SqlRuleTabPanel(props) {
  const {
    rule,
    ruleMode,
    defaultData,
    handleRuleChange,
    handleDataChange,
    showDefaultData,
    disabled,
    enableAutocomplete,
    error,
    ruleTitle,
    dataMode,
  } = props;
  const [tabValue, setTabValue] = useState('rule');

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
            label={ruleTitle}
            value="rule"
            id="tab-rule"
            className={clsx(classes.tabPanelTab, classes.resourceTab)}
            aria-controls="tabpanel-rule"
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
        </Tabs>
      </div>
      <div className={classes.content}>
        {tabValue === 'rule' && (
          <Typography
            component="div"
            role="tabpanel"
            id="tabpanel-rule"
            aria-labelledby="tab-rule"
            className={classes.tabPanel}>
            <CodePanel
              name="rule"
              value={rule}
              readOnly={disabled}
              mode={ruleMode}
              onChange={handleRuleChange}
              enableAutocomplete={enableAutocomplete}
              hasError={!!error}
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
                handleDataChange('defaultData', data);
              }}
            />
          </Typography>
        )}
      </div>
    </div>
  );
}

SqlRuleTabPanel.propTypes = {
  defaultData: string,
  rule: string,
  handleDataChange: func.isRequired,
};
