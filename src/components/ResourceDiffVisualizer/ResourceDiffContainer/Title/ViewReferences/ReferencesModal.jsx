import React from 'react';
import ModalDialog from '../../../../ModalDialog';

export default function ReferencesModal({ resourceId, resourceType }) {
  return (
    <ModalDialog show>
      <span>Diff</span>
      <div> {resourceId}, { resourceType } </div>
    </ModalDialog>
  );
}
