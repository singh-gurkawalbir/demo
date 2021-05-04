import React, { useState, useCallback } from 'react';
import { useGetTableContext } from '../../../../CeligoTable/TableContext';
import UploadIcon from '../../../../icons/UploadIcon';
import UploadFileDialog from './UploadFileDialog';

export default {
  key: 'uploadTemplateZip',
  useLabel: () => 'Upload template zip',
  icon: UploadIcon,
  Component: ({rowData}) => {
    const { _id: resourceId } = rowData;
    const {resourceType} = useGetTableContext();
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
