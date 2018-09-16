import { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import actions from '../../actions';
import { isDataReady, haveData } from '../../reducers';

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

@withStyles(theme => ({
  snackbar: {
    margin: theme.spacing.unit,
  },
}))
class RequireResources extends Component {
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
    const { isAllDataReady, resourceStatus, children, classes } = this.props;

    if (!isAllDataReady) {
      return resourceStatus.map(
        r =>
          !r.isDataReady && (
            <SnackbarContent
              key={r.name}
              className={classes.snackbar}
              message={`Loading ${r.name}`}
            />
          )
      );
    }

    return children;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequireResources);
