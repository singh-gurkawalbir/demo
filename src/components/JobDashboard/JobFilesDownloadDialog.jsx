import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import {
  Button,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import CeligoTable from '../../components/CeligoTable';
import actions from '../../actions';

const useStyles = makeStyles(theme => ({
  title: {
    minWidth: '640px',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
}));

export default function JobFilesDownloadDialog({
  job,
  integrationName,
  onCloseClick,
}) {
  const classes = useStyles();
  const [selected, setSelected] = useState({});
  const [downloadButtonState, setDownloadButtonState] = useState({
    disabled: true,
    label: 'Download',
  });

  useEffect(() => {
    const selectedFileIds = Object.keys(selected).filter(
      key => selected[key] === true
    );
    const disabled = selectedFileIds.length === 0;
    let label = 'Download';

    if (!disabled) {
      label = `Download ${
        selectedFileIds.length === job.files.length
          ? 'All'
          : selectedFileIds.length
      } ${selectedFileIds.length > 1 ? 'Files' : 'File'}`;
    }

    setDownloadButtonState({
      disabled,
      label,
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
    <Dialog open maxWidth={false}>
      <DialogTitle className={classes.title} disableTypography>
        <Typography variant="h6">
          {`${integrationName} > ${job && job.name}`}
        </Typography>
        <IconButton
          className={classes.closeButton}
          data-test="closeJobFilesDownloadDialog"
          onClick={onCloseClick}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <CeligoTable
          data={job.files.map(file => ({ ...file, _id: file.id }))}
          columns={[{ heading: 'Name', value: r => r.name }]}
          onSelectChange={handleSelectChange}
          selectableRows
        />
      </DialogContent>
      <DialogActions>
        <Button
          data-test="downloadJobFiles"
          disabled={downloadButtonState.disabled}
          onClick={handleDownloadClick}>
          {downloadButtonState.label}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
