import React, { useState} from 'react';
import { useDispatch } from 'react-redux';
import {
  Button,
} from '@mui/material';
import CeligoTable from '../CeligoTable';
import actions from '../../actions';
import ModalDialog from '../ModalDialog';

const isDownloadButtonDisabled = selected => {
  const selectedFileIds = Object.keys(selected).filter(
    key => selected[key] === true
  );
  const disabled = selectedFileIds.length === 0;

  return disabled;
};

const useColumns = () => [{ key: 'name',
  heading: 'Name',
  isLoggable: true,
  Value: ({rowData: r}) => r.name }];

export default function JobFilesDownloadDialog({
  job,
  onCloseClick,
}) {
  const [selected, setSelected] = useState({});

  const isDisabled = isDownloadButtonDisabled(selected);
  const dispatch = useDispatch();
  const handleSelectChange = fileIds => {
    setSelected(fileIds);
  };

  const handleDownloadClick = () => {
    const fileIds = Object.keys(selected).filter(key => selected[key] === true);

    dispatch(
      actions.job.downloadFiles({
        jobId: job._id,
        fileIds,
      })
    );
    onCloseClick();
  };

  return (
    <ModalDialog
      show
      onClose={onCloseClick}
      data-test="closeJobFilesDownloadDialog"
      maxWidth={false}>
      <div>Download files</div>
      <div>
        <CeligoTable
          data={job.files.map(file => ({ ...file, _id: file.id }))}
          useColumns={useColumns}
          onSelectChange={handleSelectChange}
          selectableRows
        />
      </div>
      <div>
        <Button
          data-test="downloadJobFiles"
          disabled={isDisabled}
          variant="outlined"
          color="primary"
          onClick={handleDownloadClick}>
          Download
        </Button>
      </div>
    </ModalDialog>
  );
}
