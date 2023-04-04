import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Spinner } from '@celigo/fuse-ui';
import CeligoTable from '../../../../../CeligoTable';
import metadata from './metadata';
import DynaSelect from '../../../DynaSelect';
import { selectors } from '../../../../../../reducers';
import actions from '../../../../../../actions';
import useSelectorMemo from '../../../../../../hooks/selectors/useSelectorMemo';
import { camelCase } from '../../../../../../utils/string';
import customCloneDeep from '../../../../../../utils/customCloneDeep';

// view only component

export default function DynaSalesUser(props) {
  const {id, field: fieldId, _integrationId: integrationId, ssLinkedConnectionId, sectionId, isLoggable} = props;
  const dispatch = useDispatch();
  const commMetaPath = `suitescript/connections/${ssLinkedConnectionId}/integrations/${integrationId}/settings/refreshMetadata?field=${sectionId}.${camelCase(id)}&type=${fieldId}`;

  const { data, status } = useSelectorMemo(selectors.makeOptionsFromMetadata, ssLinkedConnectionId, commMetaPath, 'raw');

  useEffect(() => {
    dispatch(
      actions.metadata.request(
        ssLinkedConnectionId,
        commMetaPath,
      ));
  },
  [commMetaPath, dispatch, ssLinkedConnectionId]);

  const profiles = data?.profiles;
  const users = data?.users;
  const generatedSalesforceSubsidiaryFieldOptions = useMemo(() => profiles && [{items: profiles.map(([value, label]) => ({label, value}))}],
    [profiles]);

  const [option, selectOption] = useState('');

  const filteredResults = useMemo(() => users && users?.filter(user => !option ? true : option === user?.profile), [option, users]);

  if (status !== 'received') { return (<Spinner />); }

  return (
    <>
      {profiles && (
      <DynaSelect
        isLoggable={isLoggable}
        value={option}
        placeholder="--All--"
        onFieldChange={(id, value) => selectOption(value)}
        options={generatedSalesforceSubsidiaryFieldOptions}
        label="Select Salesforce Profile" />
      )}
      <CeligoTable
        data={customCloneDeep(filteredResults)}
        {...metadata}
    />
    </>
  );
}
