import { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography } from '@material-ui/core';

@withStyles(() => ({
  editorContainer: {
    border: '1px solid rgb(0,0,0,0.1)',
    height: '50vh',
    width: '75vh',
  },
}))
export default class NewFieldDialog extends Component {
  render() {
    const { classes, title, onClose } = this.props;

    return (
      <Dialog open onClose={onClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>

        <DialogContent>
          <div className={classes.editorContainer}>
            <Typography variant="h5">Not yet implemented....</Typography>
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} variant="contained" size="small">
            Cancel
          </Button>
          <Button
            onClick={() => this.handleSave()}
            variant="contained"
            size="small"
            color="secondary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
