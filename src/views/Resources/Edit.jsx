import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import actions from '../../actions';
import LoadResources from '../../components/LoadResources';
import * as selectors from '../../reducers';

// TODO: Write a saga to ratelimit the keyword search
// to prevent dom updates unnecessarily

const mapStateToProps = (state, { match }) => {
  const { id, resourceType } = match.params;
  const resourceData = selectors.resourceData(state, resourceType, id);

  return {
    resourceType,
    resourceData,
    id,
  };
};

const mapDispatchToProps = (dispatch, { match }) => {
  const { id, resourceType } = match.params;

  return {
    handleInputChange: event => {
      const { value } = event.target;
      const path = `/${event.target.id}`;
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
    handleRevertChanges: () => {
      dispatch(actions.resource.clearStaged(id));
    },
  };
};

const relatedComponents = (resource, className) => {
  const { connection } = resource;
  const components = [];

  if (connection) {
    components.push(
      <Link
        key="conn"
        className={className}
        to={`/pg/resources/connections/edit/${connection._id}`}>
        <Button size="small" color="secondary">
          Connected to {connection.name || connection._id}
        </Button>
      </Link>
    );
  }

  return components;
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
}))
class Edit extends Component {
  render() {
    const {
      id,
      resourceData,
      resourceType,
      classes,
      handleInputChange,
      handleCommitChanges,
      handleRevertChanges,
    } = this.props;
    const { merged, patch, conflict } = resourceData;

    return merged ? (
      <LoadResources required resources={[resourceType]}>
        <Typography variant="h5">
          {`${toName(resourceType)}: ${merged.name || ''}`}
        </Typography>

        <Typography variant="subtitle1">ID: {merged._id}</Typography>

        <Typography variant="caption">
          Last Modified: {prettyDate(merged.lastModified)}
        </Typography>

        {relatedComponents(merged, classes.relatedContent)}

        <div className={classes.editableFields}>
          <form>
            <TextField
              id="name"
              label="Name"
              rowsMax="4"
              value={merged.name || ''}
              onChange={handleInputChange}
              className={classes.textField}
              margin="normal"
            />
            <TextField
              id="description"
              label="Description"
              multiline
              rowsMax="4"
              value={merged.description || ''}
              onChange={handleInputChange}
              className={classes.textField}
              margin="normal"
            />
            {patch && (
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
                  Revert
                </Button>
                {conflict && (
                  <div>
                    Merge Conflict:
                    {JSON.stringify(conflict)}
                  </div>
                )}
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

export default connect(mapStateToProps, mapDispatchToProps)(Edit);
