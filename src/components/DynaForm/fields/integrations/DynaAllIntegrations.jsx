import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import LoadResources from '../../../LoadResources';
import DynaSelect from '../DynaSelect';

export default function DynaAllIntegrations(props) {
  const integrations = useSelector(state => selectors.getAllValidIntegrations(state));

  const options = useMemo(() => ([{items: integrations.map(({name, _id}) => ({label: name, value: _id}))}]), [integrations]);

  return (
    <LoadResources required resources="integrations">
      <DynaSelect
        {...props}
        options={options}
     />
    </LoadResources>
  );
}

