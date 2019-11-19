import { useSelector, useDispatch } from 'react-redux';
import { FormContext } from 'react-forms-processor/dist';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import RefreshGenericResource from './DynaRefreshableSelect/RefreshGenericResource';
import { salesforceExportSelectOptions } from '../../../utils/resource';

function DynaSalesforceSelectOptionsGenerator(props) {
  const {
    connectionId,
    metadataType,
    filterKey,
    formContext,
    fieldName,
  } = props;
  const { value: formValues } = formContext;
  const soqlQueryField = formValues['/salesforce/soql'];
  const entityName = (soqlQueryField && soqlQueryField.entityName) || '';
  const commMetaPath = `salesforce/metadata/connections/${connectionId}/${metadataType}/${entityName}`;
  const dispatch = useDispatch();
  const { data = [], status, errorMessage } = useSelector(state =>
    selectors.metadataOptionsAndResources({
      state,
      connectionId,
      commMetaPath,
      filterKey,
    })
  );
  const options = salesforceExportSelectOptions(data, fieldName);
  const handleRefreshResource = () => {
    if (metadataType) {
      dispatch(actions.metadata.refresh(connectionId, commMetaPath));
    }
  };

  return (
    <RefreshGenericResource
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
