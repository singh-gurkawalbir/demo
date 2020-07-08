import React, { useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import DynaTableView from '../../DynaTableView/DynaTable';
import * as selectors from '../../../../../reducers';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import actions from '../../../../../actions';


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
  },
}));

export default function DynaSuiteScriptTable(props) {
  const dispatch = useDispatch();
  const {
    id,
    ssLinkedConnectionId,
    _integrationId: integrationId,
    extractFieldHeader,
    disabled,
    extracts,
    generates,
    generateFieldHeader,
    supportsExtractsRefresh,
    supportsGeneratesRefresh,
    onFieldChange,
    value,

  } = props;

  const classes = useStyles();

  const [shouldReset, setShouldReset] = useState(false);


  // get IntegrationAppName
  const integration = useSelector(state =>
    selectors.suiteScriptResource(state, {
      resourceType: 'integrations',
      id: integrationId,
      ssLinkedConnectionId,
    })
  );

  const getCommPath = useCallback((fieldId) =>
    `suitescript/connections/${ssLinkedConnectionId}/integrations/${integrationId}/settings/refreshMetadata?field=${id}&type=${fieldId}&isSVBConnector=${integration?.urlName === 'svbns'}`,
  [id, integration?.urlName, integrationId, ssLinkedConnectionId]);


  const handleRefreshClick = useCallback((field) => {
    dispatch(
      actions.metadata.refresh(
        ssLinkedConnectionId,
        getCommPath(field)
      )
    );
  }, [dispatch, ssLinkedConnectionId, getCommPath]);

  const { data: extractsRefresh, status: statusExtracts} = useSelectorMemo(selectors.makeOptionsFromMetadata, ssLinkedConnectionId,
    getCommPath('extracts'),
    'suiteScript-sObjects-field-options-extracts');
  const { data: generatesRefresh, status: statusGenerates} = useSelectorMemo(selectors.makeOptionsFromMetadata, ssLinkedConnectionId,
    getCommPath('generates'),
    'suiteScript-sObjects-field-options-generates');

  const isLoading = useMemo(() => ({
    extracts: statusExtracts === 'refreshed',
    generates: statusGenerates === 'refreshed'
  }), [statusExtracts, statusGenerates]);
  const optionsMap = useMemo(() => {
    setShouldReset(state => !state);
    return [
      {
        id: 'extracts',
        label: extractFieldHeader,
        name: extractFieldHeader,
        readOnly: disabled,
        required: true,
        type: 'autosuggest',
        options: extractsRefresh && extractsRefresh.length ? extractsRefresh : extracts,
        supportsRefresh: supportsExtractsRefresh,
      },
      {
        id: 'generates',
        label: generateFieldHeader,
        name: generateFieldHeader,
        readOnly: disabled,
        required: true,
        options: generatesRefresh && generatesRefresh.length ? generatesRefresh : generates,
        type: 'autosuggest',
        supportsRefresh: supportsGeneratesRefresh,
      },
    ];
  }, [extractFieldHeader, disabled, extractsRefresh,
    extracts, supportsExtractsRefresh, generateFieldHeader, generatesRefresh,
    generates, supportsGeneratesRefresh]);


  const handleMapChange = useCallback(
    (tableid, value = []) => {
      const mapValue = {};

      value.filter(Boolean).forEach(val => {
        mapValue[val.extracts] = val.generates;
      });
      onFieldChange(id, mapValue);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const computedValue = useMemo(() => Object.keys(value || {}).map(key => ({
    extracts: key,
    generates: value[key],
  })), [value]);

  return (

    <DynaTableView
      {...props}
      optionsMap={optionsMap}
      metadata={{optionsMap}}
      hideLabel
      isLoading={isLoading}
      shouldReset={shouldReset}
      className={classes.dynaStaticMapWidgetWrapper}
      value={computedValue}
      onFieldChange={handleMapChange}
      disableDeleteRows={disabled}
      handleRefreshClickHandler={handleRefreshClick}
      />);
}
