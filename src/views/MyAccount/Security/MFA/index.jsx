import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import CeligoSwitch from '../../../../components/CeligoSwitch';
import PanelHeader from '../../../../components/PanelHeader';
import Help from '../../../../components/Help';
// TODO: Update once MR branch is merged
import CollapsableContainer from '../../../../components/ResourceDiffVisualizer/CollapsableContainer';
import { selectors } from '../../../../reducers';
import MFASetup from './Setup';
import EditMFAConfiguration from './EditConfiguration';
import AccountSettings from './AccountSettings';

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
}));

function MFAConfiguration() {
  const userSettings = useSelector(state => selectors.mfaUserSettings(state));

  if (userSettings) {
    return <EditMFAConfiguration />;
  }

  return <MFASetup />;
}

function MyUserSettings() {
  const classes = useStyles();
  const [isMFAEnabled, setIsMFAEnabled] = useState(false);

  const handleEnableMFA = useCallback(() => {
    setIsMFAEnabled(!isMFAEnabled);
  }, [isMFAEnabled]);

  return (
    <>
      <div className={classes.mfaSwitch}>
        <Typography variant="body2" className={classes.content}> Enable MFA </Typography>
        <Help title="Enable OIDC-based SSO" helpKey="enableSSO" className={classes.helpTextButton} />
        <CeligoSwitch
          onChange={handleEnableMFA}
          checked={isMFAEnabled} />
        {/* {isEnableSSOSwitchInProgress && <Spinner size="small" className={classes.spinner} />} */}
      </div>
      { isMFAEnabled ? (
        <div className={classes.mfaConfig}>
          <MFAConfiguration />
        </div>
      ) : null }
    </>
  );
}

export default function MFA() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <PanelHeader title="Multifactor authentication (MFA)" />
      <div className={classes.configContainer}>
        <CollapsableContainer title="My user" forceExpand>
          <MyUserSettings />
        </CollapsableContainer>
        <AccountSettings />
      </div>
    </div>
  );
}

