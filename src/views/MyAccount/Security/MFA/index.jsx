import React, { useCallback, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { Typography } from '@mui/material';
import { Switch, Spinner } from '@celigo/fuse-ui';
import PanelHeader from '../../../../components/PanelHeader';
import Help from '../../../../components/Help';
import CollapsableContainer from '../../../../components/CollapsableContainer';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import MFASetup from './Setup';
import useNotifySetupSuccess from './useNotifySetupSuccess';
import EditMFAConfiguration from './EditConfiguration';
import NotificationToaster from '../../../../components/NotificationToaster';
import { MFA_URL } from '../../../../constants';
import infoText from '../../../../components/Help/infoText';
import AccountSettings from './AccountSettings';
import ActionGroup from '../../../../components/ActionGroup';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    overflowX: 'auto',
    minHeight: 124,
  },
  configContainer: {
    margin: theme.spacing(2),
  },
  content: {
    fontSize: '14px',
  },
  mfaConfig: {
    marginTop: theme.spacing(1),
  },
  userSettings: {
    margin: theme.spacing(2, 0),
  },
  collapseContainer: {
    margin: theme.spacing(2),
    '& .MuiAccordionDetails-root': {
      borderTop: `1px solid ${theme.palette.secondary.lightest}`,
    },
  },
  userSettingsContainer: {
    '& .MuiCollapse-entered': {
      minHeight: '100px !important',
    },
  },
  mfaIncompleteWarning: {
    margin: theme.spacing(2),
  },
}));

function MFAConfiguration() {
  const canEditMFAConfiguration = useSelector(state => selectors.isMFAEnabled(state) && selectors.isMFASetupComplete(state));

  if (canEditMFAConfiguration) {
    return <EditMFAConfiguration />;
  }

  return <MFASetup />;
}

function MyUserSettings() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const mfaEnabled = useSelector(state => selectors.isMFAEnabled(state));
  const mfaUserSettings = useSelector(state => selectors.mfaUserSettings(state));
  const isMFASetupComplete = useSelector(state => selectors.isMFASetupComplete(state));
  const isMFASetupIncomplete = useSelector(selectors.isMFASetupIncomplete);
  const [isMFAEnabled, setIsMFAEnabled] = useState(false);

  const handleEnableMFA = useCallback(() => {
    if (isMFASetupComplete) {
      dispatch(actions.mfa.setup({ ...mfaUserSettings, enabled: !mfaEnabled, context: 'switch' }));

      return;
    }
    setIsMFAEnabled(!isMFAEnabled);
  }, [isMFASetupComplete, dispatch, mfaEnabled, isMFAEnabled, mfaUserSettings]);

  useEffect(() => {
    setIsMFAEnabled(mfaEnabled);
  }, [mfaEnabled]);

  return (
    <div className={classes.userSettings}>
      <ActionGroup>
        <Typography variant="body2" className={classes.content}> Enable MFA </Typography>
        <Switch
          onChange={handleEnableMFA}
          checked={isMFASetupIncomplete || isMFAEnabled}
          disabled={isMFASetupIncomplete}
          sx={{ml: 0.5}}
          tooltip="Off / On"
          data-test="mfa-switch-button" />
        <Help
          title="Enable MFA"
          helpKey="mfa.enable"
          sx={{ml: 0.5}} />
      </ActionGroup>
      { isMFAEnabled || isMFASetupIncomplete ? (
        <div className={classes.mfaConfig}>
          <MFAConfiguration />
        </div>
      ) : null }
    </div>
  );
}

function MFADetails() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const areUserSettingsLoaded = useSelector(selectors.areUserSettingsLoaded);
  const isAccountOwnerOrAdmin = useSelector(state => selectors.isAccountOwnerOrAdmin(state));
  const isMFASetupIncomplete = useSelector(selectors.isMFASetupIncomplete);
  const profile = useSelector(state => selectors.userProfile(state)) || {};

  useEffect(() => {
    if (!areUserSettingsLoaded) {
      dispatch(actions.mfa.requestUserSettings());
    }
    dispatch(actions.user.preferences.request('Retrieving user profile Info'));
    if (!Object.keys(profile)) {
      dispatch(actions.user.profile.request('Retrieving user profile Info'));
    }
  }, [areUserSettingsLoaded, dispatch, profile]);

  if (isAccountOwnerOrAdmin && !isMFASetupIncomplete) {
    return (
      <>
        <div className={classes.collapseContainer}>
          <CollapsableContainer title="My user" forceExpand className={classes.userSettingsContainer}>
            { areUserSettingsLoaded ? <MyUserSettings /> : <Spinner center="screen" /> }
          </CollapsableContainer>
        </div>
        <div className={classes.collapseContainer}>
          <AccountSettings />
        </div>
      </>
    );
  }

  return (
    <div className={classes.collapseContainer}>
      {areUserSettingsLoaded ? <MyUserSettings /> : <Spinner center="screen" />}
    </div>
  );
}

const EnableMFANotification = () => {
  const classes = useStyles();
  const isMFASetupIncomplete = useSelector(selectors.isMFASetupIncomplete);

  if (!isMFASetupIncomplete) return null;

  return (
    <NotificationToaster variant="warning" size="large" className={classes.mfaIncompleteWarning}>
      <span className={classes.content}>
        You are required to enable MFA before you can continue in this account.
        <b><a target="_blank" rel="noreferrer" href={MFA_URL}> Learn more</a>.</b>
      </span>
    </NotificationToaster>
  );
};

export default function MFA() {
  const classes = useStyles();

  // Deals with showing notification whenever mfa setup is updated
  useNotifySetupSuccess();

  return (
    <div className={classes.root}>
      <PanelHeader title="Multifactor authentication (MFA)" infoText={infoText.MFA} />
      <EnableMFANotification />
      <MFADetails />
    </div>
  );
}

