import React, { useState, Fragment, useCallback } from 'react';
import { Tabs, Tab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import IntegrationSettingsSaveButton from '../../../ResourceFormFactory/Actions/IntegrationSettingsSaveButton';
import FormGenerator from '..';
import { getAllFormValuesAssociatedToMeta } from '../../../../forms/utils';

const useStyle = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  panelContainer: {
    flexGrow: 1,
  },
  tabsContainer: {
    minWidth: 150,
    background: theme.palette.background.default,
    marginRight: theme.spacing(2),
  },
  MuiTabWrapper: {
    justifyContent: 'left',
  },
  MuiTabsIndicator: {
    right: 'unset',
  },
}));

function TabComponent(props) {
  const { containers, fieldMap, children, ...rest } = props;
  const classes = useStyle();
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className={classes.root}>
      <Tabs
        value={selectedTab}
        classes={{ indicator: classes.MuiTabsIndicator }}
        className={classes.tabsContainer}
        variant="scrollable"
        orientation="vertical"
        indicatorColor="primary"
        textColor="primary"
        scrollButtons="auto"
        aria-label="Settings Actions"
        onChange={(evt, value) => {
          setSelectedTab(value);
        }}>
        {containers.map(({ label }) => (
          <Tab
            classes={{ wrapper: classes.MuiTabWrapper }}
            label={label}
            key={label}
            data-test={label}
          />
        ))}
      </Tabs>
      <div className={classes.panelContainer}>
        {containers.map(({ label, ...layout }, index) => (
          <div key={label}>
            {selectedTab === index &&
              React.cloneElement(children, { ...rest, layout, fieldMap })}
          </div>
        ))}
      </div>
    </div>
  );
}

function FormWithSave(props) {
  const { layout, fieldMap, ...rest } = props;
  const postProcessValuesFn = useCallback(
    values => getAllFormValuesAssociatedToMeta(values, { layout, fieldMap }),
    [fieldMap, layout]
  );

  return (
    <Fragment>
      <FormGenerator {...props} />
      <IntegrationSettingsSaveButton
        {...rest}
        postProcessValuesFn={postProcessValuesFn}
      />
    </Fragment>
  );
}

export function TabIAComponent(props) {
  return (
    <TabComponent {...props}>
      <FormWithSave />
    </TabComponent>
  );
}

export function TabComponentSimple(props) {
  return (
    <TabComponent {...props}>
      <FormGenerator />
    </TabComponent>
  );
}
