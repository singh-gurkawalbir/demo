import { Fragment, useState, useCallback } from 'react';
import { IconButton } from '@material-ui/core';
import UploadIcon from '../../../../components/icons/UploadIcon';
import UploadFileDialog from './UploadFileDialog';

export default {
  label: 'Upload ZIP File',
  component: function UploadZipFile({ resourceType, resource }) {
    const [showDialog, setShowDialog] = useState(false);
    const toggleDialog = useCallback(() => {
      setShowDialog(!showDialog);
    }, [showDialog]);

    return (
      <Fragment>
        {showDialog && (
          <UploadFileDialog
            resourceType={resourceType}
            fileType="application/zip"
            onClose={toggleDialog}
            type="Zip"
            resourceId={resource._id}
          />
        )}
        <IconButton
          data-test="toggleUploadZipFileModal"
          size="small"
          onClick={toggleDialog}>
          <UploadIcon />
        </IconButton>
      </Fragment>
    );
  },
};
