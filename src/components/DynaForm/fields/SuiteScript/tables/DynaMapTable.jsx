import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../../actions';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import * as selectors from '../../../../../reducers';
import { BaseTableViewComponent } from './DynaSalesforceProductTable';

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
  } = props;

  const [shouldReset, setShouldReset] = useState(false);

  // get IntegrationAppName
  const integration = useSelector(state =>
    selectors.suiteScriptResource(state, {
      resourceType: 'integrations',
      id: integrationId,
      ssLinkedConnectionId,
    })
  );

  const getCommPath = useCallback(fieldId =>
    `suitescript/connections/${ssLinkedConnectionId}/integrations/${integrationId}/settings/refreshMetadata?field=${id}&type=${fieldId}&isSVBConnector=${integration?.urlName === 'svbns'}`,
  [id, integration?.urlName, integrationId, ssLinkedConnectionId]);

  const handleRefreshClick = useCallback(field => {
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
    generates: statusGenerates === 'refreshed',
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

  return (
    <BaseTableViewComponent
      {...props}
      optionsMap={optionsMap}
      hideLabel
      isLoading={isLoading}
      shouldReset={shouldReset}
      disableDeleteRows={disabled}
      handleRefreshClickHandler={handleRefreshClick}
      />
  );
}
