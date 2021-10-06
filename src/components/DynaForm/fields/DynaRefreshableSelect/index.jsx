import { makeStyles } from '@material-ui/core';
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import RawHtml from '../../../RawHtml';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { DynaGenericSelect } from './RefreshGenericResource';

const useStyles = makeStyles(() => ({
  validationError: {
    '&:empty': {
      display: 'none',
    },
  },
}));

/**
 *
 * Setting options.disableOptionsLoad= true, will restrict fetch of resources
 */
export default function DynaSelectOptionsGenerator(props) {
  const {
    connectionId,
    bundlePath,
    ignoreValidation,
    ignoreValueUnset,
    bundleUrlHelp,
    options = {},
    filterKey,
    commMetaPath,
    disableFetch,
  } = props;
  const disableOptionsLoad = options.disableFetch || disableFetch;
  const classes = useStyles();
  const dispatch = useDispatch();

  const { status, data, errorMessage, validationError } = useSelectorMemo(selectors.makeOptionsFromMetadata, connectionId,
    options.commMetaPath || commMetaPath,
    options.filterKey || filterKey);

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
  const isOffline = useSelector(state =>
    selectors.isConnectionOffline(state, connectionId)
  );
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

  return (
    <div>
      <DynaGenericSelect
        resourceToFetch={options.commMetaPath || commMetaPath}
        resetValue={options.resetValue}
        onFetch={onFetch}
        onRefresh={onRefresh}
        fieldStatus={status}
        fieldData={data}
        ignoreValueUnset={ignoreValueUnset}
        fieldError={errorMessage}
        disableOptionsLoad={disableOptionsLoad}
        {...props}
      />
      {!ignoreValidation && !isOffline && (
        <RawHtml className={classes.validationError} html={validationError} />
      )}
    </div>
  );
}
