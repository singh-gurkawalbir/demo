import { Fragment, useState } from 'react';
import { IconButton } from '@material-ui/core';
import UploadIcon from '../../../../../../components/icons/ArrowUpIcon';
import UploadFileDialog from '../../../../../../components/UploadFileDialog';

export default {
  label: 'Upload Zip File',
  component: function UploadZipFile({ resourceType, resource }) {
    const [showUpoadFileDialog, setShowUploadFileDialog] = useState(false);
    const handleUploadZipFileClick = () => {
      setShowUploadFileDialog(true);
    };

    const handleUploadFileDialogClose = () => {
      setShowUploadFileDialog(false);
    };

    return (
      <Fragment>
        {showUpoadFileDialog && (
          <UploadFileDialog
            resourceType={resourceType}
            fileType="application/zip"
            onClose={handleUploadFileDialogClose}
            type="Zip"
            resourceId={resource._id}
          />
        )}
        <IconButton size="small" onClick={handleUploadZipFileClick}>
          <UploadIcon />
        </IconButton>
      </Fragment>
    );
  },
};
