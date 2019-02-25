import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TimeAgo from 'react-timeago';
import actions from '../../actions';
import LoadResources from '../../components/LoadResources';
import ResourceForm from '../../components/ResourceForm';
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
    handlePatchResource: patchSet => {
      // console.log('patchSet Handled', patchSet);
      // TODO: Optionally we let the patchStaged action also take a
      // boolean flag to auto-commit?
      dispatch(actions.resource.patchStaged(id, patchSet));
      dispatch(actions.resource.commitStaged(resourceType, id));
    },
    // handleCommitChanges: (a, b, c) => {
    //   console.log(a, b, c);
    //   dispatch(actions.resource.commitStaged(resourceType, id));
    // },
    // handleUndoChange: () => {
    //   dispatch(actions.resource.undoStaged(id));
    // },
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
    width: `calc(100% - ${theme.spacing.double}px)`,
  },
  dates: {
    color: theme.palette.text.secondary,
  },
}))
class Edit extends Component {
  render() {
    const {
      id,
      resourceData,
      connection,
      resourceType,
      classes,
      handlePatchResource,
      // handleCommitChanges,
      handleConflict,
    } = this.props;
    const { /* master , */ merged, patch, conflict } = resourceData;
    // const conflict = [{ op: 'replace', path: '/name', value: 'Tommy Boy' }];
    const hasPatch = patch && patch.length > 0;
    // console.log(patch, merged);

    return merged ? (
      <LoadResources required resources={[resourceType]}>
        <Typography variant="h5">
          {`${toName(resourceType)}: ${merged.name || ''}`}
        </Typography>

        <Typography variant="subtitle1">ID: {merged._id}</Typography>

        <Typography variant="caption" className={classes.dates}>
          Last Modified: {prettyDate(merged.lastModified)}
        </Typography>

        {hasPatch && (
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
            key={id}
            connection={connection}
            resourceType={resourceType}
            resource={merged}
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
    ) : (
      <Typography variant="h5">
        No {toName(resourceType)} found with id {id}.
      </Typography>
    );
  }
}

// prettier-ignore
export default connect(mapStateToProps,mapDispatchToProps)(Edit);
