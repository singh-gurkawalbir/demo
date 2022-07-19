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
import infoText from '../../infoText';
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
      <div className={classes.mfaSwitch}>
        <Typography variant="body2" className={classes.content}> Enable MFA </Typography>
        <Help title="Enable MFA" helpKey="mfa.enable" className={classes.helpTextButton} />
        <CeligoSwitch onChange={handleEnableMFA} checked={isMFAEnabled} />
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

  useEffect(() => {
    if (!areUserSettingsLoaded) {
      dispatch(actions.mfa.requestUserSettings());
    }
  }, [areUserSettingsLoaded, dispatch]);

  // TODO: Account settings will be added in Phase 2

  if (isAccountOwnerOrAdmin) {
    return (
      <div className={classes.collapseContainer}>
        <CollapsableContainer title="My user" forceExpand className={classes.userSettingsContainer}>
          { areUserSettingsLoaded ? <MyUserSettings /> : <Spinner centerAll /> }
        </CollapsableContainer>
      </div>
    );
  }

  return (
    <div className={classes.collapseContainer}>
      {areUserSettingsLoaded ? <MyUserSettings /> : <Spinner centerAll />}
    </div>
  );
}

export default function MFA() {
  const classes = useStyles();

  // Deals with showing notification whenever mfa setup is updated
  useNotifySetupSuccess();

  return (
    <div className={classes.root}>
      <PanelHeader title="Multifactor authentication (MFA)" infoText={infoText.MFA} />
      <MFADetails />
    </div>
  );
}

