import { useCallback, Fragment } from 'react';
import { makeStyles } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import { DynaGenericSelect } from './RefreshGenericResource';
import RawHtml from '../../../RawHtml';

const useStyles = makeStyles(() => ({
  validationError: {
    display: 'inline-block !important',
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
  } = props;
  const disableOptionsLoad = options.disableFetch || disableFetch;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { status, data, errorMessage, validationError } = useSelector(state =>
    selectors.metadataOptionsAndResources({
      state,
      connectionId,
      commMetaPath: options.commMetaPath || commMetaPath,
      filterKey: options.filterKey || filterKey,
    })
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
      {!ignoreValidation && (
        <RawHtml className={classes.validationError} html={validationError} />
      )}
    </Fragment>
  );
}
