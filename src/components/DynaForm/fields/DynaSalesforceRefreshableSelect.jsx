import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import { DynaGenericSelect } from './DynaRefreshableSelect/RefreshGenericResource';
import { salesforceExportSelectOptions } from '../../../utils/resource';
import useFormContext from '../../Form/FormContext';

function DynaSalesforceSelectOptionsGenerator(props) {
  const { connectionId, filterKey, fieldName, formKey } = props;
  const formContext = useFormContext(formKey);
  const { value: formValues } = formContext;
  const soqlQueryField = formValues['/salesforce/soql'];
  const entityName = (soqlQueryField && soqlQueryField.entityName) || '';
  const commMetaPath = `salesforce/metadata/connections/${connectionId}/sObjectTypes/${entityName}`;
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
  const handleRefreshResource = () =>
    dispatch(actions.metadata.refresh(connectionId, commMetaPath));

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

export default DynaSalesforceSelectOptionsGenerator;
