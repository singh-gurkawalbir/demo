import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../../reducers';
import { DynaGenericSelect } from '../DynaRefreshableSelect/RefreshGenericResource';

export default function DynaSalesforceSelectOptionsGenerator(props) {
  const {
    id, field: fieldId,
    sectionId,
    ssLinkedConnectionId,
    _integrationId: integrationId,
    options: defaultFieldOptions,

  } = props;
  const commMetaPath = `suitescript/connections/${ssLinkedConnectionId}/integrations/${integrationId}/settings/refreshMetadata?field=${sectionId}.${id}&type=${fieldId}`;

  const dispatch = useDispatch();

  const { data, status, errorMessage } = useSelectorMemo(selectors.makeOptionsFromMetadata, ssLinkedConnectionId, commMetaPath, 'suitescript-settings-options');

  const onRefresh = useCallback(() =>
    dispatch(actions.metadata.request(ssLinkedConnectionId, commMetaPath)), [commMetaPath, dispatch, ssLinkedConnectionId], []);

  const options = useMemo(() => data || defaultFieldOptions?.[0]?.items || [], [data, defaultFieldOptions]);

  return (
    <DynaGenericSelect
      {...props}
      onRefresh={onRefresh}
      fieldStatus={status || 'received'}
      fieldData={options}
      fieldError={errorMessage}
    />
  );
}
