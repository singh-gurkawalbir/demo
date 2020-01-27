import { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
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
import IconTextButton from '../../../components/IconTextButton';
import TrashIcon from '../../../components/icons/TrashIcon';

const useStyles = makeStyles(theme => ({
  currentAccount: {
    padding: theme.spacing(1),
    color: theme.palette.secondary.light,
  },
  currentContainer: {
    marginBottom: 5,
    fontSize: 15,
    color: theme.palette.text.hint,
    fontFamily: 'Roboto400',
    padding: 0,
    marginTop: 5,
    '& svg': {
      color: theme.palette.secondary.light,
    },
    '&:hover': {
      background: 'none',
      color: theme.palette.text.secondary,
      '& svg': {
        color: theme.palette.text.secondary,
      },
    },
  },
  popper: {
    maxWidth: '250px',
  },
  itemContainer: {
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    '& button': { display: 'none' },
    '&:hover button': {
      display: 'block',
    },
    '&:hover': {
      background: theme.palette.background.paper2,
    },
    '&:last-child': {
      border: 'none',
    },
  },
  secondaryAction: {
    right: 0,
  },
  itemRoot: {
    maxWidth: '80%',
    wordBreak: 'break-word',
    padding: theme.spacing(1),
    '&:before': {
      content: '""',
      width: '3px',
      height: '100%',
      position: 'absolute',
      background: 'transparent',
      left: '0px',
    },
    '&:hover': {
      background: 'none',
      '&:before': {
        background: theme.palette.primary.main,
      },
    },
  },
  itemSelected: {
    position: 'relative',
    '&:before': {
      content: '""',
      width: '3px',
      height: '100%',
      position: 'absolute',
      background: theme.palette.primary.main,
      left: '0px',
    },
  },
  listWrapper: {
    minWidth: 250,
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
      <IconTextButton
        onClick={handleMenu}
        variant="text"
        color="secondary"
        className={classes.currentContainer}
        aria-owns={open ? 'accountList' : null}
        aria-haspopup="true">
        {selectedAccount && selectedAccount.company}
        <ArrowDownIcon />
      </IconTextButton>

      <ArrowPopper
        id="accountList"
        className={classes.popper}
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
        onClose={handleClose}>
        <List dense className={classes.listWrapper}>
          {accounts.map(a => (
            <ListItem
              button
              onClick={() => {
                !a.selected && handleAccountChange(a.id);
              }}
              className={clsx(classes.itemRoot, {
                [classes.itemSelected]: a.selected,
              })}
              classes={{
                root: classes.itemRoot,
                container: classes.itemContainer,
              }}
              key={a.id}>
              <ListItemText>{a.company}</ListItemText>
              {a.canLeave && (
                <ListItemSecondaryAction className={classes.secondaryAction}>
                  <Button
                    data-test="leaveAccount"
                    className={classes.leave}
                    variant="text"
                    color="primary"
                    onClick={() => {
                      handleAccountLeaveClick(a);
                    }}>
                    <TrashIcon />
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
