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

// import { withStyles } from '@material-ui/core/styles';

// TODO: Write a saga to ratelimit the keyword search
// to prevent dom updates unnecessarily

const mapStateToProps = (state, { match }) => {
  const { id, resourceType } = match.params;
  const resource = selectors.resource(state, resourceType, id);

  return {
    resourceType,
    resource,
    id,
  };
};

const mapDispatchToProps = dispatch => ({
  requestResource: resource => {
    // console.log(`request resource "${resource}"`);
    dispatch(actions[resource].request());
  },
});
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
    const { id, resource, resourceType, classes } = this.props;
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

    return resource ? (
      <LoadResources required resources={[resourceType]}>
        <Typography variant="headline">
          {`${toName(resourceType)}: ${resource.name || ''}`}
        </Typography>

        <Typography variant="subheading">ID: {resource._id}</Typography>

        <Typography variant="caption">
          Last Modified: {prettyDate(resource.lastModified)}
        </Typography>

        {relatedComponents(resource, classes.relatedContent)}

        <div className={classes.editableFields}>
          <form>
            <TextField
              id="name"
              label="Name"
              rowsMax="4"
              value={resource.name || ''}
              // onChange={this.handleChange('multiline')}
              className={classes.textField}
              margin="normal"
            />
            <TextField
              id="description"
              label="Description"
              multiline
              rowsMax="4"
              value={resource.description || ''}
              // onChange={this.handleChange('multiline')}
              className={classes.textField}
              margin="normal"
            />
          </form>
        </div>
      </LoadResources>
    ) : (
      <Typography variant="headline">
        No {toName(resourceType)} found with id {id}.
      </Typography>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Edit);
