import { FieldWrapper } from 'react-forms-processor';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import RefreshGenericResource from './RefreshGenericResource';

function DynaSelectOptionsGenerator(props) {
  const { connectionId, resourceType, mode, options, filterKey } = props;
  const dispatch = useDispatch();
  const { isLoadingData, options: fieldOptions } = useSelector(state =>
    selectors.metadataOptionsAndResources(
      state,
      connectionId,
      mode,
      (options && options.resourceToFetch) || resourceType,
      filterKey
    )
  );
  const onFetchResource = () => {
    const resource = (options && options.resourceToFetch) || resourceType;

    if (resource && !isLoadingData) {
      dispatch(
        actions.metadata.request(connectionId, resource, mode, filterKey)
      );
    }
  };

  return (
    <FieldWrapper {...props}>
      <RefreshGenericResource
        resourceToFetch={props.options.resourceToFetch}
        resetValue={props.options.resetValue}
        onFetchResource={onFetchResource}
        isLoadingData={isLoadingData}
        fieldOptions={fieldOptions}
        {...props}
      />
    </FieldWrapper>
  );
}

export default DynaSelectOptionsGenerator;
