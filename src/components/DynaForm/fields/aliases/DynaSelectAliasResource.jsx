import React, { useMemo } from 'react';
import { useSelectorMemo } from '../../../../hooks';
import { selectors } from '../../../../reducers';
import DynaSelect from '../DynaSelect';

export default function DynaSelectAliasResource({ options = {}, ...props}) {
  const { aliasResourceType, aliasContextResourceId, aliasContextResourceType } = options;
  const resourceList = useSelectorMemo(selectors.makeAliasResources, aliasResourceType, aliasContextResourceType, aliasContextResourceId);
  const selectOptions = useMemo(() => ([{
    items: resourceList.map(res => ({
      label: res.name,
      value: res._id,
    })),
  }]), [resourceList]);

  return (
    <DynaSelect {...props} options={selectOptions} />
  );
}
