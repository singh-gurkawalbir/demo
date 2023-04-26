import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import RawHtml from '../../../../RawHtml';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
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
    bundleUrlHelp,
    options = {},
    filterKey,
    commMetaPath,
    disableFetch,
    ignoreCache,
    isLoggable,
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
          { bundleUrlHelp, bundlePath, ignoreCache }
        )
      );
    }
  }, [bundlePath, bundleUrlHelp, commMetaPath, connectionId, data, disableOptionsLoad, dispatch, ignoreCache, options.commMetaPath]);
  const onRefresh = useCallback(() => {
    if (disableOptionsLoad) {
      return;
    }
    const opts = {
      bundleUrlHelp,
      bundlePath,

    };

    if (ignoreCache) {
      opts.ignoreCache = true;
    } else {
      opts.refreshCache = true;
    }

    dispatch(
      actions.metadata.refresh(
        connectionId,
        options.commMetaPath || commMetaPath,
        opts
      )
    );
  }, [bundlePath, bundleUrlHelp, commMetaPath, connectionId, disableOptionsLoad, dispatch, ignoreCache, options.commMetaPath]);

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
      {!ignoreValidation && (
        <RawHtml className={classes.validationError} html={validationError} isLoggable={isLoggable} />
      )}
    </>
  );
}
