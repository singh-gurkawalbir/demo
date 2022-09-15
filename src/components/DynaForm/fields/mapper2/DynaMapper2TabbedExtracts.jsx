import React, { useState, useCallback, useMemo } from 'react';
import { makeStyles, Tabs, Tab, Divider } from '@material-ui/core';
import isEmpty from 'lodash/isEmpty';
import mappingUtil, {ARRAY_DATA_TYPES, getUniqueExtractId, findMatchingExtract} from '../../../../utils/mapping';
import useFormContext from '../../../Form/FormContext';
import DynaForm from '../..';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import {useUpdateParentForm} from '../DynaCsvGenerate_afe';
import useSetSubFormShowValidations from '../../../../hooks/useSetSubFormShowValidations';

const useStyles = makeStyles(theme => ({
  panelContainer: {
    marginTop: theme.spacing(2),
  },
  divider: {
    margin: theme.spacing(1, 0),
  },
}));

function generateTabsForSettings(sourceField) {
  const tabs = [];

  if (sourceField) {
    const splitExtracts = sourceField.split(',');

    splitExtracts.forEach((extract, index) => {
      if (!extract) return;

      tabs.push({
        id: getUniqueExtractId(extract, index),
        label: extract,
      });
    });
  }

  return tabs;
}

function getSubFormMetadata(value, formKey, dataType) {
  return {
    fieldMap: {
      sourceDataType: {
        // todo Kiran: it should update automatically when value is selected from dropdown
        id: 'sourceDataType',
        name: 'sourceDataType',
        type: 'select',
        skipSort: true,
        skipDefault: true,
        label: 'Source data type',
        defaultValue: findMatchingExtract(value, formKey).sourceDataType || 'string',
        helpKey: 'mapping.v2.sourceDataType',
        noApi: true,
        options: [
          {
            items: [
              { label: 'string', value: 'string' },
              { label: 'number', value: 'number' },
              { label: 'boolean', value: 'boolean' },
              { label: 'object', value: 'object' },
              { label: '[string]', value: 'stringarray' },
              { label: '[number]', value: 'numberarray' },
              { label: '[boolean]', value: 'booleanarray' },
              { label: '[object]', value: 'objectarray' },
            ],
          },
        ],
      },
      standardAction: {
        id: 'standardAction',
        name: 'standardAction',
        type: 'select',
        skipDefault: true,
        defaultValue: mappingUtil.getV2DefaultActionValue(findMatchingExtract(value, formKey)) || 'discardIfEmpty',
        label: 'Action to take if source field has no value',
        helpKey: 'mapping.v2.standardAction',
        noApi: true,
        visible: dataType !== 'objectarray',
        options: [
          {
            items: [
              { label: 'Do nothing', value: 'discardIfEmpty' },
              { label: 'Use null as default value', value: 'useNull' },
              { label: 'Use custom default value', value: 'default' },
              {
                label: 'Use empty value as default value',
                value: 'useEmptyString',
              },
            ],
          },
        ],
      },
      default: {
        id: 'default',
        name: 'default',
        type: 'text',
        label: 'Custom value',
        placeholder: 'Custom value',
        required: true,
        visibleWhenAll: [
          { field: 'standardAction', is: ['default'] },
        ],
        helpKey: 'mapping.v2.default',
        noApi: true,
        defaultValue: findMatchingExtract(value, formKey).default,
      },
      copySource: {
        id: 'copySource',
        name: 'copySource',
        type: 'radiogroup',
        label: 'Copy an object array from the source as-is?',
        helpKey: 'mapping.v2.copyObjectArray',
        fullWidth: true,
        defaultValue: findMatchingExtract(value, formKey).copySource || 'no',
        noApi: true,
        visible: dataType === 'objectarray',
        options: [
          {
            items: [
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ],
          },
        ],
      },
      objectAction: {
        id: 'objectAction',
        name: 'objectAction',
        type: 'select',
        skipDefault: true,
        defaultValue: mappingUtil.getV2DefaultActionValue(findMatchingExtract(value, formKey)) || 'discardIfEmpty',
        refreshOptionsOnChangesTo: ['dataType'],
        label: 'Action to take if source field has no value',
        helpKey: 'mapping.v2.objectAction',
        noApi: true,
        visibleWhenAll: [
          { field: 'copySource', is: ['yes'] },
        ],
        options: [
          {
            items: [
              { label: 'Do nothing', value: 'discardIfEmpty' },
              { label: 'Use null as default value', value: 'useNull' },
            ],
          },
        ],
      },
    },
    layout: {
      containers: [
        {
          fields: [
            'sourceDataType',
            'copySource',
          ],
        },
        {
          type: 'indent',
          containers: [
            {
              fields: [
                'objectAction',
                'standardAction',
                'default',
              ],
            },
          ],
        },
      ],
    },
  };
}

