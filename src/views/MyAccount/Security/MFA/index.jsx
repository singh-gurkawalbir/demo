import React, { useCallback, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import CeligoSwitch from '../../../../components/CeligoSwitch';
import PanelHeader from '../../../../components/PanelHeader';
import Help from '../../../../components/Help';
import Spinner from '../../../../components/Spinner';
import CollapsableContainer from '../../../../components/CollapsableContainer';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import MFASetup from './Setup';
import useNotifySetupSuccess from './useNotifySetupSuccess';
import EditMFAConfiguration from './EditConfiguration';
// import AccountSettings from './AccountSettings';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    overflowX: 'auto',
    minHeight: 124,
  },
  configContainer: {
    margin: theme.spacing(2),
  },
  mfaSwitch: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(0.5),
  },
  content: {
    fontSize: '14px',
  },
  helpTextButton: {
    marginLeft: theme.spacing(1),
    height: theme.spacing(2),
    width: theme.spacing(2),
    padding: 0,
    marginRight: theme.spacing(2),
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
    '& .MuiCollapse-container': {
      minHeight: '100px !important',
    },
  },
}));

function MFAConfiguration() {
  const canEditMFAConfiguration = useSelector(state => selectors.isMFAEnabled(state) && selectors.isMFADeviceConnected(state));

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
  const isMFADeviceConnected = useSelector(state => selectors.isMFADeviceConnected(state));

  const [isMFAEnabled, setIsMFAEnabled] = useState();

  useNotifySetupSuccess({ mode: 'switch'});

  const handleEnableMFA = useCallback(() => {
    if (isMFADeviceConnected) {
      dispatch(actions.mfa.setup({ ...mfaUserSettings, enabled: !mfaEnabled}));

      return;
    }
    setIsMFAEnabled(!isMFAEnabled);
  }, [isMFADeviceConnected, dispatch, mfaEnabled, isMFAEnabled, mfaUserSettings]);

  useEffect(() => {
    setIsMFAEnabled(mfaEnabled);
  }, [mfaEnabled]);

  return (
    <div className={classes.userSettings}>
      <div className={classes.mfaSwitch}>
        <Typography variant="body2" className={classes.content}> Enable MFA </Typography>
        <Help title="Enable MFA" helpKey="enableMFA" className={classes.helpTextButton} />
        <CeligoSwitch onChange={handleEnableMFA} checked={isMFAEnabled} />
        {/* {isEnableSSOSwitchInProgress && <Spinner size="small" className={classes.spinner} />} */}
      </div>
      { isMFAEnabled ? (
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

  const UserSettings = React.memo(() => {
    if (isAccountOwnerOrAdmin) {
      return (
        <CollapsableContainer title="My user" forceExpand className={classes.userSettingsContainer}>
          { areUserSettingsLoaded ? <MyUserSettings /> : <Spinner centerAll /> }
        </CollapsableContainer>
      );
    }

    return (areUserSettingsLoaded ? <MyUserSettings /> : <Spinner centerAll />);
  }, [areUserSettingsLoaded, classes, isAccountOwnerOrAdmin]);

  useEffect(() => {
    if (!areUserSettingsLoaded) {
      dispatch(actions.mfa.requestUserSettings());
    }
  }, [areUserSettingsLoaded, dispatch]);

  // TODO: Account settings will be added in Phase 2
  return (
    <div className={classes.collapseContainer}>
      <UserSettings />
    </div>
  );
}

export default function MFA() {
  const classes = useStyles();
  const infoTextMFA = 'MFA info';

  return (
    <div className={classes.root}>
      <PanelHeader title="Multifactor authentication (MFA)" infoText={infoTextMFA} />
      <MFADetails />
    </div>
  );
}

