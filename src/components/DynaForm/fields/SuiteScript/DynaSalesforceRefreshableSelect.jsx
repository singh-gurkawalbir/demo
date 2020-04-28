import { useSelector, useDispatch } from 'react-redux';
import { FormContext } from 'react-forms-processor/dist';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import { DynaGenericSelect } from '../DynaRefreshableSelect/RefreshGenericResource';

function DynaSalesforceSelectOptionsGenerator(props) {
  const {
    filterKey,
    formContext,
    fieldName,
    ssLinkedConnectionId,
    connectionId,
  } = props;
  const { value: formValues } = formContext;
  const soqlQueryField = formValues['/export/salesforce/soql'];
  const entityName = (soqlQueryField && soqlQueryField.entityName) || '';
  const commMetaPath = `suitescript/connections/${ssLinkedConnectionId}/connections/${connectionId}/sObjectTypes/${entityName}?ignoreCache=true`;
  const dispatch = useDispatch();
  const { data = [], status, errorMessage } = useSelector(state =>
    selectors.metadataOptionsAndResources({
      state,
      connectionId: ssLinkedConnectionId,
      commMetaPath,
      filterKey,
    })
  );
  let options = data; // salesforceExportSelectOptions(data, fieldName);

  if (data && fieldName === 'onceExportBooleanFields') {
    options = data.filter(f => f.type === 'boolean' && f.updateable);
  }

  const handleRefreshResource = () =>
    dispatch(actions.metadata.refresh(ssLinkedConnectionId, commMetaPath));

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

const DynaSalesforceFormContext = props => (
  <FormContext.Consumer {...props}>
    {form => (
      <DynaSalesforceSelectOptionsGenerator {...props} formContext={form} />
    )}
  </FormContext.Consumer>
);

export default DynaSalesforceFormContext;
