import { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FieldWrapper } from 'integrator-ui-forms/packages/core/dist';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from 'mdi-react/EditIcon';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
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
    height: '40vh',
    width: '60vh',
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
    const { id, onFieldChange } = this.props;

    onFieldChange(id, value);
  }

  render() {
    const { showEditor } = this.state;
    const {
      classes,
      id,
      mode,
      value,
      label,
      description,
      errorMessages,
      isValid,
    } = this.props;
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
              mode={mode}
              onChange={value => this.handleUpdate(value)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.handleEditorClick}
            variant="contained"
            color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );

    return (
      <Fragment>
        <IconButton
          onClick={this.handleEditorClick}
          className={classes.editorButton}>
          <EditIcon />
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
