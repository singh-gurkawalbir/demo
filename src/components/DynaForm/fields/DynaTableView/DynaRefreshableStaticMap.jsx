import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isNaN } from 'lodash';
import actions from '../../../../actions';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../../reducers';
import DynaTableView from './DynaTable';
import { makeExportResource } from '../../../../utils/exportData';

const isExportRefresh = (kind, key, exportResource) => !!(kind && key && exportResource);

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
    resourceContext,
    keyResource,
    valueResource,
  } = props;
  const dispatch = useDispatch();
  const [initComplete, setInitComplete] = useState(false);
  const resourceType = resourceContext?.resourceType;
  const resourceId = resourceContext?.resourceId;
  const { _connectionId: resConnectionId, _connectorId: resConnectorId } = useSelector(state => (selectors.resource(state, resourceType, resourceId) || {}));
  const { kind: eKind, key: eKey, exportResource: eExportResource } = useMemo(() => makeExportResource(keyResource, resConnectionId, resConnectorId), [keyResource, resConnectionId, resConnectorId]);
  const { kind: gKind, key: gKey, exportResource: gExportResource } = useMemo(() => makeExportResource(valueResource, resConnectionId, resConnectorId), [resConnectionId, resConnectorId, valueResource]);

  const { status: eStatus, data: eData } = useSelector(state => selectors.exportData(state, eKey));
  const { status: gStatus, data: gData } = useSelector(state => selectors.exportData(state, gKey));

  const disableOptionsLoad = options.disableFetch || disableFetch;

  const { status: refreshStatus, data: refreshMetadata, changeIdentifier } = useSelectorMemo(selectors.makeOptionsFromMetadata, connectionId,
    options.commMetaPath || commMetaPath,
    options.filterKey || filterKey);

  const eOptions = ((eData?.length && eData) || []).filter(Boolean);
  const gOptions = ((gData?.length && gData) || []).filter(Boolean);

  const optionsMap = useMemo(() => [{
    id: keyName,
    label: keyLabel,
    required: true,
    options: eOptions,
    type: eOptions.length ? 'autosuggest' : 'input',
    supportsRefresh: isExportRefresh(eKind, eKey, eExportResource),
  }, {
    id: valueName,
    label: valueLabel,
    required: true,
    type: 'autosuggest',
    optionsChangeIdentifer: 0,
    options: gOptions,
    supportsRefresh: !!connectionId || !!isExportRefresh(gKind, gKey, gExportResource),
  }], [connectionId, eExportResource, eKey, eKind, eOptions, gExportResource, gKey, gKind, gOptions, keyLabel, keyName, valueLabel, valueName]);

  const metadata = useMemo(() => {
    if (isExportRefresh(gKind, gKey, gExportResource)) return {optionsMap};
    if (refreshMetadata) {
      const optionsMapCopy = [...optionsMap];

      optionsMapCopy[1].options = refreshMetadata;
      optionsMapCopy[1].optionsChangeIdentifer = changeIdentifier;

      return { optionsMap: optionsMapCopy };
    }
  }, [changeIdentifier, gExportResource, gKey, gKind, optionsMap, refreshMetadata]);

  const isLoadingMap = useMemo(() => ({
    [optionsMap[0].id]: optionsMap[0].supportsRefresh && eStatus === 'requested',
    [optionsMap[1].id]: optionsMap[1].supportsRefresh && (gStatus === 'requested' || refreshStatus === 'requested' || refreshStatus === 'refreshed'),
  }), [eStatus, gStatus, optionsMap, refreshStatus]);

  const computedValue = useMemo(() => {
    if (map && !value) {
      return Object.keys(map || {}).map(key => ({
        [keyName]: key,
        [valueName]: map[key],
      }));
    }

    return value;
  }, [keyName, map, value, valueName]);

  const handleRefreshClick = column => {
    if (column === keyName && isExportRefresh(eKind, eKey, eExportResource)) {
      dispatch(actions.exportData.request(eKind, eKey, eExportResource));
    } else if (column === valueName && isExportRefresh(gKind, gKey, gExportResource)) {
      dispatch(actions.exportData.request(gKind, gKey, gExportResource));
    } else {
      dispatch(
        actions.metadata.refresh(
          connectionId,
          options.commMetaPath || commMetaPath,
          {refreshCache: true}
        )
      );
    }
  };

  const handleFieldChange = useCallback((id, val) => {
    if (!preferMapValueAsNum) {
      onFieldChange(id, val);
    } else {
      const formattedValue = val.map(item => {
        const formattedItem = {...item};
        const currVal = formattedItem[valueName];

        formattedItem[valueName] = isNaN(parseInt(currVal, 10)) ? currVal : parseInt(currVal, 10);

        return formattedItem;
      });

      onFieldChange(id, formattedValue);
    }
  }, [onFieldChange, preferMapValueAsNum, valueName]);

  useEffect(() => {
    if (!initComplete) {
      if (isExportRefresh(eKind, eKey, eExportResource)) {
        dispatch(actions.exportData.request(eKind, eKey, eExportResource));
      }
      if (isExportRefresh(gKind, gKey, gExportResource)) {
        dispatch(actions.exportData.request(gKind, gKey, gExportResource));
      } else if (!metadata && !disableOptionsLoad) {
        dispatch(
          actions.metadata.request(
            connectionId,
            options.commMetaPath || commMetaPath
          )
        );
      }
      setInitComplete(true);
    }
  }, [commMetaPath, connectionId, disableOptionsLoad, dispatch, eExportResource, eKey, eKind, gExportResource, gKey, gKind, initComplete, metadata, options.commMetaPath]);

  return (
    <DynaTableView
      {...props}
      isLoading={isLoadingMap}
      metadata={metadata}
      shouldReset={metadata}
      optionsMap={optionsMap}
      value={computedValue}
      onFieldChange={handleFieldChange}
      handleRefreshClickHandler={handleRefreshClick}
    />
  );
}
