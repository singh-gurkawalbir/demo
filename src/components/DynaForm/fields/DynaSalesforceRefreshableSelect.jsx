import { useEffect, useState } from 'react';
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
    resourceType,
    recordType,
  } = props;
  const { value: formValues } = formContext;
  const { entityName, query } = formValues['/salesforce/soql'];
  const [refresh, setRefresh] = useState(false);

  console.log('entityName ', entityName);
  const dispatch = useDispatch();
  const { data = [], status = true, errorMessage } = useSelector(state =>
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

  console.log('data  ', data);
  let options = data.filter(f => ['datetime', 'date'].indexOf(f.type) > -1);

  options = options.map(op => ({ label: op.label, value: op.value }));
  console.log('options  ', options);

  const handleRefreshResource = () => {
    if (metadataType) {
      //   dispatch(
      //     actions.metadata.request({
      //       connectionId,
      //       metadataType: resourceType,
      //       recordType,
      //       addInfo: { query },
      //     })
      //   );
      setRefresh(true);
    }
  };

  useEffect(() => {
    if (refresh && entityName) {
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
      setRefresh(false);
    }
  }, [
    connectionId,
    dispatch,
    entityName,
    filterKey,
    metadataType,
    mode,
    refresh,
    selectField,
  ]);

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
