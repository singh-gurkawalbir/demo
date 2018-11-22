import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import TimeAgo from 'react-timeago';
import actions from '../../actions';
import LoadResources from '../../components/LoadResources';
import * as selectors from '../../reducers';
import ConflictAlertDialog from './ConflictAlertDialog';

const mapStateToProps = (state, { match }) => {
  const { id, resourceType } = match.params;
  const resourceData = selectors.resourceData(state, resourceType, id);
  const { _connectionId } = resourceData.merged;
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
    handlePatchResource: (path, value) => {
      const patch = [
        {
          op: 'replace',
          path,
          value,
        },
      ];

      dispatch(actions.resource.patchStaged(id, patch));
    },
    handleCommitChanges: () => {
      dispatch(actions.resource.commitStaged(resourceType, id));
    },
    handleUndoChange: () => {
      dispatch(actions.resource.undoStaged(id));
    },
    handleRevertChanges: () => {
      dispatch(actions.resource.clearStaged(id));
    },
    handleConflict: skipCommit => {
      if (!skipCommit) {
        dispatch(actions.resource.commitStaged(resourceType, id));
      }

      dispatch(actions.resource.clearConflict(id));
    },
  };
};

const toName = resourceType =>
  resourceType.charAt(0).toUpperCase() + resourceType.slice(1, -1);
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
  },
  relatedContent: {
    textDecoration: 'none',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '90%',
  },
  dates: {
    color: theme.palette.text.secondary,
  },
}))
class Edit extends Component {
  handleInputChange = event => {
    const { handlePatchResource } = this.props;
    const { value } = event.target;
    const path = `/${event.target.id}`;

    handlePatchResource(path, value);
  };

  render() {
    const {
      id,
      resourceData,
      connection,
      resourceType,
      classes,
      handleUndoChange,
      handleCommitChanges,
      handleRevertChanges,
      handleConflict,
    } = this.props;
    const { merged, patch, conflict } = resourceData;
    // const conflict = [{ op: 'replace', path: '/name', value: 'Tommy Boy' }];

    return merged ? (
      <LoadResources required resources={[resourceType]}>
        <Typography variant="h5">
          {`${toName(resourceType)}: ${merged.name || ''}`}
        </Typography>

        <Typography variant="subtitle1">ID: {merged._id}</Typography>

        <Typography variant="caption" className={classes.dates}>
          Last Modified: {prettyDate(merged.lastModified)}
        </Typography>

        {patch && (
          <Typography variant="caption" className={classes.dates}>
            Unsaved changes made <TimeAgo date={Date(patch.lastChange)} /> ago.
          </Typography>
        )}

        {connection && (
          <Link
            key="conn"
            className={classes.relatedContent}
            to={`/pg/resources/connections/edit/${connection._id}`}>
            <Button size="small" color="secondary">
              Connected to {connection.name || connection._id}
            </Button>
          </Link>
        )}

        <div className={classes.editableFields}>
          <form>
            <TextField
              id="name"
              label="Name"
              rowsMax="4"
              value={merged.name || ''}
              onChange={this.handleInputChange}
              className={classes.textField}
              margin="normal"
            />
            <TextField
              id="description"
              label="Description"
              multiline
              rowsMax="4"
              value={merged.description || ''}
              onChange={this.handleInputChange}
              className={classes.textField}
              margin="normal"
            />

            {conflict && (
              <ConflictAlertDialog
                conflict={conflict}
                handleCommit={() => handleConflict(false)}
                handleCancel={() => handleConflict(true)}
              />
            )}

            {patch && patch.length > 0 && (
              <div>
                <Button
                  onClick={handleCommitChanges}
                  size="small"
                  color="secondary">
                  Commit Changes
                </Button>

                <Button
                  onClick={handleRevertChanges}
                  size="small"
                  color="primary">
                  Revert All
                </Button>

                <Button onClick={handleUndoChange} size="small" color="primary">
                  Undo Last Change
                </Button>
              </div>
            )}
          </form>
        </div>
      </LoadResources>
    ) : (
      <Typography variant="h5">
        No {toName(resourceType)} found with id {id}.
      </Typography>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Edit);
