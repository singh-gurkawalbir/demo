import React, { useState } from 'react';
import ViewReferencesIcon from '../../../../icons/ViewReferencesIcon';
import ReferencesModal from './ReferencesModal';
import TextButton from '../../../../Buttons/TextButton';

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

