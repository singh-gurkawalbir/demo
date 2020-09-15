import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { isNaN } from 'lodash';
import actions from '../../../../actions';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../../reducers';
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
    preferMapValueAsNum = false,
    onFieldChange,
    options = {},
  } = props;

  const handleFieldChange = useCallback((id, val) => {
    if (preferMapValueAsNum) {
      const formattedValue = val.map(item => {
        const formattedItem = {...item};
        const currVal = formattedItem[valueName];

        formattedItem[valueName] = isNaN(parseInt(currVal, 10)) ? currVal : parseInt(currVal, 10);

        return formattedItem;
      });

      onFieldChange(id, formattedValue);
    } else {
      onFieldChange(id, val);
    }
  }, [onFieldChange, preferMapValueAsNum, valueName]);

  const optionsMap = useMemo(() => ([
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
  ]), [keyLabel, keyName, valueLabel, valueName]);
  const computedValue = useMemo(() => {
    if (map && !value) {
      return Object.keys(map || {}).map(key => ({
        [keyName]: key,
        [valueName]: map[key],
      }));
    }

    return value;
  }, [keyName, map, value, valueName]);

  const disableOptionsLoad = options.disableFetch || disableFetch;
  const dispatch = useDispatch();

  const { status: refreshStatus, data: refreshMetadata, changeIdentifier } = useSelectorMemo(selectors.makeOptionsFromMetadata, connectionId,
    options.commMetaPath || commMetaPath,
    options.filterKey || filterKey);

  const { status, metadata } = useMemo(() => {
    const obj = {
      status: refreshStatus,
    };

    if (refreshMetadata) {
      const optionsMapCopy = [...optionsMap];

      optionsMapCopy[1].options = refreshMetadata;
      optionsMapCopy[1].optionsChangeIdentifer = changeIdentifier;
      obj.metadata = { optionsMap: optionsMapCopy };
    }

    return obj;
  }, [changeIdentifier, optionsMap, refreshMetadata, refreshStatus]);

  const isLoadingMap = useMemo(() => ({[valueName]: ['requested', 'refreshed'].includes(status)}), [status, valueName]);

  const onFetch = useCallback(() => {
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
    if (!metadata && !disableOptionsLoad && onFetch) {
      onFetch();
    }
  }, [disableOptionsLoad, onFetch, metadata]);

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
      isLoading={isLoadingMap}
      metadata={metadata}
      shouldReset={!!metadata}
      optionsMap={optionsMap}
      value={computedValue}
      onFieldChange={handleFieldChange}
      handleRefreshClickHandler={handleRefreshClick}
    />
  );
}
