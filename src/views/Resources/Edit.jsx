import { hot } from 'react-hot-loader';
import { Component } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Switch, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TimeAgo from 'react-timeago';
import Grid from '@material-ui/core/Grid';
import actions from '../../actions';
import prettyDate from '../../utils/date';
import {
  MODEL_PLURAL_TO_LABEL,
  isNewId,
  getResourceSubType,
} from '../../utils/resource';
import * as selectors from '../../reducers';
import LoadResources from '../../components/LoadResources';
import ResourceForm from '../../components/ResourceFormFactory';
import ConflictAlert from '../../components/ConflictAlertFactory';
import JsonEditorDialog from '../../components/JsonEditorDialog';
import HooksButton from './HooksButton';
import { SCOPES } from '../../sagas/resourceForm';
import getRoutePath from '../../utils/routePaths';

const mapStateToProps = (state, { match }) => {
  const { id, resourceType } = match.params;
  const metaChanges = selectors.resourceData(state, resourceType, id, 'meta');
  const valueChanges = selectors.resourceData(state, resourceType, id, 'value');
  let resType;
  const { assistant, type } = getResourceSubType(valueChanges.merged);

  if (assistant) resType = assistant;
  else resType = type;
  const { _connectionId } = valueChanges.merged ? valueChanges.merged : {};
  // TODO: this should be resourceType instead of connections
  const connection = _connectionId
    ? selectors.resource(state, 'connections', _connectionId)
    : null;
  const newResourceId = selectors.createdResourceId(state, id);
  const metaPatches =
    (metaChanges.patch &&
      metaChanges.patch.filter(patch => patch.path !== '/customForm').length) ||
    0;

  return {
    type: resType,
    resourceType,
    metaPatches,
    metaChanges,
    connection,
    id,
    newResourceId,
  };
};

const mapDispatchToProps = (dispatch, { match }) => {
  const { id, resourceType } = match.params;

  return {
    handlePatchFormMeta: value => {
      const patchSet = [{ op: 'replace', path: '/customForm/form', value }];

      dispatch(actions.resource.patchStaged(id, patchSet, SCOPES.META));
    },

    handleInitCustomResourceForm: () => {
      dispatch(actions.resource.initCustomForm(resourceType, id));
    },

    handleUndoChange: () => {
      dispatch(actions.resource.undoStaged(id, SCOPES.META));
    },
    handleUndoAllMetaChanges: () => {
      dispatch(actions.resource.clearStaged(id, SCOPES.META));
    },
    handleCommitMetaChanges: () => {
      dispatch(actions.resource.commitStaged(resourceType, id, SCOPES.META));
    },
  };
};

@hot(module)
@withStyles(theme => ({
  editableFields: {
    paddingTop: theme.spacing(1),
    minHeight: '50%',
    overflowY: 'hidden',
  },
  relatedContent: {
    textDecoration: 'none',
  },
  dates: {
    color: theme.palette.text.secondary,
  },
}))
class Edit extends Component {
  state = {
    editMode: false,
    showEditor: false,
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

  render() {
    const {
      id,
      metaChanges,
      connection,
      resourceType,
      classes,
      metaPatches,
      handlePatchFormMeta,
      handleUndoChange,
      newResourceId,
      handleCommitMetaChanges,
      type,
      handleUndoAllMetaChanges,
      // handleCommitChanges,
    } = this.props;

    // once a new resource (id.startsWith('new-')), has been committed,
    // we need to redirect to the resource using the correct id from
    // the persistence layer...
    if (newResourceId) {
      this.props.history.push(
        `/pg/resources/${resourceType}/edit/${newResourceId}`
      );
    }

    const { editMode, showEditor } = this.state;
    const { merged, lastChange, conflict, scope } = metaChanges;
    const allowsCustomForm =
      !isNewId(id) &&
      ['connections', 'imports', 'exports'].includes(resourceType);

    if (!merged) {
      return (
        <Typography variant="h5">
          No {MODEL_PLURAL_TO_LABEL[resourceType]} found with id {id}.
        </Typography>
      );
    }

    const formMeta = merged.customForm ? merged.customForm.form : {};

    // const conflict = [{ op: 'replace', path: '/name', value: 'Tommy Boy' }];

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

        <Grid container>
          <Grid item xs={6}>
            <Typography variant="h5">
              {type || null} {`${MODEL_PLURAL_TO_LABEL[resourceType]}`}
            </Typography>
            {merged.lastModified && (
              <Typography variant="caption" className={classes.dates}>
                Last Modified: {prettyDate(merged.lastModified)}
              </Typography>
            )}
            {metaPatches > 0 && (
              <Typography variant="caption" className={classes.dates}>
                Unsaved changes made <TimeAgo date={lastChange} />.
              </Typography>
            )}
          </Grid>
          <Grid item xs={6}>
            {allowsCustomForm && (
              <FormControlLabel
                className={classes.simpleSpacing}
                onChange={this.handleToggleEdit}
                control={<Switch color="primary" />}
                label="Edit"
                labelPlacement="start"
              />
            )}
            {editMode && (
              <div>
                {metaPatches > 0 && (
                  <Button
                    size="small"
                    color="secondary"
                    onClick={handleUndoChange}>
                    Undo({metaPatches})
                  </Button>
                )}
                <HooksButton
                  resourceId={id}
                  resourceType={resourceType}
                  className={classes.editButton}
                />
                <Button
                  size="small"
                  color="primary"
                  onClick={this.handleToggleEditor}>
                  JSON
                </Button>
                <Button
                  size="small"
                  color="primary"
                  disabled={metaPatches === 0}
                  onClick={handleCommitMetaChanges}>
                  Save form
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  disabled={metaPatches === 0}
                  onClick={handleUndoAllMetaChanges}>
                  Cancel Meta Changes
                </Button>
              </div>
            )}
          </Grid>
        </Grid>
        {connection && (
          <Link
            key="conn"
            className={classes.relatedContent}
            to={getRoutePath(`/connections/edit/${connection._id}`)}>
            <Button size="small" color="primary">
              Connected to {connection.name || connection._id}
            </Button>
          </Link>
        )}

        <div className={classes.editableFields}>
          <ResourceForm
            editMode={editMode}
            resourceType={resourceType}
            resourceId={id}
            connectionType={type}
          />

          {conflict && (
            <ConflictAlert
              scope={scope}
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
