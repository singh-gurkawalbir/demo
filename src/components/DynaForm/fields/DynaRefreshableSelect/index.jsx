import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import RefreshGenericResource from './RefreshGenericResource';

export default function DynaSelectOptionsGenerator(props) {
  const { connectionId, resourceType, mode, options, filterKey } = props;
  const dispatch = useDispatch();
  const { status, data, errorMessage } = useSelector(state =>
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
    const isResourceAvailableToFetch = !(
      options && options.isResourceAvailableToFetch === false
    );

    if (isResourceAvailableToFetch && resource && !data) {
      dispatch(
        actions.metadata.request(connectionId, resource, mode, filterKey)
      );
    }
  }, [connectionId, data, dispatch, filterKey, mode, options, resourceType]);
  const handleRefreshResource = () => {
    const resource = (options && options.resourceToFetch) || resourceType;
    const isResourceAvailableToFetch = !(
      options && options.isResourceAvailableToFetch === false
    );

    if (isResourceAvailableToFetch && resource) {
      dispatch(
        actions.metadata.refresh(connectionId, resource, mode, filterKey)
      );
    }
  };

  return (
    <RefreshGenericResource
      resourceToFetch={props.options.resourceToFetch}
      resetValue={props.options.resetValue}
      handleFetchResource={handleFetchResource}
      handleRefreshResource={handleRefreshResource}
      fieldStatus={status}
      fieldData={data}
      fieldError={errorMessage}
      {...props}
    />
  );
}
