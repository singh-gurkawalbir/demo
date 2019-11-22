import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import { DynaGenericSelect } from './RefreshGenericResource';

/**
 *
 * Setting options.disableOptionsLoad= true, will restrict fetch of resources
 */
export default function DynaSelectOptionsGenerator(props) {
  const {
    connectionId,
    options = {},
    filterKey,
    commMetaPath,
    disableFetch,
  } = props;
  const disableOptionsLoad = options.disableFetch || disableFetch;
  const dispatch = useDispatch();
  const { status, data, errorMessage } = useSelector(state =>
    selectors.metadataOptionsAndResources({
      state,
      connectionId,
      commMetaPath: options.commMetaPath || commMetaPath,
      filterKey: options.filterKey || filterKey,
    })
  );
  const handleFetchResource = useCallback(() => {
    if (!data && !disableOptionsLoad) {
      dispatch(
        actions.metadata.request(
          connectionId,
          options.commMetaPath || commMetaPath
        )
      );
    }
  }, [
    commMetaPath,
    connectionId,
    data,
    disableOptionsLoad,
    dispatch,
    options.commMetaPath,
  ]);
  const handleRefreshResource = () => {
    dispatch(
      actions.metadata.refresh(
        connectionId,
        options.commMetaPath || commMetaPath
      )
    );
  };

  return (
    <DynaGenericSelect
      resourceToFetch={options.commMetaPath || commMetaPath}
      resetValue={options.resetValue}
      handleFetchResource={handleFetchResource}
      handleRefreshResource={handleRefreshResource}
      fieldStatus={status}
      fieldData={data}
      fieldError={errorMessage}
      disableOptionsLoad={disableOptionsLoad}
      {...props}
    />
  );
}
