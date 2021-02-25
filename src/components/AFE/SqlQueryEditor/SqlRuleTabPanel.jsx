import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { func, string } from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import CodePanel from '../GenericEditor/CodePanel';
import { selectors } from '../../../reducers';

const useStyles = makeStyles(theme => ({
  content: {
    display: 'inline',
    width: '100%',
    height: '100%',
  },
  tabPanel: {
    height: '100%',
  },
  ruleWrap: {
    whiteSpace: 'nowrap',
  },
  tabPanelTab: {
    padding: theme.spacing(1),
    '& > span': {
      fontSize: 17,
      fontFamily: 'source sans pro',
      fontWeight: 'normal',
      color: theme.palette.text.secondary,
      justifyContent: 'flex-start',
      lineHeight: 1,
    },
  },
  defaultsTab: {
    '& > span': {
      justifyContent: 'center',
    },
  },
  resourceTab: {
    flex: '1 1',
  },
  dataWrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  // TODO: @azhar add the color in common file
  tabsHeader: {
    background: theme.palette.common.white,
    borderBottom: 'solid 1px rgb(0,0,0,0.3)',
  },
  customTabIndicator: {
    backgroundColor: 'transparent',
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
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));

  function handleTabChange(event, newValue) {
    setTabValue(newValue);
  }
  const classes = useStyles();

  return (
    <div className={classes.dataWrapper}>
      <div
        className={classes.tabsHeader}>
        <Tabs
          value={tabValue} onChange={handleTabChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          classes={{
            indicator: clsx({[classes.customTabIndicator]: !showDefaultData}),
          }}
          >
          <Tab
            label={ruleTitle}
            value="rule"
            id="tab-rule"
            className={clsx(classes.tabPanelTab, classes.resourceTab, {[classes.ruleWrap]: drawerOpened})}
            aria-controls="tabpanel-rule"
        />
          {showDefaultData && (
          <Tab
            label="Defaults"
            value="default"
            textColorPrimary
            id="tab-default"
            className={clsx(classes.tabPanelTab, classes.defaultsTab)}
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
