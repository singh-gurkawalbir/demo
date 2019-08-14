import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ArrowPopper from '../../components/ArrowPopper';
import WaffleButton from './WaffleButton';
import WaffleIcon from './WaffleIcon';
import * as selectors from '../../reducers';
import { USER_ACCESS_LEVELS } from '../../utils/constants';

const mapStateToProps = state => ({
  accessLevel: selectors.userAccessLevel(state),
});

@withStyles(theme => ({
  waffleIcon: {
    fill: theme.appBar.contrast,
    width: 21,
    height: 21,
    '&:hover': {
      fill: theme.appBar.hover,
    },
  },
  wafflePopper: {
    width: '300px',
    maxHeight: '450px',
    padding: theme.spacing(1, 2),
    display: 'flex',
    flexWrap: 'wrap',
    overflowY: 'auto',
  },
  buttonContainer: {
    flex: 'auto',
    width: 70,
    padding: theme.spacing(1),
  },
}))
class WaffleBox extends Component {
  state = {
    anchorEl: null,
  };

  handleMenu = event => {
    if (this.state.anchorEl) {
      this.setState({ anchorEl: null });
    } else {
      this.setState({ anchorEl: event.currentTarget });
    }
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;
    const { classes, accessLevel } = this.props;

    if (
      ![
        USER_ACCESS_LEVELS.ACCOUNT_OWNER,
        USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
      ].includes(accessLevel)
    ) {
      return null;
    }

    const open = !!anchorEl;
    const buttons = [
      { title: 'Home', path: '/pg' },
      { title: 'Editors', path: '/pg/editors' },
      { title: 'Resources', path: '/pg/resources' },
      { title: 'Forms', path: '/pg/forms' },
      { title: 'API Tokens', path: '/pg/tokens' },
      { title: 'Agents', path: '/pg/agents' },
    ];

    return (
      <Fragment>
        <IconButton
          aria-owns={open ? 'waffleBox' : null}
          aria-haspopup="true"
          onClick={this.handleMenu}>
          <WaffleIcon className={classes.waffleIcon} />
        </IconButton>
        <ArrowPopper
          placement="left"
          className={classes.wafflePopper}
          id="waffleBox"
          onClose={this.handleClose}
          open={open}
          anchorEl={anchorEl}>
          {buttons.map(b => (
            <div key={b.title} className={classes.buttonContainer}>
              <WaffleButton
                to={b.path}
                title={b.title}
                onClick={this.handleClose}
              />
            </div>
          ))}
        </ArrowPopper>
      </Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  null
)(WaffleBox);
