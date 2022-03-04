import React from 'react';
import { Typography } from '@material-ui/core';
import { selectors } from '../../../../reducers';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';

export default function AliasResourceName({ id, resourceType }) {
  const resource = useSelectorMemo(selectors.makeResourceSelector, resourceType, id);

  return (
    <>
      <Typography>{resource?.name}</Typography>
    </>
  );
}
