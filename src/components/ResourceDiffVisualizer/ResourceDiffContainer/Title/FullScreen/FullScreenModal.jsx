import React from 'react';
import ModalDialog from '../../../../ModalDialog';

export default function FullScreenModal({resourceType, resourceDiff}) {
  return (
    <ModalDialog show>
      <span>Diff</span>
      <div> {JSON.stringify(resourceDiff)}, { resourceType } </div>
    </ModalDialog>
  );
}
