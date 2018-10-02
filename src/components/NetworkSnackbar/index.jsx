import { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import { allLoadingOrErrored } from '../../reducers';

const mapStateToProps = state => ({
  allLoadingOrErrored: allLoadingOrErrored(state),
});

@withStyles(theme => ({
  snack: {
    w: theme.spacing.unit * 4,
    flexGrow: 0,
  },
}))
class NetworkSnackbar extends Component {
  render() {
    const { allLoadingOrErrored, classes } = this.props;

    if (!allLoadingOrErrored) {
      return null;
    }

    const notification = r => {
      if (r.error) {
        return `Error loading ${r.name}. (${r.error})`;
      }

      let msg = `Loading ${r.name}...`;

      if (r.retryCount > 0) {
        msg += ` Retry ${r.retryCount}`;
      }

      return <li key={r.name}>{msg}</li>;
    };

    const msg = <ul>{allLoadingOrErrored.map(r => notification(r))}</ul>;

    return (
      <Snackbar
        className={classes.snack}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open
        // autoHideDuration={6000}
        onClose={this.handleClose}
        message={msg}
      />
    );
  }
}

export default connect(mapStateToProps)(NetworkSnackbar);
