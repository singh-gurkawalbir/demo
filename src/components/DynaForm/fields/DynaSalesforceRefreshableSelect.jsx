import React from 'react';
import { useDispatch } from 'react-redux';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { salesforceExportSelectOptions } from '../../../utils/resource';
import useFormContext from '../../Form/FormContext';
import { DynaGenericSelect } from './DynaRefreshableSelect/RefreshGenericResource';

export default function DynaSalesforceSelectOptionsGenerator(props) {
  const { connectionId, filterKey, fieldName, formKey } = props;
  const formContext = useFormContext(formKey);
  const { value: formValues } = formContext;
  const soqlQueryField = formValues['/salesforce/soql'];
  const entityName = (soqlQueryField && soqlQueryField.entityName) || '';
  const commMetaPath = `salesforce/metadata/connections/${connectionId}/sObjectTypes/${entityName}`;
  const dispatch = useDispatch();

  const { data = [], status, errorMessage } = useSelectorMemo(selectors.makeOptionsFromMetadata, connectionId, commMetaPath, filterKey);

  const options = salesforceExportSelectOptions(data, fieldName);
  const handleRefreshResource = () =>
    dispatch(actions.metadata.refresh(
      connectionId,
      commMetaPath,
      {
        refreshCache: true,
      }
    ));

  return (
    <DynaGenericSelect
      onRefresh={handleRefreshResource}
      fieldStatus={status}
      fieldData={options}
      fieldError={errorMessage}
      {...props}
    />
  );
}
