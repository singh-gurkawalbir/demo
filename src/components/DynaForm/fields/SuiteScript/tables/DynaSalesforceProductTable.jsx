import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '@celigo/fuse-ui';
import actions from '../../../../../actions';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../../../reducers';
import DynaSelect from '../../DynaSelect';
import DynaTableView from '../../DynaTableView/DynaTable';

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
    background: theme.palette.background.default,
  },
}));

export const useGetSuiteScriptBaseCommPath = ({connectionId, integrationId}) => {
  const flows = useSelector(state => selectors.suiteScriptResourceList(state, {resourceType: 'flows', ssLinkedConnectionId: connectionId, integrationId}));
  const salesforceConnectionId = useMemo(() => flows.find(flow => flow?.import?.type === 'salesforce' && flow?.import?._connectionId)?.import?._connectionId, [flows]);

  return `suitescript/connections/${connectionId}/connections/${salesforceConnectionId}/sObjectTypes`;
};

export const BaseTableViewComponent = props => {
  const classes = useStyles();
  const {onFieldChange, value, optionsMap, id, shouldReset, disabled} = props;
  const computedValue = useMemo(() => Object.keys(value || {}).map(key => ({
    // casting the values to strings
    extracts: `${key}`,
    generates: `${value[key]}`,
  })), [value]);

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

  return (
    <DynaTableView
      {...props}
      optionsMap={optionsMap}
      metadata={{optionsMap}}
      hideLabel
      shouldReset={shouldReset}
      className={classes.dynaStaticMapWidgetWrapper}
      value={computedValue}
      onFieldChange={handleMapChange}
      disableDeleteRows={disabled}
      />
  );
};

const SalesforceProductOptions = ({value,
  onFieldChange,
  options}) => (
    <DynaSelect
      value={value}
      onFieldChange={onFieldChange}
      options={options}
      label="Salesforce item Field" />
);

export default function DynaSuiteScriptTable(props) {
  const {
    id,
    _integrationId: integrationId,
    extracts = [],
    onFieldChange,
    generates = [],
    extractFieldHeader,
    generateFieldHeader,
    supportsExtractsRefresh,
    supportsGeneratesRefresh,
    salesforceProductFieldOptions,
    salesforceProductField,
    ssLinkedConnectionId: connectionId,
    disabled,
    registerField,
  } = props;

  const [shouldReset, setShouldReset] = useState(false);
  const [selectOption, setSelectOption] = useState(salesforceProductField);

  // The values should be saved within a value object
  const salesforceProductOptions = useMemo(() => {
    if (salesforceProductFieldOptions) {
      return [
        {items: salesforceProductFieldOptions.map(([value, label]) => ({ label, value }))}];
    }
  },
  [salesforceProductFieldOptions]);
  const baseCommPath = useGetSuiteScriptBaseCommPath({connectionId, integrationId});
  const commMetaPath = `${baseCommPath}/Product2?ignoreCache=true`;
  const { data: allFieldsOptions} = useSelectorMemo(selectors.makeOptionsFromMetadata, connectionId,
    commMetaPath,
    'suiteScript-sObjects');

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
        readOnly: disabled,
        required: true,
        type: 'autosuggest',
        options: extracts && extracts.length ? extracts : finalSelectedOptionList,
        supportsRefresh: supportsExtractsRefresh,
      },
      {
        id: 'generates',
        label: generateFieldHeader,
        name: generateFieldHeader,
        readOnly: disabled,
        required: true,
        options: generates,
        type: 'autosuggest',
        supportsRefresh: supportsGeneratesRefresh,
      },
    ];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salesforceProductOptions, allFieldsOptions, selectOption, disabled]);

  const salesforceProductFieldChange = useCallback((id, val) => {
    setSelectOption(val);

    onFieldChange(salesforceProductFieldId, val);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (salesforceProductFieldOptions && !allFieldsOptions) { return <Spinner />; }

  return (
    <>
      {salesforceProductFieldOptions && (
      <SalesforceProductOptions
      // can be loggable?
        isLoggable
        value={selectOption}
        onFieldChange={salesforceProductFieldChange}
        options={salesforceProductOptions}
        connectionId={connectionId}
      />
      )}
      <BaseTableViewComponent
        {...props}
        optionsMap={optionsMap}
        hideLabel
        shouldReset={shouldReset}
        disableDeleteRows={disabled}
      />
    </>
  );
}
