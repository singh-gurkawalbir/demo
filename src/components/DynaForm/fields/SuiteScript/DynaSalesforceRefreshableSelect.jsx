import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import { DynaGenericSelect } from '../DynaRefreshableSelect/RefreshGenericResource';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import useFormContext from '../../../Form/FormContext';
import { selectors } from '../../../../reducers';

export default function DynaSalesforceSelectOptionsGenerator(props) {
  const {
    filterKey,
    fieldName,
    ssLinkedConnectionId,
    connectionId,
    formKey,
  } = props;

  const formValues = useFormContext(formKey)?.value;
  const soqlQueryField = formValues['/export/salesforce/soql'];
  const entityName = (soqlQueryField && soqlQueryField.entityName) || '';
  const commMetaPath = `suitescript/connections/${ssLinkedConnectionId}/connections/${connectionId}/sObjectTypes/${entityName}?ignoreCache=true`;
  const dispatch = useDispatch();

  const { data = [], status, errorMessage } = useSelectorMemo(selectors.makeOptionsFromMetadata, ssLinkedConnectionId, commMetaPath, filterKey);

  const options = useMemo(() => {
    let options = data; // salesforceExportSelectOptions(data, fieldName);

    if (data && fieldName === 'onceExportBooleanFields') {
      options = data.filter(f => f.type === 'boolean' && f.updateable);
    }

    return options;
  }, [data, fieldName]);

  const handleRefreshResource = useCallback(() =>
    dispatch(actions.metadata.refresh(ssLinkedConnectionId, commMetaPath)), [commMetaPath, dispatch, ssLinkedConnectionId]);

  return (
    <DynaGenericSelect
      handleRefreshResource={handleRefreshResource}
      fieldStatus={status}
      fieldData={options}
      fieldError={errorMessage}
      {...props}
    />
  );
}
