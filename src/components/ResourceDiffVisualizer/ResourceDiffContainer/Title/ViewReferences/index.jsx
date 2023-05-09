import React, { useState } from 'react';
import { TextButton } from '@celigo/fuse-ui';
import ViewReferencesIcon from '../../../../icons/ViewReferencesIcon';
import ReferencesModal from './ReferencesModal';

export default function ViewReferences({ resourceId, resourceType, integrationId }) {
  const [showReferences, setShowReferences] = useState(false);
  const handleClick = () => {
    setShowReferences(showReferences => !showReferences);
  };

  const handleClose = () => setShowReferences(false);

  return (
    <>
      <TextButton
        size="large"
        data-test="expandAll"
        onClick={handleClick}
        startIcon={<ViewReferencesIcon />}>
        References
      </TextButton>
      { showReferences && (
        <ReferencesModal
          resourceId={resourceId}
          integrationId={integrationId}
          resourceType={resourceType}
          onClose={handleClose}
        />
      )}
    </>
  );
}

