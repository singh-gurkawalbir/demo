import { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FieldWrapper } from 'react-forms-processor/dist';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import IconButton from '@material-ui/core/IconButton';
import OpenInNewIcon from 'mdi-react/OpenInNewIcon';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import CodeEditor from '../../../components/CodeEditor';

@withStyles(theme => ({
  container: {
    marginTop: theme.spacing.unit,
    overflowY: 'off',
  },
  label: {
    fontSize: '12px',
  },
  editorButton: {
    float: 'right',
  },
  inlineEditorContainer: {
    border: '1px solid rgb(0,0,0,0.1)',
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    height: theme.spacing.unit * 10,
  },
  editorContainer: {
    border: '1px solid rgb(0,0,0,0.1)',
    height: '50vh',
    width: '65vh',
  },
}))
class EditorField extends Component {
  state = {
    showEditor: false,
  };

  handleEditorClick = () => {
    this.setState({ showEditor: !this.state.showEditor });
  };

  handleUpdate(value) {
    const { id, mode, onFieldChange } = this.props;
    let sanitizedVal = value;

    if (mode === 'json') {
      try {
        sanitizedVal = JSON.parse(value);
      } catch (e) {
        return;
      }
    }

    onFieldChange(id, sanitizedVal);
  }
  // Options handler would return the selected file type we would use that
  // and inject it as the mode of the editor so that syntax formating would work
  // according to the file format
  getFileType = () => {
    const { options, mode } = this.props;

    if (options && options.file) return options.file;

    return mode;
  };

  render() {
    const { showEditor } = this.state;
    const {
      classes,
      id,
      value,
      label,
      description,
      mode,
      errorMessages,
      isValid,
    } = this.props;
    const modeFromFileOption = this.getFileType();
    let resultantMode = mode;

    // In the event the user selected a different file type
    // we would use that
    // The default values for both the fields would be the same
    if (modeFromFileOption !== mode) {
      resultantMode = modeFromFileOption;
    }

    const editorDialog = (
      <Dialog
        open
        onClose={this.handleEditorClick}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{label}</DialogTitle>
        <DialogContent>
          <div className={classes.editorContainer}>
            <CodeEditor
              name={id}
              value={value}
              mode={resultantMode}
              onChange={value => this.handleUpdate(value)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.handleEditorClick}
            variant="contained"
            size="small"
            color="secondary">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    );

    return (
      <Fragment>
        <IconButton
          onClick={this.handleEditorClick}
          className={classes.editorButton}>
          <OpenInNewIcon />
        </IconButton>
        <div className={classes.container}>
          {showEditor && editorDialog}

          <FormLabel className={classes.label}>{label}</FormLabel>

          <div className={classes.inlineEditorContainer}>
            <CodeEditor
              name={`${id}-inline`}
              value={value}
              mode={mode}
              onChange={value => this.handleUpdate(value)}
            />
          </div>
          <FormHelperText className={classes.helpText}>
            {isValid ? description : errorMessages}
          </FormHelperText>
        </div>
      </Fragment>
    );
  }
}

const DynaKeyValue = props => (
  <FieldWrapper {...props}>
    <EditorField />
  </FieldWrapper>
);

export default DynaKeyValue;
