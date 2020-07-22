import { Tab, Tabs, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { useCallback, useEffect, useState } from 'react';
import FormContext from 'react-forms-processor/dist/components/FormContext';
import { useSelector } from 'react-redux';
import FormGenerator from '..';
import * as selectors from '../../../../reducers';
import IntegrationSettingsSaveButton from '../../../ResourceFormFactory/Actions/IntegrationSettingsSaveButton';
import SuiteScriptSaveButton from '../../../SuiteScript/ResourceFormFactory/Actions/SuiteScriptIASettingsSaveButton';
import { getAllFormValuesAssociatedToMeta } from '../../../../forms/utils';


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
    background: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    marginBottom: theme.spacing(1),

  },
  MuiTabWrapper: {
    justifyContent: 'left',
  },
  MuiTabsIndicator: {
    right: 'unset',
  },
}));


const TabLabel = ({layout, formKey, fieldMap, label, tabType }) => {
  const isExpansionPanelErrored = useSelector(state =>
    selectors.isExpansionPanelErroredForMetaForm(state, formKey, {
      layout,
      fieldMap,
    })
  );

  return (tabType !== 'tabIA' && isExpansionPanelErrored ? <Typography color="error" style={{fontSize: 15, lineHeight: '19px' }}>{label}</Typography> : label);
};

function TabComponent(props) {
  const { containers, fieldMap, children, type, className,
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
        className={clsx(classes.tabsContainer, className)}
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
  const { layout, fieldMap, children, classes, ...rest } = props;
  const postProcessValuesFn = useCallback(
    values => getAllFormValuesAssociatedToMeta(values, { layout, fieldMap }),
    [fieldMap, layout]
  );
  const { formKey } = rest;
  const isExpansionPanelErrored = useSelector(state =>
    selectors.isExpansionPanelErroredForMetaForm(state, formKey, {
      layout,
      fieldMap,
    })
  );
  const isAnyFieldTouchedForMeta = useSelector(state =>
    selectors.isAnyFieldTouchedForMetaForm(state, formKey, {
      layout,
      fieldMap,
    })
  );

  return (
    <>
      <FormGenerator {...props} />
      {React.cloneElement(children, {
        ...rest,
        isValid: !isExpansionPanelErrored,
        isFormTouchedForMeta: isAnyFieldTouchedForMeta,
        postProcessValuesFn

      })}

    </>
  );
}

export function TabIAComponent(props) {
  return (
    <TabComponent {...props}>
      <FormWithSave >
        <IntegrationSettingsSaveButton />
      </FormWithSave>
    </TabComponent>
  );
}


const InitializeFieldStateHook = ({ fieldMap, registerField}) => {
  useEffect(() => {
    Object.values(fieldMap).forEach((field) => {
      registerField(field);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return null;
};

function InitializeAllFieldState({children, fieldMap}) {
  return (
    <FormContext.Consumer>
      {form => (
        <>
          <InitializeFieldStateHook registerField={form.registerField} fieldMap={fieldMap} />
          {children}
        </>
      )}
    </FormContext.Consumer>);
}
// this is necessary when we clone props we want all of its children to receive them
function SuiteScriptWithCompleteSave(props) {
  return (
    <>
      <FormGenerator {...props} />
      <SuiteScriptSaveButton {...props} />
    </>
  );
}

export function SuiteScriptTabIACompleteSave(props) {
  return (
    <InitializeAllFieldState fieldMap={props.fieldMap}>

      <TabComponent
        {...props}
        orientation="horizontal"
    >
        <SuiteScriptWithCompleteSave />
      </TabComponent>
    </InitializeAllFieldState>
  );
}
// this is necessary when we clone props we want all of its children to receive them
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
    <InitializeAllFieldState fieldMap={props.fieldMap}>
      <TabComponent {...props}>
        <TabWithCompleteSave />
      </TabComponent>
    </InitializeAllFieldState>

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
