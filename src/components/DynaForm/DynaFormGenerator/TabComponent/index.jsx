import { Tab, Tabs } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { Fragment, useCallback, useState } from 'react';
import FormGenerator from '..';
import {
  getAllFormValuesAssociatedToMeta,
  isAnyFieldTouchedForMeta,
  isExpansionPanelErrored,
} from '../../../../forms/utils';
import useFormContext from '../../../Form/FormContext';
import IntegrationSettingsSaveButton from '../../../ResourceFormFactory/Actions/IntegrationSettingsSaveButton';

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
  const {
    externalTabState,
    setExternalTabState,
    index,
    orientation = 'vertical',
  } = rest;
  const classes = useStyle();
  const [selectedTab, setSelectedTab] = useState(0);
  const selectedTabIndex =
    (externalTabState && (index === 0 && externalTabState.activeTab)) ||
    (index === 1 && externalTabState.tabHistory[externalTabState.activeTab]) ||
    selectedTab;

  return (
    <div className={orientation === 'vertical' ? classes.root : null}>
      <Tabs
        value={selectedTabIndex}
        classes={{ indicator: classes.MuiTabsIndicator }}
        className={classes.tabsContainer}
        variant="scrollable"
        orientation={orientation}
        indicatorColor="primary"
        textColor="primary"
        scrollButtons="auto"
        aria-label="Settings Actions"
        onChange={(evt, value) => {
          if (setExternalTabState) {
            return setExternalTabState(index, value);
          }

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
            {selectedTabIndex === index &&
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
  const form = useFormContext(props);

  return (
    <Fragment>
      <FormGenerator {...props} />
      <IntegrationSettingsSaveButton
        {...rest}
        isValid={
          !isExpansionPanelErrored(
            { layout, fieldMap },
            Object.values(form.fields)
          )
        }
        isFormTouchedForMeta={isAnyFieldTouchedForMeta(
          { layout, fieldMap },
          form.fields
        )}
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

function TabWithCompleteSave(props) {
  return (
    <Fragment>
      <FormGenerator {...props} />
      <IntegrationSettingsSaveButton {...props} />
    </Fragment>
  );
}

export function TabComponentSimple(props) {
  return (
    <TabComponent {...props}>
      <TabWithCompleteSave />
    </TabComponent>
  );
}

export function TabComponentWithoutSave({ index, ...rest }) {
  return (
    <TabComponent
      {...rest}
      orientation="horizontal"
      index={index === undefined ? 0 : index + 1}>
      <FormGenerator />
    </TabComponent>
  );
}
