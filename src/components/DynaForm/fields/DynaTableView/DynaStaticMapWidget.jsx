import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { Divider, makeStyles } from '@material-ui/core';
import actions from '../../../../actions';
import RadioGroup from '../radiogroup/DynaRadioGroup';
import DynaSelect from '../DynaSelect';
import { selectors } from '../../../../reducers';
import DynaTableView from './DynaTable';
import { makeExportResource } from '../../../../utils/exportData';

const useStyles = makeStyles(theme => ({
  margin: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  dynaStaticMapWidgetWrapper: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    padding: theme.spacing(2, 3),
    background: theme.palette.background.default,
  },
}));

const isExportRefresh = (supportsRefresh, staticLength, kind, key, exportResource) => !!(supportsRefresh && !staticLength && kind && key && exportResource);

export default function DynaStaticMapWidget(props) {
  const {
    id,
    _integrationId,
    extracts = [],
    map = {},
    defaultValue,
    onFieldChange,
    hideLookupAllowFailures,
    generates = [],
    extractFieldHeader,
    generateFieldHeader,
    supportsExtractsRefresh,
    supportsGeneratesRefresh,
    resourceContext,
    extractResource,
    generateResource,
  } = props;
  const classes = useStyles();
  const [allowFailures, setAllowFailures] = useState(props.allowFailures);
  const [defaultVal, setDefaultVal] = useState(defaultValue);
  const [initComplete, setInitComplete] = useState(false);
  const [showDefault, setShowDefault] = useState(false);
  const getRadioValue = ({ allowFailures, defaultValue }) => {
    if (allowFailures) {
      if (defaultValue) {
        return 'defaultLookup';
      } if (defaultValue === null) {
        return 'useNull';
      } if (defaultValue === '') {
        return 'useEmptyString';
      }
    }

    return 'allowFailures';
  };

  const [radioState, setRadioState] = useState(
    getRadioValue({ allowFailures, defaultValue: defaultVal })
  );

  const resourceType = resourceContext?.resourceType;
  const resourceId = resourceContext?.resourceId;
  const { _connectionId: resConnectionId, _connectorId: resConnectorId } = useSelector(state => (selectors.resource(state, resourceType, resourceId) || {}));
  const { kind: eKind, key: eKey, exportResource: eExportResource } = makeExportResource(extractResource, resConnectionId, resConnectorId);
  const { kind: gKind, key: gKey, exportResource: gExportResource } = makeExportResource(generateResource, resConnectionId, resConnectorId);
  const { status: eStatus, data: eData } = useSelector(state => selectors.exportData(state, eKey));
  const { status: gStatus, data: gData } = useSelector(state => selectors.exportData(state, gKey));

  const dispatch = useDispatch();

  useEffect(() => {
    if (!initComplete) {
      if (isExportRefresh(supportsExtractsRefresh, extracts.length, eKind, eKey, eExportResource)) {
        dispatch(actions.exportData.request(eKind, eKey, eExportResource));
      }
      if (isExportRefresh(supportsGeneratesRefresh, generates.length, gKind, gKey, gExportResource)) {
        dispatch(actions.exportData.request(gKind, gKey, gExportResource));
      }
      onFieldChange(id, { map, default: defaultVal, allowFailures }, true);
      setInitComplete(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowFailures, defaultVal, id, initComplete, map]);
  const computedValue = Object.keys(map || {}).map(key => ({
    extracts: key,
    generates: map[key],
  }));

  const eOptions = ((Array.isArray(extracts) && extracts.length && extracts) || (eData?.length && eData) || []).filter(Boolean);
  const gOptions = ((Array.isArray(generates) && generates.length && generates) || (gData?.length && gData) || []).filter(Boolean);

  const optionsMap = [{
    id: 'extracts',
    label: extractFieldHeader,
    name: extractFieldHeader,
    required: true,
    type: eOptions.length ? 'autosuggest' : 'input',
    options: eOptions,
    supportsRefresh: supportsExtractsRefresh,
  }, {
    id: 'generates',
    label: generateFieldHeader,
    name: generateFieldHeader,
    required: true,
    options: gOptions,
    type: gOptions.length ? 'autosuggest' : 'input',
    supportsRefresh: supportsGeneratesRefresh,
  }];

  const { isLoading: isMetadataLoading, shouldReset, data: metadata } = useSelector(state => selectors.connectorMetadata(state, id, null, _integrationId, optionsMap));

  let defaultOptions = optionsMap[1].options;
  // TODO: useMemo for the below code

  if (!isExportRefresh(supportsGeneratesRefresh, generates.length, gKind, gKey, gExportResource) && metadata) {
    metadata.optionsMap = [...optionsMap];
    metadata.optionsMap[0].options = metadata.extracts;
    metadata.optionsMap[1].options = metadata.generates;
    defaultOptions = metadata.generates.filter(Boolean);
  }

  const handleRefreshClick = useCallback(column => {
    if (column === 'extracts' && isExportRefresh(supportsExtractsRefresh, extracts.length, eKind, eKey, eExportResource)) {
      dispatch(actions.exportData.request(eKind, eKey, eExportResource));
    } else if (column === 'generates' && isExportRefresh(supportsGeneratesRefresh, generates.length, gKind, gKey, gExportResource)) {
      dispatch(actions.exportData.request(gKind, gKey, gExportResource));
    } else {
      dispatch(actions.connectors.refreshMetadata(column, id, _integrationId));
    }
  },
  [_integrationId, dispatch, eExportResource, eKey, eKind, extracts.length, gExportResource, gKey, gKind, generates.length, id, supportsExtractsRefresh, supportsGeneratesRefresh]
  );

  const handleMapChange = useCallback(
    (tableid, value = []) => {
      const mapValue = {};

      value.filter(Boolean).forEach(val => {
        mapValue[val.extracts] = val.generates;
      });
      onFieldChange(id, {
        map: mapValue,
        default: defaultVal,
        allowFailures,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allowFailures, defaultVal]
  );

  const handleCleanup = useCallback(() => {
    dispatch(actions.connectors.clearMetadata(id, _integrationId));
  }, [_integrationId, dispatch, id]);
  const handleAllowFailuresClick = (radioId, value) => {
    setRadioState(value);
    setAllowFailures(value !== 'allowFailures');
    let defValue = defaultVal;

    if (value === 'useEmptyString') {
      defValue = '';
    } else if (value === 'useNull') {
      defValue = null;
    } else if (value === 'allowFailures') {
      defValue = undefined;
    }

    onFieldChange(id, {
      map,
      default: defValue,
      allowFailures: value !== 'allowFailures',
    });
  };

  if (showDefault !== (radioState === 'defaultLookup')) setShowDefault(radioState === 'defaultLookup');

  const handleDefaultValueChange = (defaultId, val) => {
    setDefaultVal(val);
    onFieldChange(id, { map, default: val, allowFailures });
  };

  const isLoadingMap = useMemo(() => ({
    [optionsMap[0].id]: optionsMap[0].supportsRefresh && eStatus === 'requested',
    [optionsMap[1].id]: optionsMap[1].supportsRefresh && (gStatus === 'requested' || isMetadataLoading),
  }), [eStatus, gStatus, isMetadataLoading, optionsMap]);

  return (
    <>
      <DynaTableView
        {...props}
        optionsMap={optionsMap}
        isLoading={isLoadingMap}
        hideLabel
        className={classes.dynaStaticMapWidgetWrapper}
        shouldReset={shouldReset}
        metadata={metadata}
        value={computedValue}
        onFieldChange={handleMapChange}
        handleRefreshClickHandler={handleRefreshClick}
        handleCleanupHandler={handleCleanup}
      />
      <Divider className={classes.margin} />
      {!hideLookupAllowFailures && (
        <>
          <RadioGroup
            {...props}
            value={radioState}
            id="allowFailures"
            label="Action to take if unique match not found"
            onFieldChange={handleAllowFailuresClick}
            showOptionsVertically
            options={[
              {
                items: [
                  { label: 'Fail Record', value: 'allowFailures' },
                  {
                    label: 'Use Empty String as Default Value',
                    value: 'useEmptyString',
                  },
                  { label: 'Use Null as Default Value', value: 'useNull' },
                  {
                    label: 'Use Custom Default Value',
                    value: 'defaultLookup',
                  },
                ],
              },
            ]}
          />
          {showDefault && (
            <DynaSelect
              label="Default Lookup Value"
              name="defaultValue"
              onFieldChange={handleDefaultValueChange}
              value={defaultVal}
              options={[{ items: defaultOptions }]}
            />
          )}
        </>
      )}
    </>
  );
}
