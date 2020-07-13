import React, { useState, useMemo, useEffect } from 'react';
import FormContext from 'react-forms-processor/dist/components/FormContext';
import { useDispatch } from 'react-redux';
import {BaseTableViewComponent, useGetSuiteScriptBaseCommPath} from './DynaSalesforceProductTable';
import DynaRadio from '../../radiogroup/DynaRadioGroup';
import DynaSelect from '../../DynaSelect';
import actions from '../../../../../actions';
import * as selectors from '../../../../../reducers';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import Spinner from '../../../../Spinner';

const fieldMappingTypeOptions = [{items: ['Always Use', 'Map'].map(label => ({label, value: label}))}];

const SalesforceSubsidarySelect = ({
  disabled,
  salesforceSubsidiaryFieldOptions,
  selectedOption,
  mapSubsidiariesSalesforceSubsidiaryFieldID, onFieldChange}) => {
  const generatedSalesforceSubsidiaryFieldOptions = useMemo(() =>
    [{items: salesforceSubsidiaryFieldOptions.map(([value, label]) => ({label, value}))}],
  [salesforceSubsidiaryFieldOptions]);

  return (
    <DynaSelect
      disabled={disabled}
      value={selectedOption}
      label="Salesforce Subsidiary Field"
      options={generatedSalesforceSubsidiaryFieldOptions}
      onFieldChange={(id, value) => {
        onFieldChange(mapSubsidiariesSalesforceSubsidiaryFieldID, value);
      }}
    />
  );
};
function DynaMapSubsidaries(props) {
  const {salesforceSubsidiaryFieldOptions, generates = [], extracts = [], value, onFieldChange, id,
    extractFieldHeader, generateFieldHeader, disabled, registerField,
    salesforceSubsidiaryField, fields,
    _integrationId: integrationId,
    ssLinkedConnectionId: connectionId,
  } = props;
  const [fieldMappingType, setFieldMappingType] = useState((!value || typeof value === 'string') ? 'Always Use' : 'Map');
  const [tableValue, setTableValue] = useState(typeof value !== 'string' ? value : {});

  const [subsidaryValue, setSubsidaryValue] = useState(typeof value === 'string' ? value : '');
  const mapSubsidiariesSalesforceSubsidiaryFieldID = 'MapSubsidiaries_salesforceSubsidiaryField';
  const [shouldReset, setShouldReset] = useState(false);
  useEffect(() => {
    registerField({id: mapSubsidiariesSalesforceSubsidiaryFieldID, name: `/${mapSubsidiariesSalesforceSubsidiaryFieldID}`, value: salesforceSubsidiaryField});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const generateOptions = useMemo(() => [{items: generates.map(({id, text}) => ({label: text, value: id}))}], [generates]);


  const basePath = useGetSuiteScriptBaseCommPath({connectionId, integrationId});
  const dispatch = useDispatch();

  const selectedOption = fields?.find(({id}) => id === mapSubsidiariesSalesforceSubsidiaryFieldID)?.value;
  const salesforceSubsidaryMetaPath = `${basePath}/Account?ignoreCache=true`;
  useEffect(() => {
    dispatch(actions.metadata.request(connectionId, salesforceSubsidaryMetaPath));
  }, [connectionId, dispatch, salesforceSubsidaryMetaPath]);
  const { data: allFieldsOptions, status: metadataStatus} = useSelectorMemo(selectors.makeOptionsFromMetadata, connectionId,
    salesforceSubsidaryMetaPath,
    'suiteScript-sObjects');


  const optionsMap = useMemo(() => {
    const selectedOptionList = allFieldsOptions &&
    // name corresponds to value of an option
    allFieldsOptions.length && allFieldsOptions.find(opt => opt.name === selectedOption)?.options;
    const finalSelectedOptionList = selectedOptionList ? selectedOptionList.map(({label, value}) => ({text: label, id: value})) : [];

    setShouldReset(state => !state);
    return [
      {
        id: 'extracts',
        label: extractFieldHeader,
        name: extractFieldHeader,
        readOnly: disabled,
        required: true,
        type: 'autosuggest',
        options: extracts && extracts.length ? extracts : finalSelectedOptionList,
      },
      {
        id: 'generates',
        label: generateFieldHeader,
        name: generateFieldHeader,
        readOnly: disabled,
        required: true,
        options: generates,
        type: 'autosuggest',
      },
    ];
  }, [allFieldsOptions, extractFieldHeader, disabled, extracts, generateFieldHeader, generates, selectedOption]);
  const [componentMounted, setComponentMounted] = useState(false);

  useEffect(() => {
    if (componentMounted) {
      if (fieldMappingType === 'Always Use') onFieldChange(id, subsidaryValue);
      else {
        onFieldChange(id, tableValue);
      }
    }
    setComponentMounted(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentMounted, fieldMappingType, id, subsidaryValue, tableValue]);


  return (
    <>

      <DynaRadio
        isValid
        value={fieldMappingType}
        onFieldChange={(id, value) => {
          setFieldMappingType(value);
        }}
        label="Field Mapping Type"
        options={fieldMappingTypeOptions} />

      {fieldMappingType === 'Always Use' ?

        (<DynaSelect
          label="Select Subsidiary"
          id={id}
          disabled={disabled}
          onFieldChange={(id, value) => {
            setSubsidaryValue(value);
          }}
          options={generateOptions}
          value={subsidaryValue} />) : (
            <>
              {metadataStatus === 'requested' ? <Spinner /> : (
                <SalesforceSubsidarySelect
                  disabled={disabled}
                  salesforceSubsidiaryFieldOptions={salesforceSubsidiaryFieldOptions}
                  selectedOption={selectedOption}
                  mapSubsidiariesSalesforceSubsidiaryFieldID={mapSubsidiariesSalesforceSubsidiaryFieldID}
                  onFieldChange={onFieldChange}
              />)}
              <BaseTableViewComponent
                {...props}
                optionsMap={optionsMap}
                value={tableValue}
                onFieldChange={(id, value) => {
                  setTableValue(value);
                }}
                hideLabel
                shouldReset={shouldReset}
                disableDeleteRows={disabled}
      />
            </>


        )}

    </>
  );
}

export default function DynaMapSubsidariesWrapped(props) {
  return (
    <FormContext.Consumer >
      {form => (
        <DynaMapSubsidaries {...props} fields={form.fields} registerField={form.registerField} />
      )}
    </FormContext.Consumer>);
}
