import React from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  DialogTitle,
  Divider,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '../icons/CloseIcon';
import UploadFile from './UploadFile';

const useStyles = makeStyles(theme => ({
  title: {
    marginLeft: theme.spacing(4),
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
  },
}));

export default function InstallIntegrationDialog(props) {
  const { fileType, history, onClose } = props;
  const classes = useStyles();

  return (
    <Dialog open onClose={onClose} aria-labelledby="integration-install-dialog">
      <DialogTitle
        id="integration-install-dialog"
        className={classes.title}
        disableTypography>
        <Typography variant="h6">Upload Integration Zip File</Typography>
        <IconButton
          aria-label="Close"
          onClick={onClose}
          data-test="showUploadFileDialogModal"
          className={classes.closeButton}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider variant="middle" />
      <DialogContent>
        <UploadFile fileType={fileType} history={history} />
      </DialogContent>
    </Dialog>
  );
}
