import { IconButton } from '@mui/material';
import React, { useState, useCallback } from 'react';
import ViewReferencesIcon from '../../../../../components/icons/ViewReferencesIcon';
import ResourceReferences from '../../../../../components/ResourceReferences';

export default function References({ resourceType, rowData = {} }) {
  const { _id: resourceId } = rowData;
  const [show, setShow] = useState(false);
  const handleReferencesClose = useCallback(() => {
    setShow(false);
  }, []);
  const handleClick = useCallback(() => {
    setShow(true);
  }, []);

  return (
    <>
      {show && (
      <ResourceReferences
        resourceType={resourceType}
        resourceId={resourceId}
        onClose={handleReferencesClose}
          />
      )}
      <IconButton
        data-test="cancel"
        size="small"
        onClick={handleClick}>
        <ViewReferencesIcon />
      </IconButton>
    </>
  );
}
