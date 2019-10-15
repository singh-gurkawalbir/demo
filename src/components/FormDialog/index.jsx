import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography } from '@material-ui/core';

const withStyles = makeStyles(() => ({
  contentContainer: {
    border: '1px solid rgb(0,0,0,0.1)',
    height: '50vh',
    width: '75vh',
  },
}));

export default function FormDialog(props) {
  const {
    children,
    title,
    onClose,
    onSubmit,
    cancelLabel = 'Cancel',
    submitLabel = 'Save',
    isValid = true,
  } = props;
  const classes = withStyles();

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle disableTypography>
        <Typography variant="h6">{title}</Typography>
      </DialogTitle>

      <DialogContent>
        <div className={classes.contentContainer}>{children}</div>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          variant="contained"
          color="secondary"
          size="small">
          {cancelLabel}
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!isValid}
          variant="contained"
          size="small"
          color="primary">
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
