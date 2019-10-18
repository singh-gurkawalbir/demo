import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import ShareStackUserTable from './ShareStackUserTable';
import actions from '../../actions';
import CloseIcon from '../icons/CloseIcon';

const styles = theme => ({
  submit: {
    marginLeft: theme.spacing(4),
    marginTop: theme.spacing(4),
    marginRight: 'auto',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  textField: {
    width: theme.spacing(50),
  },
  form: {
    marginLeft: theme.spacing(3),
  },
});

function StackShareDialog(props) {
  const {
    classes,
    title = 'Stack Sharing',
    width = '70vw',
    stackId,
    onClose,
    stackShareCollectionById,
  } = props;
  const dispatch = useDispatch();
  const handleOnInviteClick = e => {
    e.preventDefault();
    const shareWithUserEmail = e.target.email.value;

    if (!shareWithUserEmail) {
      return;
    }

    dispatch(actions.stack.inviteStackShareUser(shareWithUserEmail, stackId));
  };

  return (
    <Dialog open maxWidth={false}>
      <DialogTitle disableTypography>
        <Typography variant="h6">{title}</Typography>
        <IconButton
          data-test="closeStackShareDialog"
          aria-label="Close"
          className={classes.closeButton}
          onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent style={{ width }}>
        <form onSubmit={handleOnInviteClick} className={classes.form}>
          <TextField
            id="email"
            label="Share Stack With: "
            placeholder="user@domain.com"
            type="email"
            className={classes.textField}
            margin="normal"
            variant="filled"
          />
          <Button
            data-test="inviteUserAccessToStack"
            variant="contained"
            color="primary"
            type="submit"
            className={classes.submit}>
            Invite
          </Button>
        </form>
        <ShareStackUserTable stackShareCollection={stackShareCollectionById} />
      </DialogContent>
    </Dialog>
  );
}

export default withStyles(styles)(StackShareDialog);
