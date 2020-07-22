import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button,
} from '@material-ui/core';
import CeligoTable from '../CeligoTable';
import actions from '../../actions';
import ModalDialog from '../ModalDialog';


export default function JobFilesDownloadDialog({
  job,
  onCloseClick,
}) {
  const [selected, setSelected] = useState({});
  const [downloadButtonState, setDownloadButtonState] = useState({
    disabled: true,
  });

  useEffect(() => {
    const selectedFileIds = Object.keys(selected).filter(
      key => selected[key] === true
    );
    const disabled = selectedFileIds.length === 0;

    setDownloadButtonState({
      disabled,
    });
  }, [job.files.length, selected]);

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
      maxWidth="xl">
      <div>Download files</div>
      <div>
        <CeligoTable
          data={job.files.map(file => ({ ...file, _id: file.id }))}
          columns={[{ heading: 'Name', value: r => r.name }]}
          onSelectChange={handleSelectChange}
          selectableRows
        />
      </div>
      <div>
        <Button
          data-test="downloadJobFiles"
          disabled={downloadButtonState.disabled}
          variant="outlined"
          color="primary"
          onClick={handleDownloadClick}>
          Download
        </Button>
      </div>
    </ModalDialog>
  );
}
