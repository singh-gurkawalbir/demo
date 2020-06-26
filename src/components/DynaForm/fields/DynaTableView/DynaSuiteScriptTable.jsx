import { makeStyles } from '@material-ui/core';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import FormContext from 'react-forms-processor/dist/components/FormContext';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import * as selectors from '../../../../reducers';
import Spinner from '../../../Spinner';
import DynaSelect from '../DynaSelect';
import DynaTableView from './DynaTable';

const useStyles = makeStyles(theme => ({
  margin: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  dynaStaticMapWidgetWrapper: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    padding: theme.spacing(2, 3),
  },
}));


const SalesforceProductOptions = ({value,
  onFieldChange,
  options}) => (
    <DynaSelect
      value={value}
      onFieldChange={onFieldChange}
      options={options}
      label="Salesforce item Field" />);

function DynaSuiteScriptTable(props) {
  const {
    id,
    // _integrationId,
    extracts = [],
    onFieldChange,
    value = {},
    generates = [],
    extractFieldHeader,
    generateFieldHeader,
    supportsExtractsRefresh,
    supportsGeneratesRefresh,
    salesforceProductFieldOptions,
    salesforceProductField,
    ssLinkedConnectionId: connectionId,
    registerField,
  } = props;

  const [shouldReset, setShouldReset] = useState(false);
  const [selectOption, setSelectOption] = useState(salesforceProductField);
  const classes = useStyles();
  // The values should be saved within a value object
  const salesforceProductOptions = useMemo(() => {
    if (salesforceProductFieldOptions) {
      return [
        {items: salesforceProductFieldOptions.map(([value, label]) => ({ label, value }))}];
    }
  },
  [salesforceProductFieldOptions]);

  const computedValue = useMemo(() => Object.keys(value || {}).map(key => ({
    extracts: key,
    generates: value[key],
  })), [value]);
  const commMetaPath = `suitescript/connections/${connectionId}/connections/SALESFORCE_CONNECTION/sObjectTypes/Product2?ignoreCache=true`;


  const { data: allFieldsOptions} = useSelectorMemo(selectors.makeOptionsFromMetadata, connectionId,
    commMetaPath,
    'suiteScript-sObjects-product2');


  const dispatch = useDispatch();
  const salesforceProductFieldId = `${id}_salesforceProductField`;

  useEffect(() => {
    if (salesforceProductFieldOptions) {
      dispatch(actions.metadata.request(connectionId, commMetaPath));
      registerField({id: salesforceProductFieldId, name: `/${salesforceProductFieldId}`, value: salesforceProductField});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commMetaPath, connectionId, salesforceProductFieldOptions, dispatch]);

  const optionsMap = useMemo(() => {
    const selectOptionLabel = salesforceProductOptions?.[0]?.items?.find(op => op.value === selectOption)?.label;

    const selectedOptionList = allFieldsOptions &&
  allFieldsOptions.length && allFieldsOptions.find(opt => opt.label === selectOptionLabel)?.options;
    const finalSelectedOptionList = selectedOptionList ? selectedOptionList.map(({label, value}) => ({text: label, id: value})) : [];
    setShouldReset(state => !state);
    return [
      {
        id: 'extracts',
        label: extractFieldHeader,
        name: extractFieldHeader,
        required: true,
        type: 'autosuggest',
        options: extracts && extracts.length ? extracts : finalSelectedOptionList,
        supportsRefresh: supportsExtractsRefresh,
      },
      {
        id: 'generates',
        label: generateFieldHeader,
        name: generateFieldHeader,
        required: true,
        options: generates,
        type: 'autosuggest',
        supportsRefresh: supportsGeneratesRefresh,
      },
    ];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salesforceProductOptions, allFieldsOptions, selectOption]);

  const salesforceProductFieldChange = useCallback((id, val) => {
    setSelectOption(val);

    onFieldChange(salesforceProductFieldId, val);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMapChange = useCallback(
    (tableid, value = []) => {
      const mapValue = {};

      value.filter(Boolean).forEach(val => {
        mapValue[val.extracts] = val.generates;
      });
      onFieldChange(id, mapValue);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );


  if (salesforceProductFieldOptions && !allFieldsOptions) { return <Spinner />; }


  return (
    <>
      {salesforceProductFieldOptions && <SalesforceProductOptions
        value={selectOption}
        onFieldChange={salesforceProductFieldChange}
        options={salesforceProductOptions}
        connectionId={connectionId}
      />}
      <DynaTableView
        {...props}
        optionsMap={optionsMap}
        metadata={{optionsMap}}
        hideLabel
        shouldReset={shouldReset}
        className={classes.dynaStaticMapWidgetWrapper}
        value={computedValue}
        onFieldChange={handleMapChange}
      />
    </>
  );
}

export default function DynaSuiteScriptTableWrapped(props) {
  return (
    <FormContext.Consumer >
      {form => (
        <DynaSuiteScriptTable {...props} registerField={form.registerField} />
      )}
    </FormContext.Consumer>);
}
