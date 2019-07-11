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
import { withRouter } from 'react-router-dom';
import ArrowPopper from '../../../components/ArrowPopper';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import DownArrow from '../../../components/icons/DownArrow';
import { confirmDialog } from '../../../components/ConfirmDialog';
import getRoutePath from '../../../utils/routePaths';

const mapStateToProps = state => {
  let accounts = selectors.accountSummary(state);
  const userPreferences = selectors.userPreferences(state);
  const productionAccounts = accounts.filter(
    a => a.environment === 'production'
  );

  accounts = accounts.map(a => {
    if (productionAccounts.length === 1) {
      return {
        ...a,
        label: a.environment === 'sandbox' ? 'Sandbox' : 'Production',
      };
    } else if (productionAccounts.length > 1) {
      if (a.environment === 'sandbox') {
        return {
          ...a,
          label: `${a.company} - Sandbox`,
        };
      }

      const selectedAccountsSandbox = accounts.find(
        sa => sa.id === a.id && sa.environment === 'sandbox'
      );

      return {
        ...a,
        label: selectedAccountsSandbox
          ? `${a.company} - Production`
          : a.company,
      };
    }

    return a;
  });

  return {
    accounts,
    userPreferences,
  };
};

const mapDispatchToProps = dispatch => ({
  onAccountChange: (id, environment) => {
    dispatch(actions.user.org.accounts.switchTo({ id, environment }));
  },
  onAccountLeave: id => {
    dispatch(actions.user.org.accounts.leave(id));
  },
});

@withStyles(theme => ({
  currentAccount: {
    padding: theme.spacing.unit,
    color: theme.appBar.contrast,
  },
  currentContainer: {
    display: 'inline-flex',
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
class AccountList extends Component {
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

  handleAccountChange = (id, environment) => {
    const { history, onAccountChange } = this.props;

    history.push(getRoutePath('/'));
    onAccountChange(id, environment);
  };
  handleAccountLeaveClick = account => {
    confirmDialog({
      title: 'Leave Account',
      // eslint-disable-next-line prettier/prettier
      message: `By leaving the account "${account.company}", you will no longer have access to the account or any of the integrations within the account.`,
      buttons: [
        {
          label: 'Cancel',
        },
        {
          label: 'Yes',
          onClick: () => {
            const { userPreferences, history, onAccountLeave } = this.props;

            if (userPreferences.defaultAShareId === account.id) {
              history.push(getRoutePath('/'));
            }

            onAccountLeave(account.id);
          },
        },
      ],
    });
  };

  render() {
    const { anchorEl } = this.state;
    const { classes, accounts } = this.props;
    const open = !!anchorEl;

    if (!accounts || accounts.length < 2) {
      // when user is part of only one org, no need to show the accounts
      return null;
    }

    const selectedAccount = accounts.find(a => a.selected);

    return (
      <Fragment>
        <span onClick={this.handleClick} className={classes.currentContainer}>
          <Typography
            className={classes.currentAccount}
            aria-owns={open ? 'accountList' : null}
            aria-haspopup="true">
            {selectedAccount && selectedAccount.label}
          </Typography>
          <RootRef rootRef={this.accountArrowRef}>
            <DownArrow className={classes.arrow} />
          </RootRef>
        </span>

        <ArrowPopper
          id="accountList"
          className={classes.popper}
          open={open}
          anchorEl={anchorEl}
          placement="bottom-end"
          onClose={this.handleClose}>
          <List dense>
            {accounts.map(a => (
              <ListItem
                button
                onClick={() => {
                  !a.selected && this.handleAccountChange(a.id, a.environment);
                }}
                classes={{
                  root: classes.itemRoot,
                  container: classes.itemContainer,
                }}
                key={`${a.id}-${a.environment}`}>
                <ListItemText
                  classes={{ root: a.selected && classes.selected }}
                  primary={a.label || a.company}
                />
                {a.canLeave && (
                  <ListItemSecondaryAction>
                    <Button
                      className={classes.leave}
                      variant="text"
                      onClick={() => {
                        this.handleAccountLeaveClick(a);
                      }}>
                      Leave
                    </Button>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))}
          </List>
        </ArrowPopper>
      </Fragment>
    );
  }
}

// prettier-ignore
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AccountList)
);
