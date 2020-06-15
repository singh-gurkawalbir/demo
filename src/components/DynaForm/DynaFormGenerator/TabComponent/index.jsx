import FormContext from 'react-forms-processor/dist/components/FormContext';
import React, { useState, useCallback } from 'react';
import { Tabs, Tab, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import IntegrationSettingsSaveButton from '../../../ResourceFormFactory/Actions/IntegrationSettingsSaveButton';
import FormGenerator from '..';
import {
  getAllFormValuesAssociatedToMeta,
  isExpansionPanelErrored,
  isAnyFieldTouchedForMeta,
} from '../../../../forms/utils';

const useStyle = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  panelContainer: {
    flexGrow: 1,
    overflowY: 'auto',
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


const TabLabel = ({layout, fieldMap, label, tabType }) => (
  <FormContext.Consumer>
    {form => (
      tabType !== 'tabIA' && isExpansionPanelErrored({ layout, fieldMap }, form.fields) ? <Typography color="error">{label}</Typography> : label

    )}
  </FormContext.Consumer>
)

function TabComponent(props) {
  const { containers, fieldMap, children, type,
    ...rest } = props;
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
        {containers.map(({ label, ...layout }) => (
          <Tab
            classes={{ wrapper: classes.MuiTabWrapper }}
            label={<TabLabel
              layout={layout}
              fieldMap={fieldMap}
              label={label}
              tabType={type}

              />}
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

  return (
    <FormContext.Consumer>
      {form => (
        <>
          <FormGenerator {...props} />
          <IntegrationSettingsSaveButton
            {...rest}
            isValid={
              !isExpansionPanelErrored({ layout, fieldMap }, form.fields)
            }
            isFormTouchedForMeta={isAnyFieldTouchedForMeta(
              { layout, fieldMap },
              form.fields
            )}
            postProcessValuesFn={postProcessValuesFn}
          />
        </>
      )}
    </FormContext.Consumer>
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
    <>
      <FormGenerator {...props} />
      <IntegrationSettingsSaveButton {...props} />
    </>
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

export function TabComponentWithoutSaveVertical({ index, ...rest }) {
  return (
    <TabComponent
      {...rest}
      orientation="vertical"
      index={index === undefined ? 0 : index + 1}>
      <FormGenerator />
    </TabComponent>
  );
}
