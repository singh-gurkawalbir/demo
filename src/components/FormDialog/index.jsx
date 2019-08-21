import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';

const withStyles = makeStyles(() => ({
  contentContainer: {
    border: '1px solid rgb(0,0,0,0.1)',
    height: props => props.height || '50vh',
    width: props => props.width || '75vh',
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
  const classes = withStyles(props);

  return (
    <Dialog open onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>

      <DialogContent>
        <div className={classes.contentContainer}>{children}</div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" size="small">
          {cancelLabel}
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!isValid}
          variant="contained"
          size="small"
          color="secondary">
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
