import React, { useMemo } from 'react';
import { useSelectorMemo } from '../../../../hooks';
import { selectors } from '../../../../reducers';
import LoadResources from '../../../LoadResources';
import DynaSelect from '../DynaSelect';

export default function DynaAllIntegrations(props) {
  const integrations = useSelectorMemo(selectors.mkGetAllValidIntegrations);

  const options = useMemo(() => ([{items: integrations.map(({name, _id}) => ({label: name, value: _id}))}]), [integrations]);

  return (
    <LoadResources required resources="integrations">
      <DynaSelect
        {...props}
        skipSort
        options={options}
     />
    </LoadResources>
  );
}

