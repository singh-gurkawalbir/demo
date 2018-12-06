import { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import actions from '../../actions';
import { resourceStatus } from '../../reducers';

const mapStateToProps = (state, { resources }) => {
  const requiredStatus = resources.reduce((acc, resourceType) => {
    acc.push(resourceStatus(state, resourceType));

    return acc;
  }, []);
  const isAllDataReady = requiredStatus.reduce((acc, resourceStatus) => {
    if (!resourceStatus.isReady) {
      return false;
    }

    return acc;
  }, true);

  return {
    isAllDataReady,
    requiredStatus,
  };
};

const mapDispatchToProps = dispatch => ({
  requestResource: type => {
    // console.log(`request resource "${resource}"`);
    dispatch(actions.resource.requestCollection(type));
  },
});

@withStyles(theme => ({
  snackbar: {
    margin: theme.spacing.unit,
  },
}))
class LoadResources extends Component {
  async componentDidMount() {
    const { isAllDataReady, requiredStatus, requestResource } = this.props;

    // console.log('isAllDataReady:', isAllDataReady, requiredStatus);

    if (!isAllDataReady) {
      requiredStatus.forEach(resource => {
        if (!resource.hasData) {
          requestResource(resource.resourceType);
        }
      });
    }
  }

  render() {
    const { isAllDataReady, children, required } = this.props;

    if (isAllDataReady || !required) {
      return children;
    }

    return null;
  }
}

// prettier-ignore
export default connect(mapStateToProps, mapDispatchToProps)(LoadResources);
