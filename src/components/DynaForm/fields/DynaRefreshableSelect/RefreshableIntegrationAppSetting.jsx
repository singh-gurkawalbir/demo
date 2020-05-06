import { useCallback, useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DynaGenericSelect } from './RefreshGenericResource';
import actions from '../../../../actions';
import * as selectors from '../../../../reducers';
import useResourceList from '../../../../hooks/selectors/useResourceList';

export default function RefreshableIntegrationAppSetting(props) {
  const {
    id: fieldName,
    _integrationId,
    options: defaultFieldOptions,
    value,
    properties,
    onFieldChange,
    disabled,
  } = props;
  const [netSuiteSavedSearchUrl, setNetSuiteSavedSearchUrl] = useState();
  const dispatch = useDispatch();
  const [autofill, setAutofill] = useState(false);
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
  const connection = useResourceList(netsuiteFilterConfig).resources[0];
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
      onFieldChange(fieldName, { id: value, label }, true);
    }
  }, [fieldName, onFieldChange, options, value, valueAndLabel]);

  useEffect(() => {
    if (!value && newValue && !autofill && disabled) {
      setAutofill(true);
      onFieldChange(fieldName, newValue, true);
    }
  }, [newValue, autofill, onFieldChange, fieldName, disabled, value]);

  useEffect(() => {
    if (netSuiteSystemDomain && value && value.id) {
      setNetSuiteSavedSearchUrl(
        `${netSuiteSystemDomain}/app/common/search/search.nl?id=${value.id}`
      );
    } else {
      setNetSuiteSavedSearchUrl();
    }
  }, [netSuiteSystemDomain, value]);

  return (
    <DynaGenericSelect
      {...props}
      resourceToFetch={null}
      resetValue={null}
      onFetch={null}
      onRefresh={onRefresh}
      fieldStatus={!isLoading}
      fieldData={options || []}
      fieldError={null}
      value={valueAndLabel ? value && value.id : value}
      urlToOpen={netSuiteSavedSearchUrl}
    />
  );
}
