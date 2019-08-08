import { useCallback } from 'react';
import { FieldWrapper } from 'react-forms-processor/dist';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import RefreshGenericResource from './RefreshGenericResource';

function DynaSelectOptionsGenerator(props) {
  const { connectionId, resourceType, mode, options, filterKey } = props;
  const dispatch = useDispatch();
  const { status, data } = useSelector(state =>
    selectors.metadataOptionsAndResources(
      state,
      connectionId,
      mode,
      (options && options.resourceToFetch) || resourceType,
      filterKey
    )
  );
  const handleFetchResource = useCallback(() => {
    const resource = (options && options.resourceToFetch) || resourceType;

    if (resource && !data) {
      dispatch(
        actions.metadata.request(connectionId, resource, mode, filterKey)
      );
    }
  }, [connectionId, data, dispatch, filterKey, mode, options, resourceType]);
  const handleRefreshResource = () => {
    const resource = (options && options.resourceToFetch) || resourceType;

    if (resource) {
      dispatch(
        actions.metadata.refresh(connectionId, resource, mode, filterKey)
      );
    }
  };

  return (
    <FieldWrapper {...props}>
      <RefreshGenericResource
        resourceToFetch={props.options.resourceToFetch}
        resetValue={props.options.resetValue}
        handleFetchResource={handleFetchResource}
        handleRefreshResource={handleRefreshResource}
        fieldStatus={status}
        fieldData={data}
        {...props}
      />
    </FieldWrapper>
  );
}

export default DynaSelectOptionsGenerator;
