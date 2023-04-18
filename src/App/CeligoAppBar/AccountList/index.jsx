import React, { useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { useHistory } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import useConfirmDialog from '../../../components/ConfirmDialog';
import ArrowPopper from '../../../components/ArrowPopper';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import ArrowDownIcon from '../../../components/icons/ArrowDownIcon';
import getRoutePath from '../../../utils/routePaths';
import TrashIcon from '../../../components/icons/TrashIcon';
import { TextButton } from '../../../components/Buttons';
import { stringCompare } from '../../../utils/sort';
import { message } from '../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  currentAccount: {
    padding: theme.spacing(1),
    color: theme.palette.secondary.light,
  },
  currentContainer: {
    fontSize: 13,
    color: theme.palette.secondary.main,
    fontFamily: 'source sans pro',
    padding: 0,
    paddingRight: theme.spacing(1),
    marginRight: theme.spacing(-1),
    '& svg': {
      marginLeft: theme.spacing(0.5),
    },
    '&:hover': {
      background: 'none',
      color: theme.palette.text.secondary,
      '& svg': {
        color: theme.palette.text.secondary,
      },
    },
  },
  accountListPopper: {
    maxWidth: 250,
    left: '116px !important',
    top: '5px !important',
  },
  accountListPopperArrow: {
    left: '110px !important',
  },
  itemContainer: {
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    maxWidth: 248,
    '& button': {
      minWidth: 0,
      display: 'none',
      paddingRight: theme.spacing(1),
    },
    '&:hover button': {
      display: 'block',
    },
    '&:hover': {
      background: theme.palette.background.paper2,
      '&:first-child': {
        borderRadius: [0, 4, 4, 0],
      },
      '&:last-child': {
        borderRadius: [0, 4, 4, 0],
      },
    },
    '&:last-child': {
      border: 'none',
    },
  },
  secondaryAction: {
    right: 0,
  },
  itemRoot: {
    wordBreak: 'break-word',
    padding: theme.spacing(1),
    paddingRight: '20%',
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
    maxHeight: 592,
    overflowY: 'auto',
  },
  itemRootName: {
    margin: 0,
    fontSize: 15,
    lineHeight: '18px',
  },
  deleteIcon: {
    padding: 0,
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
}));

function AccountList() {
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const userPreferences = useSelector(state =>
    selectors.userPreferences(state)
  );
  // TODO:should we memoize this selector
  const accounts = useSelector(state => selectors.accountSummary(state));
  const open = !!anchorEl;
  const handleMenu = useCallback(
    event => {
      setAnchorEl(anchorEl ? null : event.currentTarget);
    },
    [anchorEl]
  );
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);
  const handleAccountChange = useCallback(
    id => {
      handleClose();
      history.push(getRoutePath('/'));
      dispatch(actions.user.org.accounts.switchTo({ id }));
    },
    [dispatch, handleClose, history]
  );
  const { confirmDialog } = useConfirmDialog();
  const handleAccountLeaveClick = useCallback(
    account => {
      handleClose();
      confirmDialog({
        title: 'Confirm leave',
        message: message.USER_SIGN_IN.WANT_TO_LEAVE_ACCOUNT,
        buttons: [
          {
            label: 'Leave',
            onClick: () => {
              if (userPreferences.defaultAShareId === account.id) {
                history.push(getRoutePath('/'));
              }

              dispatch(actions.user.org.accounts.leave(account.id, userPreferences.defaultAShareId === account.id));
            },
          },
          {
            label: 'Cancel',
            variant: 'text',
          },
        ],
      });
    },
    [
      confirmDialog,
      dispatch,
      handleClose,
      history,
      userPreferences.defaultAShareId,
    ]
  );

  if (!accounts || accounts.length < 2) {
    // when user is part of only one org, no need to show the accounts
    return null;
  }

  const selectedAccount = accounts.find(a => a.selected);

  return (
    <>
      <TextButton
        data-private
        onClick={handleMenu}
        endIcon={<ArrowDownIcon />}
        className={classes.currentContainer}
        aria-owns={open ? 'accountList' : null}
        aria-haspopup="true">
        {selectedAccount && selectedAccount.company}
      </TextButton>

      <ArrowPopper
        id="accountList"
        open={open}
        anchorEl={anchorEl}
        classes={{
          popper: classes.accountListPopper,
          arrow: classes.accountListPopperArrow,
        }}
        placement="bottom-end"
        onClose={handleClose}>
        <List
          dense className={classes.listWrapper}>
          {accounts.sort(stringCompare('company')).map(a => (
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
              <ListItemText data-private className={classes.itemRootName}>{a.company}</ListItemText>
              {a.company && a.canLeave && (
                <ListItemSecondaryAction className={classes.secondaryAction}>
                  <IconButton
                    data-test="leaveAccount"
                    className={classes.deleteIcon}
                    size="small"
                    onClick={() => {
                      handleAccountLeaveClick(a);
                    }}>
                    <TrashIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
        </List>
      </ArrowPopper>
    </>
  );
}
export default function AccountListMemo() {
  return useMemo(() => <AccountList />, []);
}
