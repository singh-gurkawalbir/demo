import React from 'react';
import PopulateWithPreviewData from '../../../../PopulateWithPreviewData';

export default function CollapsedComponentActions({
  actionId,
  formKey,
  flowId,
  resourceType,
  resourceId,
}) {
  switch (actionId) {
    case 'mockOutput':
    case 'mockResponse':
      return (
        <PopulateWithPreviewData
          flowId={flowId}
          formKey={formKey}
          resourceType={resourceType}
          resourceId={resourceId}
        />
      );
    default:
      return null;
  }
}
