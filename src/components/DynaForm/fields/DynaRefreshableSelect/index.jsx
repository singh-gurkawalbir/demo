import { useCallback, Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import { DynaGenericSelect } from './RefreshGenericResource';
import RawHtml from '../../../RawHtml';

/**
 *
 * Setting options.disableOptionsLoad= true, will restrict fetch of resources
 */
export default function DynaSelectOptionsGenerator(props) {
  const {
    connectionId,
    bundlePath,
    bundleUrlHelp,
    options = {},
    filterKey,
    commMetaPath,
    disableFetch,
  } = props;
  const disableOptionsLoad = options.disableFetch || disableFetch;
  const dispatch = useDispatch();
  const { status, data, errorMessage, validationError } = useSelector(state =>
    selectors.metadataOptionsAndResources({
      state,
      connectionId,
      commMetaPath: options.commMetaPath || commMetaPath,
      filterKey: options.filterKey || filterKey,
    })
  );

  useEffect(
    () => () => {
      dispatch(
        actions.metadata.clearValidations(
          connectionId,
          options.commMetaPath || commMetaPath
        )
      );
    },
    [commMetaPath, connectionId, dispatch, options.commMetaPath]
  );
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
  const onRefresh = () => {
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
  };

  return (
    <Fragment>
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
      <RawHtml html={validationError} />
    </Fragment>
  );
}
