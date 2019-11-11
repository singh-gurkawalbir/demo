import {
  DialogContent,
  Dialog,
  IconButton,
  DialogTitle,
  Divider,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '../../components/icons/CloseIcon';
import GenerateZip from './GenerateZip';

const useStyles = makeStyles(theme => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
  },
}));

export default function GenerateZipModal(props) {
  const { onClose } = props;
  const classes = useStyles();

  return (
    <Dialog open onClose={onClose} aria-labelledby="generate-template-zip">
      <DialogTitle id="generate-template-zip" disableTypography>
        <Typography variant="h6">Generate Template Zip</Typography>
        <IconButton
          aria-label="Close"
          onClick={onClose}
          data-test="closeGenerateZipDialog"
          className={classes.closeButton}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider variant="middle" />
      <DialogContent>
        <GenerateZip onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
