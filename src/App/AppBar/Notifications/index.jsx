import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import RootRef from '@material-ui/core/RootRef';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import AcceptIcon from '@material-ui/icons/Check';
import DismissIcon from '@material-ui/icons/Clear';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ArrowPopper from '../../../components/ArrowPopper';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import DownArrow from '../../../icons/DownArrow';

const mapStateToProps = state => ({
  notifications: selectors.notifications(state),
});
const mapDispatchToProps = dispatch => ({
  onAccountChange: (id, environment) => {
    dispatch(
      actions.user.preferences.update({
        defaultAShareId: id,
        environment,
      })
    );
  },
});

@withStyles(theme => ({
  currentAccount: {
    padding: theme.spacing.unit,
    color: theme.appBar.contrast,
  },
  currentContainer: {
    // display: 'inline-flex',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  selected: {
    '&::before': {
      content: '""',
      position: 'absolute',
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: '#00ea00',
      left: 8,
      top: '50%',
      marginTop: -3,
    },
  },
  itemContainer: {
    '& button': { display: 'none' },
    '&:hover button': {
      display: 'block',
    },
  },
  itemRoot: {
    paddingRight: 68,
  },
  leave: {
    // display: 'none',
  },
  arrow: {
    fill: theme.appBar.contrast,
  },
}))
class Notifications extends Component {
  state = {
    anchorEl: null,
    open: false,
  };

  accountArrowRef = React.createRef();

  handleClick = () => {
    // console.log('handleClick');
    this.setState(state => ({
      open: !state.open,
    }));
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  componentDidMount() {
    this.setState({
      anchorEl: this.accountArrowRef.current,
    });
  }

  render() {
    const { open, anchorEl } = this.state;
    const { classes, notifications, onAccountChange } = this.props;

    if (!notifications || notifications.length === 0) {
      console.log('No notifications');

      return null;
    }

    return (
      <Fragment>
        <span onClick={this.handleClick} className={classes.currentContainer}>
          <RootRef rootRef={this.accountArrowRef}>
            <IconButton color="inherit">
              <Badge badgeContent={notifications.length} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </RootRef>
        </span>

        <ArrowPopper
          id="notifications"
          className={classes.popper}
          open={open}
          anchorEl={anchorEl}
          placement="bottom-end"
          onClose={this.handleClose}>
          <List dense>
            {notifications.map(a => (
              <ListItem
                button
                onClick={() => {
                  onAccountChange(a.id, a.environment);
                }}
                classes={{
                  root: classes.itemRoot,
                  container: classes.itemContainer,
                }}
                key={`${a.id}`}>
                <ListItemText
                  classes={{ root: a.selected && classes.selected }}
                  primary={a.label}
                />
                <ListItemSecondaryAction>
                  <IconButton className={classes.button} aria-label="Accept">
                    <AcceptIcon />
                  </IconButton>
                  <IconButton className={classes.button} aria-label="Dismiss">
                    <DismissIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </ArrowPopper>
      </Fragment>
    );
  }
}

// prettier-ignore
export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
