import React from 'react';
import { Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectors } from '../../reducers';

export default function ResourceName({resourceId}) {
  const resourceName = useSelector(state => {
    const exportResource = selectors.resource(state, 'exports', resourceId);

    if (exportResource?.name) {
      return exportResource.name;
    }
    const importResource = selectors.resource(state, 'imports', resourceId);

    if (importResource?.name) {
      return importResource.name;
    }
    const flowResource = selectors.resource(state, 'flows', resourceId);

    if (flowResource?.name) {
      return flowResource.name;
    }

    return '';
  });

  return (
    <Typography>{resourceName}</Typography>
  );
}
