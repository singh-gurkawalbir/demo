import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DynaGenericSelect } from './RefreshGenericResource';
import actions from '../../../../actions';
import * as selectors from '../../../../reducers';

export default function RefreshableIntegrationAppSetting(props) {
  const {
    id: fieldName,
    _integrationId,
    options: defaultFieldOptions,
    value,
    properties,
    onFieldChange,
  } = props;
  const dispatch = useDispatch();
  const handleRefreshResource = useCallback(() => {
    dispatch(
      actions.connectors.refreshMetadata(null, fieldName, _integrationId)
    );
  }, [_integrationId, dispatch, fieldName]);
  const { isLoading, options } = useSelector(state =>
    selectors.connectorFieldOptions(
      state,
      fieldName,
      null,
      _integrationId,
      defaultFieldOptions
    )
  );
  const valueAndLabel = properties && properties.yieldValueAndLabel;

  useEffect(() => {
    if (valueAndLabel && value && (!value.id || !value.label)) {
      const selectedOption = options.find(option => option.value === value);
      const { label } = selectedOption;

      // save it as a valueLabel
      onFieldChange(fieldName, { id: value, label });
    }
  }, [fieldName, onFieldChange, options, value, valueAndLabel]);

  return (
    <DynaGenericSelect
      {...props}
      resourceToFetch={null}
      resetValue={null}
      handleFetchResource={null}
      handleRefreshResource={handleRefreshResource}
      fieldStatus={!isLoading}
      fieldData={options || []}
      fieldError={null}
      value={valueAndLabel ? value && value.id : value}
    />
  );
}
