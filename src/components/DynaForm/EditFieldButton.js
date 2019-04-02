import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from 'mdi-react/EditIcon';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import CodeEditor from '../../components/CodeEditor';
import * as selectors from '../../reducers';
import actions from '../../actions';

const mapStateToProps = (state, { field }) => {
  const { id, resourceId, resourceType } = field;

  if (!id) return {};

  const fieldMeta = selectors.resourceFormField(
    state,
    resourceType,
    resourceId,
    id
  );

  return { fieldMeta };
};

const mapDispatchToProps = (dispatch, { field }) => {
  const { id, resourceId, resourceType } = field;

  return {
    patchFormField: value => {
      // console.log(`patch ${id} with:`, value);
      dispatch(
        actions.resource.patchFormField(resourceType, resourceId, id, value)
      );
    },
    resetEditor: () => {
      dispatch(actions.editor.reset(id));
    },
  };
};

@withStyles(() => ({
  editorContainer: {
    border: '1px solid rgb(0,0,0,0.1)',
    height: '50vh',
    width: '65vh',
  },
}))
class EditFieldButton extends Component {
  state = {
    showEditor: false,
    newMeta: null,
    error: false,
  };

  handleEditorClick = () => {
    const { showEditor } = this.state;

    this.setState({ showEditor: !showEditor });
  };

  handleChange(value) {
    this.setState({ newMeta: value });

    try {
      JSON.parse(value);
      this.setState({ error: false });
    } catch (e) {
      this.setState({ error: true });
    }
  }

  handleCancel() {
    const { fieldMeta } = this.props;

    this.setState({ newMeta: fieldMeta });

    this.handleEditorClick();
  }

  handleSave() {
    const { patchFormField } = this.props;
    const { newMeta } = this.state;

    patchFormField(JSON.parse(newMeta));
    this.handleEditorClick();
  }

  componentDidMount() {
    const { fieldMeta } = this.props;

    this.setState({ newMeta: fieldMeta });
  }

  render() {
    const { showEditor, newMeta, error } = this.state;
    const { classes, className, fieldMeta } = this.props;
    const editorDialog = (
      <Dialog
        open
        onClose={this.handleEditorClick}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          Editing field: {fieldMeta.id}
        </DialogTitle>

        <DialogContent>
          <div className={classes.editorContainer}>
            <CodeEditor
              name={fieldMeta.id}
              value={newMeta}
              mode="json"
              onChange={value => this.handleChange(value)}
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

    return (
      <Fragment>
        <IconButton className={className} onClick={this.handleEditorClick}>
          <EditIcon fontSize="small" />
        </IconButton>
        {showEditor && editorDialog}
      </Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditFieldButton);
