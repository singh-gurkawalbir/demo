import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import RefreshGenericResource from './RefreshGenericResource';

/**
 *
 * Setting options.disableOptionsLoad= true, will restrict fetch of resources
 */
export default function DynaSelectOptionsGenerator(props) {
  const {
    connectionId,
    resourceType,
    mode,
    options = {},
    filterKey,
    recordType,
    disableOptionsLoad,
    selectField,
  } = props;
  const dispatch = useDispatch();
  const { status, data, errorMessage } = useSelector(state =>
    selectors.metadataOptionsAndResources(
      state,
      connectionId,
      mode,
      options.resourceToFetch || resourceType,
      options.filterKey || filterKey,
      options.recordType || recordType,
      selectField
    )
  );
  const handleFetchResource = useCallback(() => {
    const resource = options.resourceToFetch || resourceType;

    if (resource && !data && !disableOptionsLoad) {
      dispatch(
        actions.metadata.request({
          connectionId,
          metadataType: resource,
          mode,
          filterKey: options.filterKey || filterKey,
          recordType: options.recordType || recordType,
          selectField,
        })
      );
    }
  }, [
    connectionId,
    data,
    disableOptionsLoad,
    dispatch,
    filterKey,
    mode,
    options.filterKey,
    options.recordType,
    options.resourceToFetch,
    recordType,
    resourceType,
    selectField,
  ]);
  const handleRefreshResource = () => {
    const resource = options.resourceToFetch || resourceType;

    if (resource) {
      dispatch(
        actions.metadata.refresh(
          connectionId,
          resource,
          mode,
          options.filterKey || filterKey,
          options.recordType || recordType,
          selectField
        )
      );
    }
  };

  return (
    <RefreshGenericResource
      resourceToFetch={options.resourceToFetch || resourceType}
      resetValue={options.resetValue}
      handleFetchResource={handleFetchResource}
      handleRefreshResource={handleRefreshResource}
      fieldStatus={status}
      fieldData={data}
      fieldError={errorMessage}
      {...props}
    />
  );
}