const SUB_FORM_KEY = 'extractsArrayKey';

function constructExtractsArray(formKey, newOptions, currArray, dataType) {
  let toReturn = [];

  // no source selected
  if (formKey === SUB_FORM_KEY) {
    return toReturn;
  }

  const newExtractObj = {
    extract: formKey,
    sourceDataType: newOptions.sourceDataType,
    copySource: dataType === 'objectarray' ? newOptions.copySource : undefined,
    conditional: {when: 'extract_not_empty'},
  };

  if (dataType === 'objectarray' && newOptions.copySource === 'yes') {
    switch (newOptions.objectAction) {
      case 'useNull':
        newExtractObj.default = null;
        delete newExtractObj.conditional;
        break;
      default:
    }
  } else {
    switch (newOptions.standardAction) {
      case 'useEmptyString':
        newExtractObj.default = '';
        delete newExtractObj.conditional;
        break;
      case 'useNull':
        newExtractObj.default = null;
        delete newExtractObj.conditional;
        break;
      case 'default':
        newExtractObj.default = newOptions.default;
        delete newExtractObj.conditional;
        break;
      default:
    }
  }

  let found = false;

  // find existing source if present and replace with the new values
  toReturn = currArray?.map(c => {
    if (c.extract === formKey) {
      found = true;

      return newExtractObj;
    }

    return c;
  }) || [];

  // if source was not present before, add it to array
  if (!found) {
    toReturn.push(newExtractObj);
  }

  return toReturn;
}

function EachTabContainer({id, value, parentFormKey, formKey, dataType, isCurrentTab, onFieldChange}) {
  const handleFormChange = useCallback(
    (newOptions, isValid, touched) => {
      const extractsArrayHelper = constructExtractsArray(formKey, newOptions, value, dataType);

      onFieldChange(id, extractsArrayHelper, touched);
    }, [formKey, id, onFieldChange, value, dataType]);

  useUpdateParentForm(formKey, handleFormChange);
  useSetSubFormShowValidations(parentFormKey, formKey);
  const formKeyComponent = useFormInitWithPermissions({
    formKey,
    fieldMeta: getSubFormMetadata(value, formKey, dataType),
  });

  if (!isCurrentTab) return null;

  return <DynaForm formKey={formKeyComponent} />;
}

export default function DynaMapper2TabbedExtracts(props) {
  const { formKey: parentFormKey} = props;
  const classes = useStyles();
  const [selectedTab, setSelectedTab] = useState(0);
  const {fields} = useFormContext(parentFormKey);

  const sourceField = fields.sourceField?.value;
  const dataType = fields.dataType?.value;
  const isStandardMapping = fields.fieldMappingType?.value === 'standard';

  const tabs = useMemo(() => generateTabsForSettings(sourceField), [sourceField]);

  // for primitive arrays only standard mapping will have tabs
  if ((dataType !== 'objectarray' && ARRAY_DATA_TYPES.includes(dataType) && !isStandardMapping)) {
    return null;
  }

  return (
    <div>
      {isEmpty(tabs) || tabs.length === 1
        ? (
          <EachTabContainer
            {...props}
            formKey={tabs?.[0]?.id || SUB_FORM_KEY}
            parentFormKey={parentFormKey}
            dataType={dataType}
            isCurrentTab
        />
        )
        : (
          <>
            <Tabs
              className={classes.tabsContainer}
              value={selectedTab}
              onChange={(evt, value) => {
                setSelectedTab(value);
              }}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto" >
              {tabs.map(({ id, label }) => (
                <Tab
                  className={classes.tab}
                  key={id}
                  label={label}
            />
              ))}
            </Tabs>
            <div className={classes.panelContainer}>
              {tabs.map(({ id }, index) => (
                <EachTabContainer
                  key={id}
                  {...props}
                  formKey={id}
                  parentFormKey={parentFormKey}
                  dataType={dataType}
                  isCurrentTab={selectedTab === index}
                />

              ))}
            </div>
          </>
        )}

      <Divider className={classes.divider} />
    </div>
  );
}
