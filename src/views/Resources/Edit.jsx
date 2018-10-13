import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
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

@hot(module)
@withStyles(theme => ({
  editableFields: {
    paddingTop: theme.spacing.unit,
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
      };

      return new Date(dateString).toLocaleString(undefined, options);
    };

    return resource ? (
      <LoadResources required resources={[resourceType]}>
        <Typography variant="headline">
          {`${toName(resourceType)}: ${resource.name}`}
        </Typography>
        <Typography variant="caption">
          Last Modified: {prettyDate(resource.lastModified)}
        </Typography>
        <Typography variant="subheading">ID: {resource._id}</Typography>
        <div className={classes.editableFields}>
          <div>Name: {resource.name}</div>
          <div>Description: {resource.description}</div>
        </div>
      </LoadResources>
    ) : (
      <Typography variant="headline">
        No {resourceType} found with the if {id}
      </Typography>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Edit);
