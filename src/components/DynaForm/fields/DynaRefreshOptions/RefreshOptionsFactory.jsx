import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import RefreshGenericResource from './RefreshGenericResource';

export default function DynaSelectOptionsGenerator(props) {
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
  const handleFetchResource = useCallback(() => {
    const resource = (options && options.resourceToFetch) || resourceType;

    if (resource && !isLoadingData) {
      dispatch(
        actions.metadata.request(connectionId, resource, mode, filterKey)
      );
    }
  }, [
    connectionId,
    dispatch,
    filterKey,
    isLoadingData,
    mode,
    options,
    resourceType,
  ]);

  return (
    <RefreshGenericResource
      resourceToFetch={props.options.resourceToFetch}
      resetValue={props.options.resetValue}
      handleFetchResource={handleFetchResource}
      isLoadingData={isLoadingData}
      fieldOptions={fieldOptions}
      {...props}
    />
  );
}
