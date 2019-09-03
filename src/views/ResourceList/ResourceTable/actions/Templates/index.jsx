import { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import EditIcon from 'mdi-react/EditIcon';
import Icon from '../../../../../components/icons/HookIcon';
import UploadFileDialog from '../../../../../components/UploadFileDialog';
import actions from '../../../../../actions';

export const UploadZipFile = ({ resourceType, resource }) => {
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
        <EditIcon />
      </IconButton>
    </Fragment>
  );
};

export const Download = ({ resource }) => {
  const dispatch = useDispatch();
  const handleDownloadClick = () => {
    dispatch(actions.template.downloadZip(resource._id));
  };

  return (
    <IconButton size="small" onClick={handleDownloadClick}>
      <EditIcon />
    </IconButton>
  );
};

export const TogglePublish = ({ resourceType, resource }) => {
  const dispatch = useDispatch();
  const handleTogglePublishClick = () => {
    dispatch(actions.template.publish(resource, resourceType));
  };

  return (
    <IconButton size="small" onClick={handleTogglePublishClick}>
      {resource.published ? <Icon /> : <EditIcon />}
    </IconButton>
  );
};

export default {
  UploadZipFile,
  Download,
  TogglePublish,
};
