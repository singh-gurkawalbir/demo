import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import DynaTableView from './DynaTable';

export default function DynaRefreshableStaticMap(props) {
  const {
    connectionId,
    keyName = 'extract',
    keyLabel = 'Export',
    map,
    value,
    valueLabel = 'Import',
    valueName = 'generate',
    filterKey,
    commMetaPath,
    disableFetch,
    options = {},
  } = props;
  const optionsMap = [
    {
      id: keyName,
      label: keyLabel,
      required: true,
      type: 'input',
      supportsRefresh: false,
    },
    {
      id: valueName,
      label: valueLabel,
      required: true,
      type: 'autosuggest',
      optionsChangeIdentifer: 0,
      options: [],
      supportsRefresh: true,
    },
  ];
  let computedValue;

  if (map && !value) {
    computedValue = Object.keys(map || {}).map(key => ({
      [keyName]: key,
      [valueName]: map[key],
    }));
  } else {
    computedValue = value;
  }

  const disableOptionsLoad = options.disableFetch || disableFetch;
  const dispatch = useDispatch();
  const { status, metadata } = useSelector(state => {
    const {
      status,
      data,
      changeIdentifier,
    } = selectors.metadataOptionsAndResources({
      state,
      connectionId,
      commMetaPath: options.commMetaPath || commMetaPath,
      filterKey: options.filterKey || filterKey,
    });
    const obj = {
      status,
    };

    if (data) {
      const optionsMapCopy = [...optionsMap];

      optionsMapCopy[1].options = data;
      optionsMapCopy[1].optionsChangeIdentifer = changeIdentifier;
      obj.metadata = { optionsMap: optionsMapCopy };
    }

    return obj;
  });
  const handleFetchResource = useCallback(() => {
    if (!metadata && !disableOptionsLoad) {
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
    disableOptionsLoad,
    dispatch,
    metadata,
    options.commMetaPath,
  ]);

  useEffect(() => {
    if (!metadata && !disableOptionsLoad && handleFetchResource) {
      handleFetchResource();
    }
  }, [disableOptionsLoad, handleFetchResource, metadata]);

  const handleRefreshClick = () => {
    dispatch(
      actions.metadata.refresh(
        connectionId,
        options.commMetaPath || commMetaPath
      )
    );
  };

  return (
    <DynaTableView
      {...props}
      isLoading={status === 'requested'}
      metadata={metadata}
      shouldReset={!!metadata}
      optionsMap={optionsMap}
      value={computedValue}
      handleRefreshClickHandler={handleRefreshClick}
    />
  );
}
