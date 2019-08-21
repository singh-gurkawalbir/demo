import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import ShareStackUserTable from './ShareStackUserTable';

const styles = theme => ({
  title: {
    marginLeft: theme.spacing(4),
    padding: theme.spacing(2),
  },
  submit: {
    marginLeft: theme.spacing(4),
    marginTop: theme.spacing(4),
    marginRight: 'auto',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing,
    top: theme.spacing,
  },
});

function StackShareDialog(props) {
  const {
    classes,
    title = 'Stack Sharing',
    width = '70vw',
    stackId,
    onClose,
  } = props;
  const handleOnInviteClick = e => {
    e.preventDefault();
  };

  return (
    <Dialog open maxWidth={false}>
      <IconButton
        aria-label="Close"
        className={classes.closeButton}
        onClick={onClose}>
        <CloseIcon />
      </IconButton>
      <DialogTitle className={classes.title}>
        <Typography variant="h6">{title}</Typography>
      </DialogTitle>
      <DialogContent style={{ width }}>
        <form onSubmit={handleOnInviteClick}>
          <TextField
            id="email"
            label="Share Stack With: "
            placeholder="user@domain.com"
            type="email"
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            className={classes.submit}
            value="Invite">
            Invite
          </Button>
        </form>
        <ShareStackUserTable stackId={stackId} />
      </DialogContent>
    </Dialog>
  );
}

export default withStyles(styles)(StackShareDialog);
