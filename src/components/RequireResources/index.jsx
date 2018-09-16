import { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import actions from '../../actions';
import { resourceStatus } from '../../reducers';

const mapStateToProps = (state, { resources }) => {
  const requiredStatus = resources.reduce((acc, resource) => {
    acc.push(resourceStatus(state, resource));

    return acc;
  }, []);
  const isAllDataReady = requiredStatus.reduce((acc, resource) => {
    if (!resource.isReady) {
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
    const { isAllDataReady, requiredStatus, requestResource } = this.props;

    // console.log('isAllDataReady:', isAllDataReady, requiredStatus);

    if (!isAllDataReady) {
      requiredStatus.forEach(resource => {
        if (!resource.hasData) {
          requestResource(resource.name);
        }
      });
    }
  }

  render() {
    const { isAllDataReady, requiredStatus, children, classes } = this.props;

    if (!isAllDataReady) {
      return requiredStatus.map(r => {
        if (r.isReady) {
          return null;
        }

        let msg = `Loading ${r.name}...`;

        if (r.retryCount > 0) {
          msg += ` Retry ${r.retryCount}`;
        }

        return (
          <SnackbarContent
            key={r.name}
            className={classes.snackbar}
            message={msg}
          />
        );
      });
    }

    return children;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequireResources);
