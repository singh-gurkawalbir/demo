import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TimeAgo from 'react-timeago';
import actions from '../../actions';
import * as selectors from '../../reducers';
import LoadResources from '../../components/LoadResources';
import ResourceFormFactory from '../../components/ResourceForm';
import ConflictAlertDialog from './ConflictAlertDialog';
import factory from '../../forms/formFactory';
import JsonEditorDialog from '../../components/JsonEditorDialog';

const mapStateToProps = (state, { match }) => {
  const { id, resourceType } = match.params;
  const resourceData = selectors.resourceData(state, resourceType, id);
  const { _connectionId } = resourceData.merged ? resourceData.merged : {};
  // TODO: this should be resourceType instead of connections
  const connection = _connectionId
    ? selectors.resource(state, 'connections', _connectionId)
    : null;

  return {
    resourceType,
    resourceData,
    connection,
    id,
  };
};

const mapDispatchToProps = (dispatch, { match }) => {
  const { id, resourceType } = match.params;

  return {
    handlePatchFormMeta: value => {
      const patchSet = [{ op: 'replace', path: '/customForm/form', value }];

      dispatch(actions.resource.patchStaged(id, patchSet));
    },
    handlePatchResource: (patchSet, skipCommit) => {
      // console.log('patchSet Handled', patchSet);

      // return null;
      dispatch(actions.resource.patchStaged(id, patchSet));

      if (!skipCommit) {
        dispatch(actions.resource.commitStaged(resourceType, id));
      }
    },
    // handleCommitChanges: (a, b, c) => {
    //   console.log(a, b, c);
    //   dispatch(actions.resource.commitStaged(resourceType, id));
    // },
    handleUndoChange: () => {
      dispatch(actions.resource.undoStaged(id));
    },
    // handleRevertChanges: () => {
    //   dispatch(actions.resource.clearStaged(id));
    // },
    handleConflict: skipCommit => {
      if (!skipCommit) {
        dispatch(actions.resource.commitStaged(resourceType, id));
      }

      dispatch(actions.resource.clearConflict(id));
    },
  };
};

const toName = (token, upper, trim) =>
  upper
    ? token.charAt(0).toUpperCase() + token.slice(1, trim)
    : token.slice(0, trim);
const prettyDate = dateString => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };

  return new Date(dateString).toLocaleString(undefined, options);
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
  };

  handleToggleEdit = () => {
    const {
      resourceData,
      handlePatchResource,
      resourceType,
      connection,
    } = this.props;
    const { merged: resource } = resourceData;
    const { editMode } = this.state;

    if (!editMode) {
      if (!resource.customForm || !resource.customForm.form) {
        // init the custom form with a copy of current form
        const { fieldMeta } = factory.getResourceFormAssets({
          connection,
          resource,
          resourceType,
        });
        const flattenedFieldMeta = factory.getFlattenedFieldMetaWithRules(
          fieldMeta,
          resourceType,
          resource
        );
        const patchSet = [
          {
            op: 'replace',
            path: '/customForm',
            value: {
              form: {
                fields: flattenedFieldMeta,
                fieldSets: { ...fieldMeta.fieldSets },
              },
            },
          },
        ];

        handlePatchResource(patchSet, true);
      }
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
      resourceData,
      connection,
      resourceType,
      classes,
      handlePatchResource,
      handlePatchFormMeta,
      handleUndoChange,
      // handleCommitChanges,
      handleConflict,
    } = this.props;
    const { editMode, showEditor } = this.state;
    const { /* master , */ merged, patch, conflict, hash } = resourceData;
    const allowsCustomForm = ['connections', 'imports', 'exports'].includes(
      resourceType
    );

    if (!merged) {
      return (
        <Typography variant="h5">
          No {toName(resourceType, true, -1)} found with id {id}.
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
            {patchLength > 1 && (
              <Button
                className={classes.editButton}
                size="small"
                color="primary"
                onClick={handleUndoChange}>
                Undo({patchLength - 1})
              </Button>
            )}
          </Fragment>
        )}
        <Typography variant="h5">
          {type
            ? `${toName(type, true)} ${toName(resourceType, false, -1)}`
            : toName(resourceType, true, -1)}
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
          <ResourceFormFactory
            key={hash}
            editMode={editMode}
            resourceType={resourceType}
            resource={merged}
            connection={connection}
            handleSubmit={patchSet => {
              handlePatchResource(patchSet);
            }}
          />

          {conflict && (
            <ConflictAlertDialog
              conflict={conflict}
              handleCommit={() => handleConflict(false)}
              handleCancel={() => handleConflict(true)}
            />
          )}
        </div>
      </LoadResources>
    );
  }
}

// prettier-ignore
export default connect(mapStateToProps,mapDispatchToProps)(Edit);
