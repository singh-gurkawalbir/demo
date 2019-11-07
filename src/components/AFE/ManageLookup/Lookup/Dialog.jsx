import { makeStyles } from '@material-ui/core/styles';
import {
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from '@material-ui/core';
import CloseIcon from '../../../icons/CloseIcon';
import Lookup from './index';

const useStyles = makeStyles(theme => ({
  modalContent: {
    minheight: '50vh',
    width: '70vw',
  },
  container: {
    marginTop: theme.spacing(1),
    overflowY: 'off',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
}));

export default function LookupDialog(props) {
  const { id, onClose } = props;
  const classes = useStyles();

  return (
    <Dialog key={id} fullScreen={false} open scroll="paper" maxWidth={false}>
      <IconButton
        aria-label="Close"
        data-test="closeImportMapping"
        className={classes.closeButton}
        onClick={onClose}>
        <CloseIcon />
      </IconButton>
      <DialogTitle disableTypography>
        <Typography variant="h6">Add Lookup</Typography>
      </DialogTitle>
      <DialogContent className={classes.modalContent}>
        <div className={classes.container}>
          <Lookup {...props} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
