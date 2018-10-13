import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { connect } from 'react-redux';
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
class Edit extends Component {
  render() {
    const { id, resource, resourceType } = this.props;

    return resource ? (
      <LoadResources required resources={[resourceType]}>
        <h3>ID: {resource._id}</h3>
        <div>Name: {resource.name}</div>
        <div>Description: {resource.description}</div>
        <div>Last Modified: {resource.lastModified}</div>
      </LoadResources>
    ) : (
      <Typography variant="headline">
        No {resourceType} found with the if {id}
      </Typography>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Edit);
