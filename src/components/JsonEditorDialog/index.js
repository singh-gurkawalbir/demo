import { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import CodeEditor from '../../components/CodeEditor';

@withStyles(() => ({
  editorContainer: {
    border: '1px solid rgb(0,0,0,0.1)',
    height: '50vh',
    width: '75vh',
  },
}))
export default class JsonEditorDialog extends Component {
  state = {
    value: null,
    error: false,
  };

  handleChange(value) {
    this.setState({ value });

    try {
      JSON.parse(value);
      this.setState({ error: false });
    } catch (e) {
      this.setState({ error: true });
    }
  }

  handleCancel() {
    const { value, onClose } = this.props;

    this.setState({ value });

    onClose();
  }

  handleSave() {
    const { onChange, onClose } = this.props;
    const { value } = this.state;

    if (typeof onChange === 'function') {
      const json = JSON.parse(value);

      // console.log('from editor', json);

      onChange(json);
    }

    onClose();
  }

  componentDidMount() {
    const { value } = this.props;

    this.setState({ value });
  }

  render() {
    const { classes, id, title, onClose } = this.props;
    const { value, error } = this.state;

    return (
      <Dialog open onClose={onClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>

        <DialogContent>
          <div className={classes.editorContainer}>
            <CodeEditor
              name={id}
              value={value}
              mode="json"
              onChange={v => this.handleChange(v)}
            />
          </div>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => this.handleCancel()}
            disabled={error}
            variant="contained"
            size="small">
            Cancel
          </Button>
          <Button
            onClick={() => this.handleSave()}
            disabled={error}
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
