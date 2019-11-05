import { useSelector, useDispatch } from 'react-redux';
import { FormContext } from 'react-forms-processor/dist';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import RefreshGenericResource from './DynaRefreshableSelect/RefreshGenericResource';

function DynaSalesforceSelectOptionsGenerator(props) {
  const {
    connectionId,
    metadataType,
    mode,
    filterKey,
    selectField,
    formContext,
  } = props;
  const { value: formValues } = formContext;
  const soqlQueryField = formValues['/salesforce/soql'];
  const entityName = (soqlQueryField && soqlQueryField.entityName) || '';
  const dispatch = useDispatch();
  const { data = [], status, errorMessage } = useSelector(state =>
    selectors.metadataOptionsAndResources(
      state,
      connectionId,
      mode,
      metadataType,
      filterKey,
      entityName,
      selectField
    )
  );
  let options = data.filter(f => ['datetime', 'date'].indexOf(f.type) > -1);

  options = options.map(op => ({ label: op.label, value: op.value }));

  const handleRefreshResource = () => {
    if (metadataType) {
      dispatch(
        actions.metadata.refresh(
          connectionId,
          metadataType,
          mode,
          filterKey,
          entityName,
          selectField
        )
      );
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
