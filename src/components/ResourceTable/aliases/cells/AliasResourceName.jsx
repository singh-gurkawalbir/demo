import React from 'react';
import { Typography } from '@mui/material';
import { selectors } from '../../../../reducers';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { getResourceFromAlias } from '../../../../utils/resource';

export default function AliasResourceName({ alias }) {
  const { id, resourceType} = getResourceFromAlias(alias);

  const resource = useSelectorMemo(selectors.makeResourceSelector, resourceType, id);

  return (
    <Typography>{resource?.name}</Typography>
  );
}
