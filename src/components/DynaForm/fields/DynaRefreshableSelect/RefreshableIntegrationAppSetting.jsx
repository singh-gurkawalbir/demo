import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DynaGenericSelect } from './RefreshGenericResource';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';

export default function RefreshableIntegrationAppSetting(props) {
  const {
    id: fieldName,
    _integrationId,
    options: defaultFieldOptions,
    value,
    properties,
    autoPostBack,
    onFieldChange,
    disabled,
  } = props;

  const dispatch = useDispatch();
  const [autofill, setAutofill] = useState(false);
  const handleFieldChange = useCallback((id, val) => {
    if (autoPostBack) {
      dispatch(
        actions.connectors.refreshMetadata(val, id, _integrationId, {key: 'fieldValue', autoPostBack: true})
      );
      onFieldChange(id, val);
    } else {
      onFieldChange(id, val);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_integrationId, autoPostBack, dispatch]);
  const onRefresh = useCallback(() => {
    dispatch(
      actions.connectors.refreshMetadata(null, fieldName, _integrationId)
    );
  }, [_integrationId, dispatch, fieldName]);
  const { isLoading, options, value: newValue } = useSelector(state =>
    selectors.connectorFieldOptions(
      state,
      fieldName,
      null,
      _integrationId,
      defaultFieldOptions
    )
  );
  const netsuiteFilterConfig = useMemo(
    () => ({
      type: 'connections',
      filter: { type: 'netsuite', _integrationId },
    }),
    [_integrationId]
  );
  const connection = useSelectorMemo(
    selectors.makeResourceListSelector,
    netsuiteFilterConfig
  ).resources[0];
  const netSuiteSystemDomain = useMemo(
    () =>
      fieldName.includes('_listSavedSearches') &&
      connection &&
      connection.netsuite &&
      connection.netsuite.dataCenterURLs &&
      connection.netsuite.dataCenterURLs.systemDomain,
    [connection, fieldName]
  );
  const valueAndLabel = properties && properties.yieldValueAndLabel;

  useEffect(() => {
    if (valueAndLabel && value && (!value.id || !value.label)) {
      const selectedOption =
        options.find(option => option.value === value) || {};
      const { label } = selectedOption;

      // save it as a valueLabel
      if (label) {
        onFieldChange(fieldName, { id: value, label }, true);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldName, options, value, valueAndLabel]);

  useEffect(() => {
    if (newValue && (newValue !== value) && !autofill && disabled) {
      setAutofill(true);
      onFieldChange(fieldName, newValue, true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newValue, autofill, fieldName, disabled]);

  const netSuiteSavedSearchUrl = netSuiteSystemDomain && value && value.id ? `${netSuiteSystemDomain}/app/common/search/search.nl?id=${value.id}` : null;

  return (
    <DynaGenericSelect
      {...props}
      resourceToFetch={null}
      resetValue={null}
      onFetch={null}
      onFieldChange={handleFieldChange}
      onRefresh={onRefresh}
      fieldStatus={!isLoading}
      fieldData={options || []}
      fieldError={null}
      value={valueAndLabel ? value && value.id : value}
      urlToOpen={netSuiteSavedSearchUrl}
    />
  );
}
