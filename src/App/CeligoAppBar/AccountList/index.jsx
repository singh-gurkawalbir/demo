import { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { useHistory } from 'react-router-dom';
import ArrowPopper from '../../../components/ArrowPopper';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import ArrowDownIcon from '../../../components/icons/ArrowDownIcon';
import { confirmDialog } from '../../../components/ConfirmDialog';
import getRoutePath from '../../../utils/routePaths';

const useStyles = makeStyles(theme => ({
  currentAccount: {
    padding: theme.spacing(1),
    color: theme.palette.common.white,
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
    fill: theme.palette.common.white,
  },
}));

export default function AccountList() {
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const userPreferences = useSelector(state =>
    selectors.userPreferences(state)
  );
  const accounts = useSelector(state => selectors.accountSummary(state));
  const open = !!anchorEl;
  const handleMenu = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAccountChange = id => {
    handleClose();
    history.push(getRoutePath('/'));
    dispatch(actions.user.org.accounts.switchTo({ id }));
  };

  const handleAccountLeaveClick = account => {
    handleClose();
    confirmDialog({
      title: 'Leave Account',
      // eslint-disable-next-line prettier/prettier
      message: `By leaving the account "${account.company}", 
        you will no longer have access to the account or any of the integrations within the account.`,
      buttons: [
        {
          label: 'Cancel',
        },
        {
          label: 'Yes',
          onClick: () => {
            if (userPreferences.defaultAShareId === account.id) {
              history.push(getRoutePath('/'));
            }

            dispatch(actions.user.org.accounts.leave(account.id));
          },
        },
      ],
    });
  };

  if (!accounts || accounts.length < 2) {
    // when user is part of only one org, no need to show the accounts
    return null;
  }

  const selectedAccount = accounts.find(a => a.selected);

  return (
    <Fragment>
      <span onClick={handleMenu} className={classes.currentContainer}>
        <Typography
          className={classes.currentAccount}
          aria-owns={open ? 'accountList' : null}
          aria-haspopup="true">
          {selectedAccount && selectedAccount.company}
        </Typography>
        <ArrowDownIcon className={classes.arrow} />
      </span>
      <ArrowPopper
        id="accountList"
        className={classes.popper}
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
        onClose={handleClose}>
        <List dense>
          {accounts.map(a => (
            <ListItem
              button
              onClick={() => {
                !a.selected && handleAccountChange(a.id);
              }}
              classes={{
                root: classes.itemRoot,
                container: classes.itemContainer,
              }}
              key={a.id}>
              <ListItemText
                classes={{ root: a.selected && classes.selected }}
                primary={a.company}
              />
              {a.canLeave && (
                <ListItemSecondaryAction>
                  <Button
                    data-test="leaveAccount"
                    className={classes.leave}
                    variant="text"
                    onClick={() => {
                      handleAccountLeaveClick(a);
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
