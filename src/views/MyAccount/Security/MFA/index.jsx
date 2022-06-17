import React, { useCallback, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import CeligoSwitch from '../../../../components/CeligoSwitch';
import PanelHeader from '../../../../components/PanelHeader';
import Help from '../../../../components/Help';
import CollapsableContainer from '../../../../components/CollapsableContainer';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
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
  const isMFAEnabled = useSelector(state => selectors.isMFAEnabled(state));

  if (isMFAEnabled) {
    return <EditMFAConfiguration />;
  }

  return <MFASetup />;
}

function MyUserSettings() {
  const classes = useStyles();
  const mfaEnabled = useSelector(state => selectors.isMFAEnabled(state));

  const [isMFAEnabled, setIsMFAEnabled] = useState(mfaEnabled);

  const handleEnableMFA = useCallback(() => {
    setIsMFAEnabled(!isMFAEnabled);
  }, [isMFAEnabled]);

  return (
    <div className={classes.userSettings}>
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
    </div>
  );
}

export default function MFA() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const hasMFASettings = useSelector(selectors.mfaUserSettings);

  useEffect(() => {
    if (!hasMFASettings) {
      dispatch(actions.mfa.requestUserSettings());
    }
  }, [hasMFASettings, dispatch]);

  return (
    <div className={classes.root}>
      <PanelHeader title="Multifactor authentication (MFA)" />
      <div className={classes.collapseContainer}>
        <CollapsableContainer title="My user" forceExpand>
          <MyUserSettings />
        </CollapsableContainer>
      </div>
      <div className={classes.collapseContainer}>
        <AccountSettings />
      </div>
    </div>
  );
}

