import React, { useState, useMemo, useEffect } from 'react';
import FormContext from 'react-forms-processor/dist/components/FormContext';
import {BaseTableViewComponent} from './DynaSalesforceProductTable';
import DynaRadio from '../../radiogroup/DynaRadioGroup';
import DynaSelect from '../../DynaSelect';


const fieldMappingTypeOptions = [{items: ['Always Use', 'Map'].map(label => ({label, value: label}))}];

const defaultExtracts = ['Public', 'Private', 'Subsidiary', 'Other'].map(label => ({text: label, id: label}));
function DynaMapSubsidaries(props) {
  const {salesforceSubsidiaryFieldOptions, generates = [], extracts = [], value, onFieldChange, id,
    extractFieldHeader, generateFieldHeader, disabled, registerField, salesforceSubsidiaryField, fields} = props;
  const [fieldMappingType, setFieldMappingType] = useState('Always Use');
  const [tableValue, setTableValue] = useState(typeof value !== 'string' ? value : {});

  const [subsidaryValue, setSubsidaryValue] = useState(typeof value === 'string' ? value : '');
  const mapSubsidiariesSalesforceSubsidiaryFieldID = 'MapSubsidiaries_salesforceSubsidiaryField';
  const [shouldReset, setShouldReset] = useState(false);
  useEffect(() => {
    registerField({id: mapSubsidiariesSalesforceSubsidiaryFieldID, name: `/${mapSubsidiariesSalesforceSubsidiaryFieldID}`, value: salesforceSubsidiaryField});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const generateOptions = useMemo(() => [{items: generates.map(({id, text}) => ({label: text, value: id}))}], [generates]);

  const generatedSalesforceSubsidiaryFieldOptions = useMemo(() => [{items: salesforceSubsidiaryFieldOptions.map(([value, label]) => ({label, value}))}], [salesforceSubsidiaryFieldOptions]);
  const optionsMap = useMemo(() => {
    setShouldReset(state => !state);
    return [
      {
        id: 'extracts',
        label: extractFieldHeader,
        name: extractFieldHeader,
        readOnly: disabled,
        required: true,
        type: 'autosuggest',
        options: extracts && extracts.length ? extracts : defaultExtracts,
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
  }, [extractFieldHeader, disabled, extracts, generateFieldHeader, generates]);
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
  const selectedOption = fields?.find(({id}) => id === mapSubsidiariesSalesforceSubsidiaryFieldID)?.value;
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

          onFieldChange={(id, value) => {
            setSubsidaryValue(value);
          }}
          options={generateOptions}
          value={subsidaryValue} />) : (
            <>
              <DynaSelect
                value={selectedOption}
                label="Salesforce Subsidiary Field"
                options={generatedSalesforceSubsidiaryFieldOptions}
                onFieldChange={(id, value) => {
                  onFieldChange(mapSubsidiariesSalesforceSubsidiaryFieldID, value);
                }}
              />
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
