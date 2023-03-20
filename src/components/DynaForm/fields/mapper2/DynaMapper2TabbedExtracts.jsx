import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Tabs, Tab, Divider } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import isEmpty from 'lodash/isEmpty';
import mappingUtil, {ARRAY_DATA_TYPES, getUniqueExtractId, findMatchingExtract, buildExtractsHelperFromExtract, getSelectedExtractDataTypes} from '../../../../utils/mapping';
import useFormContext from '../../../Form/FormContext';
import DynaForm from '../..';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import {useUpdateParentForm} from '../DynaCsvGenerate_afe';
import { selectors } from '../../../../reducers';

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

function getSubFormMetadata(value, formKey, dataType, sourceField, sourceDataTypeVal, extractsTree) {
  const newValue = buildExtractsHelperFromExtract({existingExtractsArray: value, sourceField, extractsTree});

  return {
    fieldMap: {
      sourceDataType: {
        id: 'sourceDataType',
        name: 'sourceDataType',
        type: 'select',
        skipSort: true,
        skipDefault: true,
        label: 'Source data type',
        defaultValue: findMatchingExtract(newValue, formKey).sourceDataType || sourceDataTypeVal || 'string',
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
        defaultValue: mappingUtil.getV2DefaultActionValue(findMatchingExtract(newValue, formKey)) || 'discardIfEmpty',
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
        defaultValue: findMatchingExtract(newValue, formKey).default,
      },
      copySource: {
        id: 'copySource',
        name: 'copySource',
        type: 'radiogroup',
        label: 'Copy an object array from the source as-is?',
        helpKey: 'mapping.v2.copyObjectArray',
        fullWidth: true,
        defaultValue: findMatchingExtract(newValue, formKey).copySource || 'no',
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
        defaultValue: mappingUtil.getV2DefaultActionValue(findMatchingExtract(newValue, formKey)) || 'discardIfEmpty',
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

function constructExtractsArray(formKey, newOptions, existingExtractsArray, dataType, sourceField) {
  // no source selected
  if (formKey === SUB_FORM_KEY) {
    return [];
  }

  const newExtractObj = {
    extract: formKey,
    sourceDataType: newOptions.sourceDataType,
    copySource: dataType === 'objectarray' ? newOptions.copySource : undefined,
    conditional: {when: 'extract_not_empty'},
  };

  if (dataType === 'objectarray' && newOptions.copySource === 'yes') {
    if (newOptions.objectAction === 'useNull') {
      newExtractObj.default = null;
      delete newExtractObj.conditional;
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

  return buildExtractsHelperFromExtract({existingExtractsArray, sourceField, formKey, newExtractObj});
}

function EachTabContainer({id, value, formKey, dataType, isCurrentTab, onFieldChange, sourceField}) {
  const extractsTree = useSelector(state => selectors.v2MappingsExtractsTree(state));

  const handleFormChange = useCallback(
    (newOptions, isValid, touched) => {
      const extractsArrayHelper = constructExtractsArray(formKey, newOptions, value, dataType, sourceField);

      onFieldChange(id, extractsArrayHelper, touched);
    }, [formKey, id, onFieldChange, value, dataType, sourceField]);

  useUpdateParentForm(formKey, handleFormChange);

  // During initializing the tabs set the source datatype
  // depending on the source field selected
  const sourceDataTypeVal = getSelectedExtractDataTypes({extractsTree, selectedValue: formKey});

  // useSetSubFormShowValidations(parentFormKey, formKey);
  const formKeyComponent = useFormInitWithPermissions({
    formKey,
    fieldMeta: getSubFormMetadata(value, formKey, dataType, sourceField, sourceDataTypeVal[0], extractsTree),
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

  useEffect(() => {
    setSelectedTab(0);
  }, [tabs.length]);

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
            dataType={dataType}
            sourceField={sourceField}
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
                  dataType={dataType}
                  sourceField={sourceField}
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
