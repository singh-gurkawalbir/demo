import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Spinner from '../../../../../Spinner';
import CeligoTable from '../../../../../CeligoTable';
import metadata from './metadata';
import DynaSelect from '../../../DynaSelect';
import * as selectors from '../../../../../../reducers';
import actions from '../../../../../../actions';
import useSelectorMemo from '../../../../../../hooks/selectors/useSelectorMemo';

// view only component
const camelCase = (str) => str.charAt(0).toLowerCase() + str.slice(1);
export default function DynaSalesUser(props) {
  const {id, field: fieldId, _integrationId: integrationId, ssLinkedConnectionId, sectionId} = props;
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
      {profiles && <DynaSelect
        value={option}
        placeholder="--All--"
        onFieldChange={(id, value) => selectOption(value)}
        options={generatedSalesforceSubsidiaryFieldOptions}
        label="Select Salesforce Profile" />}
      <CeligoTable
        data={filteredResults}
        {...metadata}
    />
    </>
  );
}
