import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { Paper, Typography } from '@mui/material';
import CeligoPageBar from '../../components/CeligoPageBar';
import { selectors } from '../../reducers';
import actions from '../../actions';
import getRoutePath from '../../utils/routePaths';
import useConfirmDialog from '../../components/ConfirmDialog';
import { ERROR_MANAGEMENT_DOC_URL } from '../../constants';
import LoadResources from '../../components/LoadResources';
import ActionGroup from '../../components/ActionGroup';
import TextButton from '../../components/Buttons/TextButton';
import FilledButton from '../../components/Buttons/FilledButton';
import { message } from '../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  upgradeContainer: {
    margin: theme.spacing(3),
    padding: theme.spacing(3),
    fontSize: theme.spacing(2),
    border: `1px solid ${theme.palette.secondary.lightest}`,
  },
  footer: {
    height: 50,
    marginTop: theme.spacing(4),
    paddingTop: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
  },
  listMigrate: {
    '& li': {
      marginTop: theme.spacing(2),
    },
  },
  introErrorManagement: {
    marginBottom: theme.spacing(2),
  },
  successMessage: {
    marginTop: theme.spacing(2),
  },
}));
export default function UpgradeErrorManagement() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();
  const [upgradeRequested, setUpgradeRequested] = useState(false);
  const isMigrationPageAccessible = useSelector(state => {
    const isAccountOwner = selectors.isAccountOwner(state);
    const isUserInErrMgtTwoDotZero = selectors.isOwnerUserInErrMgtTwoDotZero(state);

    return isAccountOwner && !isUserInErrMgtTwoDotZero;
  });

  const commStatus = useSelector(state =>
    selectors.commStatusPerPath(state, '/profile', 'PUT')
  );

  const redirectToDashboard = useCallback(() => history.replace(getRoutePath('/')), [history]);

  const handleUpgrade = useCallback(
    () => {
      confirmDialog({
        title: 'Confirm upgrade',
        message: message.ERROR_MANAGEMENT_2.CONFIRM_UPGRADE_ERROR_MANAGEMENT,
        buttons: [
          {
            label: 'Yes, upgrade',
            dataTest: 'em2.0_confirm_upgrade',
            onClick: () => {
              dispatch(actions.user.profile.update({ useErrMgtTwoDotZero: true }));
              setUpgradeRequested(true);
            },
          },
          {
            label: 'No, cancel',
            variant: 'text',
          },
        ],
      });
    },
    [confirmDialog, dispatch],
  );

  const successMessage = useMemo(() => (
    <>
      <div> Our new error management infrastructure gives you access to <a href={`${ERROR_MANAGEMENT_DOC_URL}`} rel="noreferrer" target="_blank"> a lot of great new features</a>, with many more on the way! </div>
      <div className={classes.successMessage}> This new error management will eventually be rolled out to all accounts, and you&apos;re one of the lucky people who gets to check it out first! </div>
    </>
  ), [classes.successMessage]);

  const handleUpgradeSuccess = useCallback(() => {
    confirmDialog({
      title: "You've successfully upgraded",
      message: successMessage,
      buttons: [
        {
          label: 'Let me start managing errors!',
          onClick: () => {
            redirectToDashboard();
          },
        },
      ],
      onDialogClose: redirectToDashboard,
    });
  }, [confirmDialog, redirectToDashboard, successMessage]);

  useEffect(() => {
    if (upgradeRequested && commStatus === 'success') {
      handleUpgradeSuccess();
    }
  }, [commStatus, upgradeRequested, handleUpgradeSuccess]);

  useEffect(() => {
    if (!isMigrationPageAccessible && !upgradeRequested) {
      // This page is not accessible to EM 2.0 / if not an Account owner.. so redirect him to dashboard page
      redirectToDashboard();
    }
  }, [isMigrationPageAccessible, upgradeRequested, redirectToDashboard]);

  return (
    <LoadResources resources="integrations">
      <CeligoPageBar title="We&apos;ve a new and enhanced way to manage errors!" />
      <Paper className={classes.upgradeContainer} elevation={0}>
        <Typography variant="root" component="div" className={classes.introErrorManagement}>
          Our new error management infrastructure gives you access to <a href={`${ERROR_MANAGEMENT_DOC_URL}`} rel="noreferrer" target="_blank"> a lot of great new features</a>,
          with many more on the way! This new error management <br /> will eventually be rolled out to all accounts.
        </Typography>
        <Typography variant="root"> When you upgrade your account to our new error management platform:</Typography>

        <ul className={classes.listMigrate}>
          <li>
            <Typography variant="root">
              It will automatically upgrade all integrations that you have shared with other users.
            </Typography>
          </li>
          <li>
            <Typography variant="root">
              You cannot switch back to the current error management version. The two platforms are very different and not compatible.
            </Typography>
          </li>
          <li>
            <Typography variant="root">
              Error count may be lower because our new error management platform is already working for you, resolving duplicate errors during the upgrade process.
            </Typography>
          </li>
        </ul>

        <div className={classes.footer}>
          <ActionGroup>
            <FilledButton
              disabled={upgradeRequested}
              onClick={handleUpgrade}
              data-test="em2.0_upgrade"
              >
              {(upgradeRequested && commStatus === 'loading') ? 'Upgrading...' : 'Upgrade'}
            </FilledButton>
            <TextButton
              onClick={redirectToDashboard}
              data-test="em2.0_later">
              I&apos;ll do this later
            </TextButton>
          </ActionGroup>
        </div>

      </Paper>
    </LoadResources>
  );
}
