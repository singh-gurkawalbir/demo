import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TimeAgo from 'react-timeago';
import actions from '../../actions';
import prettyDate from '../../utils/date';
import { MODEL_PLURAL_TO_LABEL } from '../../constants/resource';
import * as selectors from '../../reducers';
import LoadResources from '../../components/LoadResources';
import ResourceForm from '../../components/ResourceFormFactory';
import ConflictAlert from '../../components/ConflictAlertFactory';
import JsonEditorDialog from '../../components/JsonEditorDialog';
import HooksButton from './HooksButton';

const mapStateToProps = (state, { match }) => {
  const { id, resourceType } = match.params;
  const resourceData = selectors.resourceData(state, resourceType, id);
  const { _connectionId } = resourceData.merged ? resourceData.merged : {};
  // TODO: this should be resourceType instead of connections
  const connection = _connectionId
    ? selectors.resource(state, 'connections', _connectionId)
    : null;
  const formState = selectors.resourceFormState(state, resourceType, id);
  const newResourceId = selectors.createdResourceId(state, id);

  return {
    resourceType,
    resourceData,
    connection,
    id,
    newResourceId,
    fieldMeta: formState.fieldMeta,
  };
};

const mapDispatchToProps = (dispatch, { match }) => {
  const { id, resourceType } = match.params;

  return {
    handlePatchFormMeta: value => {
      const patchSet = [{ op: 'replace', path: '/customForm/form', value }];

      dispatch(actions.resource.patchStaged(id, patchSet));
    },
    // handleCommitChanges: (a, b, c) => {
    //   console.log(a, b, c);
    //   dispatch(actions.resource.commitStaged(resourceType, id));
    // },
    handleInitCustomResourceForm: () => {
      dispatch(actions.resource.initCustomForm(resourceType, id));
    },
    handleUndoChange: () => {
      dispatch(actions.resource.undoStaged(id));
    },
  };
};

@hot(module)
@withStyles(theme => ({
  editableFields: {
    paddingTop: theme.spacing.unit,
    minHeight: '50%',
    maxHeight: `calc(100vh - ${theme.spacing.unit * 27}px)`,
    overflowY: 'hidden',
  },
  // textField: {
  //   marginLeft: theme.spacing.unit,
  //   marginRight: theme.spacing.unit,
  //   width: `calc(100% - ${theme.spacing.double}px)`,
  // },
  relatedContent: {
    textDecoration: 'none',
  },
  dates: {
    color: theme.palette.text.secondary,
  },
  editButton: {
    float: 'right',
  },
}))
class Edit extends Component {
  state = {
    editMode: false,
    showEditor: false,
    formKey: 1,
  };

  handleToggleEdit = () => {
    const { handleInitCustomResourceForm } = this.props;
    const { editMode } = this.state;

    if (!editMode) {
      handleInitCustomResourceForm();
    }

    this.setState({ editMode: !editMode });
  };

  handleToggleEditor = () => {
    this.setState({ showEditor: !this.state.showEditor });
  };

  componentDidMount() {
    this.setState({ editMode: false, showEditor: false });
  }
  handleRemountResourceComponent = () => {
    // We need to re-mount the react-forms-processor component
    // to reset the values back to defaults....
    const formKey = this.state.formKey + 1;

    this.setState({
      formKey,
    });
  };

  render() {
    const {
      id,
      resourceData,
      connection,
      resourceType,
      classes,
      handlePatchFormMeta,
      handleUndoChange,
      newResourceId,
      // handleCommitChanges,
    } = this.props;

    // once a new resource (id.startsWith('new-')), has been committed,
    // we need to redirect to the resource using the correct id from
    // the persistence layer...
    if (newResourceId) {
      this.props.history.push(`/pg/resources/exports/edit/${newResourceId}`);
    }

    const { editMode, showEditor, formKey } = this.state;
    const { /* master , */ merged, patch, conflict } = resourceData;
    const allowsCustomForm = ['connections', 'imports', 'exports'].includes(
      resourceType
    );

    if (!merged) {
      return (
        <Typography variant="h5">
          No {MODEL_PLURAL_TO_LABEL[resourceType]} found with id {id}.
        </Typography>
      );
    }

    let type = connection ? connection.type : merged.type;
    const assistant = connection ? connection.assistant : merged.assistant;
    const formMeta = merged.customForm ? merged.customForm.form : {};

    if (assistant) {
      type = assistant;
    }

    // const conflict = [{ op: 'replace', path: '/name', value: 'Tommy Boy' }];
    const patchLength = (patch && patch.length) || 0;
    // console.log(patch, merged);

    return (
      <LoadResources required resources={[resourceType]}>
        {showEditor && (
          <JsonEditorDialog
            value={formMeta}
            title="Custom form metadata"
            id={id}
            onClose={this.handleToggleEditor}
            onChange={value => {
              // console.log(value);
              handlePatchFormMeta(value);
            }}
          />
        )}
        {allowsCustomForm && (
          <Button
            className={classes.editButton}
            size="small"
            color="primary"
            onClick={this.handleToggleEdit}>
            {editMode ? 'Save form' : 'Edit form'}
          </Button>
        )}
        {editMode && (
          <Fragment>
            <Button
              className={classes.editButton}
              size="small"
              color="primary"
              onClick={this.handleToggleEditor}>
              JSON
            </Button>

            <HooksButton
              resourceId={id}
              resourceType={resourceType}
              className={classes.editButton}
            />

            {patchLength > 1 && (
              <Button
                className={classes.editButton}
                size="small"
                color="primary"
                onClick={() => {
                  handleUndoChange();
                  this.handleRemountResourceComponent();
                }}>
                Undo({patchLength - 1})
              </Button>
            )}
          </Fragment>
        )}
        <Typography variant="h5">
          {type || null} {`${MODEL_PLURAL_TO_LABEL[resourceType]}`}
        </Typography>

        <Typography variant="caption" className={classes.dates}>
          Last Modified: {prettyDate(merged.lastModified)}
        </Typography>

        {patchLength > 0 && (
          <Typography variant="caption" className={classes.dates}>
            Unsaved changes made <TimeAgo date={Date(patch.lastChange)} />.
          </Typography>
        )}

        {connection && (
          <Link
            key="conn"
            className={classes.relatedContent}
            to={`/pg/resources/connections/edit/${connection._id}`}>
            <Button size="small" color="primary">
              Connected to {connection.name || connection._id}
            </Button>
          </Link>
        )}

        <div className={classes.editableFields}>
          <ResourceForm
            key={formKey}
            editMode={editMode}
            resourceType={resourceType}
            resource={merged}
            connectionType={type}
            connection={connection}
          />

          {conflict && (
            <ConflictAlert
              conflict={conflict}
              connectionType={type}
              resourceType={resourceType}
              id={id}
            />
          )}
        </div>
      </LoadResources>
    );
  }
}

// prettier-ignore
export default connect(mapStateToProps,mapDispatchToProps)(Edit);
