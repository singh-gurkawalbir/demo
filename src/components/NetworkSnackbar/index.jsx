import { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { LinearProgress, Button } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import { allLoadingOrErrored, isLoadingAnyResource } from '../../reducers';

const mapStateToProps = state => ({
  allLoadingOrErrored: allLoadingOrErrored(state),
  isLoadingAnyResource: isLoadingAnyResource(state),
});
const LinearInDertiminate = props => props.show && <LinearProgress />;
const Dismiss = props =>
  props.show && (
    <Button variant="contained" color="secondary" onClick={props.onClick}>
      Dismiss
    </Button>
  );

@withStyles(theme => ({
  snackbar: {
    marginTop: theme.spacing.unit * 1,
  },
  snackbarContent: {
    w: theme.spacing.unit * 4,
    flexGrow: 0,
    justifyContent: 'center',
    textAlign: 'center',
  },
}))
class NetworkSnackbar extends Component {
  state = {
    showSnackbar: true,
  };
  handleCloseSnackbar = () => {
    this.setState({
      showSnackbar: false,
    });
  };

  isLongWait(r) {
    /**
     * Compare the the intial Api request timestamp
     * with current time
     */
    if (r.timestamp === 0) return false;

    return Date.now() - r.timestamp >= Number(process.env.NETWORK_THRESHOLD);
  }

  render() {
    const { showSnackbar } = this.state;
    const { isLoadingAnyResource, allLoadingOrErrored, classes } = this.props;

    if (!allLoadingOrErrored) {
      return null;
    }

    const notification = r => {
      if (r.error)
        return <li key={r.name}>{`Error loading ${r.name}. (${r.error})`}</li>;

      let msg = `Loading ${r.name}...`;

      if (r.retryCount > 0) {
        msg += ` Retry ${r.retryCount}`;
      }

      return this.isLongWait(r) ? <li key={r.name}>{msg}</li> : '';
    };

    const msg = (
      <div>
        <ul>{allLoadingOrErrored.map(r => notification(r))}</ul>
        <LinearInDertiminate show={isLoadingAnyResource} />
        <Dismiss
          show={!isLoadingAnyResource}
          onClick={this.handleCloseSnackbar}
        />
      </div>
    );

    return (
      <Snackbar
        className={classes.snackbar}
        ContentProps={{
          // TODO: Are we overriding the default "paper" component style
          // globaly? The material-ui demo page has the snackbar width
          // and corner radius set differently than our default... we need
          // to use the overrides below to compensate. why? where in our
          // component heirarchy are these css overides?
          square: false,
          className: classes.snackbarContent,
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={showSnackbar}
        // autoHideDuration={6000}
        // onClose={this.handleClose}
        message={msg}
      />
    );
  }
}

export default connect(mapStateToProps)(NetworkSnackbar);
