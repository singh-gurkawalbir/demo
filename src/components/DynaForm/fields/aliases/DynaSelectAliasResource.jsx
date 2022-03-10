import React, { useMemo } from 'react';
import { useSelectorMemo } from '../../../../hooks';
import { selectors } from '../../../../reducers';
import DynaSelect from '../DynaSelect';

export default function DynaSelectAliasResource(props) {
  const { options } = props;
  const resourceList = useSelectorMemo(selectors.makeAliasResources, options?.resourceType, options?.parentResourceType, options?.parentResourceId) || [];
  const selectOptions = useMemo(() => ([{
    items: resourceList.map(res => ({
      label: res.name,
      value: res._id,
    })),
  }]), [options?.resourceType, resourceList]);

  return (
    <>
      <DynaSelect {...props} options={selectOptions} />
    </>
  );
}
