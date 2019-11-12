import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { RootRef, Typography, Tooltip, IconButton } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
// TODO: Azhar, can you fix these icons?
import AcceptIcon from '@material-ui/icons/Check';
import DismissIcon from '@material-ui/icons/Clear';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ArrowPopper from '../../../components/ArrowPopper';
import actions from '../../../actions';
import * as selectors from '../../../reducers';

const mapStateToProps = state => ({
  notifications: selectors.notifications(state),
});
const mapDispatchToProps = dispatch => ({
  onClick: (action, id) => {
    switch (action) {
      case 'accept':
        return dispatch(actions.user.org.accounts.acceptInvite(id));
      case 'reject':
        return dispatch(actions.user.org.accounts.rejectInvite(id));
      default:
        return null;
    }
  },
});

@withStyles(() => ({
  currentContainer: {
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  itemContainer: {
    '& button': { display: 'none' },
    '&:hover button': {
      display: 'inline',
    },
  },
  itemRoot: {
    paddingRight: 90,
  },
}))
class Notifications extends Component {
  state = {
    anchorEl: null,
  };

  accountArrowRef = React.createRef();

  handleClick = event => {
    this.setState({
      anchorEl: !this.state.anchorEl ? event.currentTarget : null,
    });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  componentDidMount() {
    this.setState({
      anchorEl: this.accountArrowRef.current,
    });
  }

  render() {
    const { anchorEl } = this.state;
    const { classes, notifications, onClick } = this.props;
    const open = !!anchorEl;

    if (!notifications || notifications.length === 0) {
      return (
        <Tooltip title="No notifications" placement="bottom">
          <IconButton size="small" color="inherit">
            <NotificationsIcon />
          </IconButton>
        </Tooltip>
      );
    }

    return (
      <Fragment>
        <span
          data-test="notificationsIconToggle"
          onClick={this.handleClick}
          className={classes.currentContainer}>
          <RootRef rootRef={this.accountArrowRef}>
            <IconButton size="small" color="inherit">
              <Badge badgeContent={notifications.length} color="primary">
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
                classes={{
                  root: classes.itemRoot,
                  container: classes.itemContainer,
                }}
                key={`${a.id}`}>
                <ListItemText
                  primary={
                    <Fragment>
                      <Typography component="span">
                        {a.ownerUser.name || a.ownerUser.company}
                      </Typography>
                    </Fragment>
                  }
                  secondary={
                    <Typography>
                      {a.ownerUser.email} is inviting you to join their account.
                      Please accept or decline this invitation.
                    </Typography>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    className={classes.button}
                    data-test={`accept ${a.ownerUser.name ||
                      a.ownerUser.company}`}
                    aria-label="Accept"
                    onClick={() => {
                      onClick('accept', a.id);
                    }}>
                    <AcceptIcon />
                  </IconButton>
                  <IconButton
                    className={classes.button}
                    data-test={`dismiss ${a.ownerUser.name ||
                      a.ownerUser.company}`}
                    aria-label="Dismiss"
                    onClick={() => {
                      onClick('reject', a.id);
                    }}>
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
