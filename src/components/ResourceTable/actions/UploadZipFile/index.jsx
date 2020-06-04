import React, { useState, useCallback } from 'react';
import UploadIcon from '../../../icons/UploadIcon';
import UploadFileDialog from './UploadFileDialog';

export default {
  label: 'Upload ZIP file',
  icon: UploadIcon,
  component: function UploadZipFile({ resourceType, rowData = {} }) {
    const { _id: resourceId } = rowData;
    const [showDialog, setShowDialog] = useState(true);
    const toggleDialog = useCallback(() => {
      setShowDialog(!showDialog);
    }, [showDialog]);

    return (
      <>
        {showDialog && (
          <UploadFileDialog
            resourceType={resourceType}
            fileType="application/zip"
            onClose={toggleDialog}
            type="Zip"
            resourceId={resourceId}
          />
        )}
      </>
    );
  },
};
