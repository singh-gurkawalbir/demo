import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { DynaGenericSelect } from './RefreshGenericResource';

/**
 *
 * Setting options.disableOptionsLoad= true, will restrict fetch of resources
 */
export default function DynaSelectOptionsGenerator(props) {
  const {
    connectionId,
    bundlePath,
    ignoreValidation,
    bundleUrlHelp,
    options = {},
    filterKey,
    commMetaPath,
    disableFetch,
  } = props;
  const disableOptionsLoad = options.disableFetch || disableFetch;
  const dispatch = useDispatch();

  const { status, data, errorMessage, validationError } = useSelectorMemo(selectors.makeOptionsFromMetadata, connectionId,
    options.commMetaPath || commMetaPath,
    options.filterKey || filterKey);

  // const isOffline = useSelectorMemo(selectors.isConnectionOffline, connectionId);

  const onFetch = useCallback(() => {
    if (!data && !disableOptionsLoad) {
      dispatch(
        actions.metadata.request(
          connectionId,
          options.commMetaPath || commMetaPath,
          { bundleUrlHelp, bundlePath }
        )
      );
    }
  }, [
    bundlePath,
    bundleUrlHelp,
    commMetaPath,
    connectionId,
    data,
    disableOptionsLoad,
    dispatch,
    options.commMetaPath,
  ]);
  const onRefresh = useCallback(() => {
    if (disableOptionsLoad) {
      return;
    }
    dispatch(
      actions.metadata.refresh(
        connectionId,
        options.commMetaPath || commMetaPath,
        {
          refreshCache: true,
          bundleUrlHelp,
          bundlePath,
        }
      )
    );
  }, [bundlePath, bundleUrlHelp, commMetaPath, connectionId, disableOptionsLoad, dispatch, options.commMetaPath]);

  useEffect(() => {
    if (!ignoreValidation && validationError && bundleUrlHelp) {
      dispatch(actions.connection.setBundleInstallMessage({ connectionId, validationError}));
    }

    return () => dispatch(actions.connection.clearBundleInstallMessage(connectionId));
  }, [dispatch, validationError, connectionId, ignoreValidation, bundleUrlHelp]);

  return (
    <>
      <DynaGenericSelect
        resourceToFetch={options.commMetaPath || commMetaPath}
        resetValue={options.resetValue}
        onFetch={onFetch}
        onRefresh={onRefresh}
        fieldStatus={status}
        fieldData={data}
        fieldError={errorMessage}
        disableOptionsLoad={disableOptionsLoad}
        {...props}
      />
    </>
  );
}
