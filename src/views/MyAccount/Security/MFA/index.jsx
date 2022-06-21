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
    padding: theme.spacing(0, 2),
    marginBottom: theme.spacing(0.5),
  },
  content: {
    fontSize: '14px',
  },
  helpTextButton: {
    marginLeft: theme.spacing(0.5),
    height: theme.spacing(2),
    width: theme.spacing(2),
    padding: 0,
    marginRight: theme.spacing(2),
  },
  mfaConfig: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  userSettings: {
    margin: theme.spacing(2),
  },
  collapseContainer: {
    margin: theme.spacing(2),
    '& .MuiAccordionDetails-root': {
      borderTop: `1px solid ${theme.palette.secondary.lightest}`,
    },
  },
}));

function MFAConfiguration() {
  const canEditMFAConfiguration = useSelector(state => selectors.isMFAEnabled(state) && selectors.isSecretCodeGenerated(state));

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
  const isMFAConfigured = useSelector(state => selectors.isMFAConfigured(state));

  const [isMFAEnabled, setIsMFAEnabled] = useState();

  const handleEnableMFA = useCallback(() => {
    if (isMFAConfigured) {
      dispatch(actions.mfa.setUp({ ...mfaUserSettings, enabled: !mfaEnabled}));

      return;
    }
    setIsMFAEnabled(!isMFAEnabled);
  }, [isMFAConfigured, dispatch, mfaEnabled, isMFAEnabled, mfaUserSettings]);

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

  const UserSettings = () => {
    if (isAccountOwnerOrAdmin) {
      return (
        <CollapsableContainer title="My user" forceExpand>
          { areUserSettingsLoaded ? <MyUserSettings /> : <Spinner /> }
        </CollapsableContainer>
      );
    }

    return (areUserSettingsLoaded ? <MyUserSettings /> : <Spinner />);
  };

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

