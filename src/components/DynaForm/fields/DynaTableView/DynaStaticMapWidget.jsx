import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useState, useEffect } from 'react';
import {
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
  ExpansionPanel,
  Divider,
  makeStyles,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import actions from '../../../../actions';
import RadioGroup from '../../../../components/DynaForm/fields/DynaRadioGroup';
import DynaSelect from '../../../../components/DynaForm/fields/DynaSelect';
import * as selectors from '../../../../reducers';
import DynaTableView from './DynaTable';

const useStyles = makeStyles(() => ({
  margin: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  flexColumn: {
    flexDirection: 'column',
  },
}));

export default function DynaStaticMapWidget(props) {
  const {
    id,
    _integrationId,
    title,
    extracts = [],
    map = {},
    defaultValue,
    onFieldChange,
    generates = [],
    extractFieldHeader,
    generateFieldHeader,
    supportsExtractsRefresh,
    supportsGeneratesRefresh,
  } = props;
  const classes = useStyles();
  const [allowFailures, setAllowFailures] = useState(props.allowFailures);
  const [defaultVal, setDefaultVal] = useState(defaultValue);
  const [initComplete, setInitComplete] = useState(false);
  const [shouldExpand, setShouldExpand] = useState(false);
  const [showDefault, setShowDefault] = useState(false);
  const getRadioValue = ({ allowFailures, defaultValue }) => {
    if (allowFailures) {
      if (defaultValue) {
        return 'defaultLookup';
      } else if (defaultValue === null) {
        return 'useNull';
      } else if (defaultValue === '') {
        return 'useEmptyString';
      }
    }

    return 'allowFailures';
  };

  const [radioState, setRadioState] = useState(
    getRadioValue({ allowFailures, defaultValue: defaultVal })
  );

  useEffect(() => {
    if (!initComplete) {
      onFieldChange(id, { map, default: defaultVal, allowFailures });
      setInitComplete(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowFailures, defaultVal, id, initComplete, map]);

  const computedValue = Object.keys(map || {}).map(key => ({
    extracts: key,
    generates: map[key],
  }));
  const dispatch = useDispatch();
  const optionsMap = [
    {
      id: 'extracts',
      label: extractFieldHeader,
      name: extractFieldHeader,
      required: true,
      type: extracts.length ? 'select' : 'input',
      options: extracts,
      supportsRefresh: supportsExtractsRefresh,
    },
    {
      id: 'generates',
      label: generateFieldHeader,
      name: generateFieldHeader,
      required: true,
      options: generates,
      type: generates.length ? 'select' : 'input',
      supportsRefresh: supportsGeneratesRefresh,
    },
  ];
  const { isLoading, shouldReset, data: metadata } = useSelector(state =>
    selectors.connectorMetadata(state, id, null, _integrationId, optionsMap)
  );
  let defaultOptions = generates.filter(Boolean).map(val => ({
    value: val.id,
    label: val.text,
  }));

  if (metadata) {
    metadata.optionsMap = [...optionsMap];
    metadata.optionsMap[0].options = metadata.extracts;
    metadata.optionsMap[1].options = metadata.generates;
    defaultOptions = metadata.generates.filter(Boolean).map(val => ({
      value: val.id,
      label: val.text,
    }));
  }

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

  if (showDefault !== (radioState === 'defaultLookup'))
    setShowDefault(radioState === 'defaultLookup');

  const handleDefaultValueChange = (defaultId, val) => {
    setDefaultVal(val);
    onFieldChange(id, { map, default: val, allowFailures });
  };

  return (
    <ExpansionPanel
      // eslint-disable-next-line react/no-array-index-key
      expanded={shouldExpand}>
      <ExpansionPanelSummary
        data-test={title}
        onClick={() => setShouldExpand(expand => !expand)}
        expandIcon={<ExpandMoreIcon />}>
        <Typography>{title}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.flexColumn}>
        <DynaTableView
          {...props}
          optionsMap={optionsMap}
          isLoading={isLoading}
          hideLabel
          shouldReset={shouldReset}
          metadata={metadata}
          value={computedValue}
          onFieldChange={handleMapChange}
          handleRefreshClickHandler={handleRefreshClick}
          handleCleanupHandler={handleCleanup}
        />
        <Divider className={classes.margin} />
        <RadioGroup
          {...props}
          value={radioState}
          id="allowFailures"
          label="Action to take if unique match not found"
          onFieldChange={handleAllowFailuresClick}
          options={[
            {
              items: [
                { label: `Fail Record`, value: 'allowFailures' },
                {
                  label: `Use Empty String as Default Value`,
                  value: 'useEmptyString',
                },
                { label: `Use Null as Default Value`, value: 'useNull' },
                {
                  label: `Use Custom Default Value`,
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
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}
