import { Component } from 'react';
import { bool, func } from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import withMobileDialog from '@material-ui/core/withMobileDialog';

@withMobileDialog()
export default class TokenDialog extends Component {
  static propTypes = {
    open: bool,
    onClose: func.isRequired,
    onSubmit: func.isRequired,
  };

  static defaultProps = {
    open: false,
  };

  state = {
    token: '',
  };

  handleTokenChange = e => {
    this.setState({ token: e.target.value });
  };

  handleClose = () => {
    this.setState({ token: '' }, () => this.props.onClose());
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.onSubmit(this.state.token);
    this.props.onClose();
    this.setState({ token: '' });
  };

  render() {
    const { fullScreen, open } = this.props;
    const { token } = this.state;

    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={this.handleClose}
        aria-labelledby="token-dialog-title">
        <DialogTitle id="token-dialog-title">Enter your API Token</DialogTitle>
        <form onSubmit={this.handleSubmit}>
          <DialogContent>
            <TextField
              required
              label="Token"
              value={token}
              onChange={this.handleTokenChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary" autoFocus>
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}
