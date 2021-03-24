import React, { useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {useResetWhenParentIntegrationChanges} from './hooks';
import { useSelectorMemo } from '../../../../hooks';
import { selectors } from '../../../../reducers';
import LoadResources from '../../../LoadResources';
import DynaMultiSelect from '../DynaMultiSelect';

const selectAll = {
  label: 'Select All',
  value: 'selectAll',
};

export default function DynaChildIntegrations(props) {
  const {formKey, id, onFieldChange, value, label} = props;

  const selectedIntegration = useSelector(state => selectors.formState(state, formKey)?.fields?.integration?.value);

  const childIntegrations = useSelectorMemo(selectors.mkGetChildIntegrations, selectedIntegration);

  useResetWhenParentIntegrationChanges(formKey, 'integration', onFieldChange, id);
  const childIntegrationsStoreLabel = useSelector(state => selectors.integrationAppSettings(state, selectedIntegration)?.settings?.storeLabel);
  const isParentChildIntegration = useSelector(state => selectors.isParentChildIntegration(state, selectedIntegration));

  useEffect(() => {
    // when the users select's all flows then all flows are selected
    if (value && value.includes(selectAll.value)) {
      onFieldChange(id, childIntegrations.map(({ value}) => value), true);
    }
  }, [childIntegrations, id, onFieldChange, value]);
  const options = useMemo(() => {
    if (childIntegrations?.length) {
      return [{items: ([selectAll, ...childIntegrations]?.map(val => ({
        label: val.label,
        value: val.value,
      })))}];
    }

    return [{items: []}];
  },

  [childIntegrations]);

  if (!isParentChildIntegration) { return null; }

  return (
    <LoadResources required resources="integrations">
      <DynaMultiSelect
        {...props}
        label={(childIntegrationsStoreLabel && `${childIntegrationsStoreLabel}s`) || label}
        options={options}
     />
    </LoadResources>
  );
}

