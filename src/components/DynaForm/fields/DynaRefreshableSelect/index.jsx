import makeStyles from '@mui/styles/makeStyles';
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
    isLoggable,
    devPlayGroundSpecificField,
  } = props;
  const disableOptionsLoad = options.disableFetch || disableFetch;
  const classes = useStyles();
  const dispatch = useDispatch();

  const { status, data, errorMessage, validationError } = useSelectorMemo(selectors.makeOptionsFromMetadata, connectionId,
    options.commMetaPath || commMetaPath,
    options.filterKey || filterKey);

  const onFetch = useCallback(() => {
    if (!devPlayGroundSpecificField && !data && !disableOptionsLoad) {
      dispatch(
        actions.metadata.request(
          connectionId,
          options.commMetaPath || commMetaPath,
          { bundleUrlHelp, bundlePath }
        )
      );
    }
  }, [bundlePath, bundleUrlHelp, commMetaPath, connectionId, data, devPlayGroundSpecificField, disableOptionsLoad, dispatch, options.commMetaPath]);
  const isOffline = useSelector(state =>
    selectors.isConnectionOffline(state, connectionId)
  );
  const onRefresh = useCallback(() => {
    if (disableOptionsLoad || devPlayGroundSpecificField) {
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
  }, [bundlePath, bundleUrlHelp, commMetaPath, connectionId, devPlayGroundSpecificField, disableOptionsLoad, dispatch, options.commMetaPath]);

  if (devPlayGroundSpecificField) {
    const tempData = [{id: '2', recordType: 'shipitem', label: 'Pick-up at store', value: '2'}, {id: '3', recordType: 'shipitem', label: 'Truck', value: '3'}, {id: '77', recordType: 'shipitem', label: 'UPS Next Day Air', value: '77'}];

    return (
      <div>
        <DynaGenericSelect
          resourceToFetch={options.commMetaPath || commMetaPath}
          resetValue={options.resetValue}
          onFetch={onFetch}
          onRefresh={onRefresh}
          fieldStatus="received"
          fieldData={tempData}
          ignoreValueUnset={ignoreValueUnset}
          disableOptionsLoad={disableOptionsLoad}
          {...props} />
      </div>
    );
  }

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
        <RawHtml className={classes.validationError} html={validationError} isLoggable={isLoggable} />
      )}
    </div>
  );
}
