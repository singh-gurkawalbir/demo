import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { connect } from 'react-redux';
import LoadingList from './LoadingList';
import actions from '../actions';
import { isDataReady, haveData } from '../reducers';

const mapStateToProps = (state, { resources }) => {
  const status = [];

  // console.log('mapStateToProps:', state);
  resources.reduce((acc, resource) => {
    acc.push({
      name: resource,
      isDataReady: isDataReady(state, resource),
      haveData: haveData(state, resource),
    });

    return acc;
  }, status);

  const isAllDataReady = status.reduce((acc, resource) => {
    if (!resource.isDataReady) {
      return false;
    }

    return acc;
  }, true);

  return {
    isAllDataReady,
    resourceStatus: status,
  };
};

const mapDispatchToProps = dispatch => ({
  requestResource: resource => {
    // console.log(`request resource ${resource}`);
    dispatch(actions[resource].request());
  },
});

@hot(module)
class LoadResources extends Component {
  async componentDidMount() {
    const { isAllDataReady, resourceStatus, requestResource } = this.props;

    // console.log('isAllDataReady:', isAllDataReady, resourceStatus);

    if (!isAllDataReady) {
      resourceStatus.forEach(resource => {
        if (!resource.haveData) {
          requestResource(resource.name);
        }
      });
    }
  }

  render() {
    const { isAllDataReady, resourceStatus, children } = this.props;

    if (!isAllDataReady) {
      const steps = resourceStatus.reduce((acc, resource) => {
        acc.push({
          name: `Loading ${resource.name}...`,
          done: resource.isDataReady,
        });

        return acc;
      }, []);

      return <LoadingList steps={steps} />;
    }

    return children;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadResources);
