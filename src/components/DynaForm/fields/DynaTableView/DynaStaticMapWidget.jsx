import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { Divider } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import actions from '../../../../actions';
import RadioGroup from '../radiogroup/DynaRadioGroup';
import DynaSelect from '../DynaSelect';
import { selectors } from '../../../../reducers';
import DynaTableView from './DynaTable';

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
    isLoggable,
  } = props;
  const classes = useStyles();
  const [allowFailures, setAllowFailures] = useState(props.allowFailures);
  const [defaultVal, setDefaultVal] = useState(defaultValue);
  const [showDefault, setShowDefault] = useState(false);

  const [radioState, setRadioState] = useState(
    getRadioValue({ allowFailures, defaultValue: defaultVal })
  );

  useEffect(() => {
    onFieldChange(id, { map, default: defaultVal, allowFailures }, true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const computedValue = useMemo(() => Object.keys(map || {}).map(key => ({
    extracts: key,
    generates: map[key],
  })), [map]);
  const dispatch = useDispatch();
  const optionsMap = useMemo(() => [
    {
      id: 'extracts',
      label: extractFieldHeader,
      name: extractFieldHeader,
      required: true,
      type: extracts.length ? 'autosuggest' : 'input',
      multiline: false,
      // extracts can be a string we have safely type cast it to an array
      options: Array.isArray(extracts) ? extracts : [],
      supportsRefresh: supportsExtractsRefresh,
    },
    {
      id: 'generates',
      label: generateFieldHeader,
      name: generateFieldHeader,
      required: true,
      options: Array.isArray(generates) ? generates : [],
      multiline: false,
      type: generates.length ? 'autosuggest' : 'input',
      supportsRefresh: supportsGeneratesRefresh,
    },
  ], [extractFieldHeader, extracts, generateFieldHeader, generates, supportsExtractsRefresh, supportsGeneratesRefresh]);
  const { isLoading, shouldReset, data, fieldType } = useSelector(
    state =>
      selectors.connectorMetadata(state, id, null, _integrationId, optionsMap)
  );
  const defaultOptions = useMemo(() => {
    if (data && Array.isArray(data.generates)) {
      return data.generates.filter(Boolean).map(val => ({
        value: val.id,
        label: val.text,
      }));
    }

    return Array.isArray(generates) ? generates.filter(Boolean).map(val => ({
      value: val.id,
      label: val.text,
    })) : [];
  }, [data, generates]);

  const metadata = useMemo(() => {
    if (!data) { return data; }

    const updatedData = {...data, optionsMap: [...optionsMap] };

    updatedData.optionsMap[0] = {...updatedData.optionsMap[0], options: data.extracts};
    updatedData.optionsMap[1] = {...updatedData.optionsMap[1], options: data.generates};

    return updatedData;
  }, [data, optionsMap]);

  const handleRefreshClick = useCallback(
    fieldId => {
      dispatch(actions.connectors.refreshMetadata(fieldId, id, _integrationId));
    },
    [_integrationId, dispatch, id]
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
  const handleAllowFailuresClick = useCallback((radioId, value) => {
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
  }, [defaultVal, id, map, onFieldChange]);

  useEffect(() => {
    if (showDefault !== (radioState === 'defaultLookup')) setShowDefault(radioState === 'defaultLookup');
  }, [radioState, showDefault]);

  const handleDefaultValueChange = useCallback((defaultId, val) => {
    setDefaultVal(val);
    onFieldChange(id, { map, default: val, allowFailures });
  }, [allowFailures, id, map, onFieldChange]);

  const isLoadingMap = useMemo(() => ({[fieldType]: isLoading}), [fieldType, isLoading]);

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
              isLoggable={isLoggable}
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
