import { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Button, LinearProgress } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import { allLoadingOrErrored, isLoadingAllResources } from '../../reducers';

const mapStateToProps = state => ({
  allLoadingOrErrored: allLoadingOrErrored(state),
  isLoadingAllResources: isLoadingAllResources(state),
});
const LinearInDertiminate = props =>
  props.isLoadingAllResources && <LinearProgress />;

@withStyles(theme => ({
  snackbar: {
    marginTop: theme.spacing.unit * 1,
  },
  snackbarContent: {
    w: theme.spacing.unit * 4,
    flexGrow: 0,
    justifyContent: 'center',
  },
}))
class NetworkSnackbar extends Component {
  constructor(props) {
    super(props);
    this.state = { showSnackbar: true };
    this.closeSnackbar = this.closeSnackbar.bind(this);
  }
  closeSnackbar() {
    this.setState({
      showSnackbar: false,
    });
  }
  render() {
    const { showSnackbar } = this.state;
    const { isLoadingAllResources, allLoadingOrErrored, classes } = this.props;

    if (!allLoadingOrErrored) {
      return null;
    }

    let dismiss = null;
    const notification = (r, index) => {
      if (r.error) {
        if (index === allLoadingOrErrored.length - 1)
          dismiss = (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => this.closeSnackbar()}>
              Dismiss
            </Button>
          );

        return <li key={r.name}>{`Error loading ${r.name}. (${r.error})`}</li>;
      }

      let msg = `Loading ${r.name}...`;

      if (r.retryCount > 0) {
        msg += ` Retry ${r.retryCount}`;
      }

      return <li key={r.name}>{msg}</li>;
    };

    const msg = (
      <div>
        <ul>{allLoadingOrErrored.map((r, index) => notification(r, index))}</ul>
        <LinearInDertiminate isLoadingAllResources={isLoadingAllResources} />
        {dismiss}
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
