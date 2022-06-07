import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../reducers';
import CeligoSwitch from '../../CeligoSwitch';
import Help from '../../Help';
import Spinner from '../../Spinner';

const useStyles = makeStyles(theme => ({
  helpTextButton: {
    marginLeft: theme.spacing(0.5),
    height: theme.spacing(2),
    width: theme.spacing(2),
    padding: 0,
    marginRight: theme.spacing(2),
  },
  ssoSwitch: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(0.5),
  },
  content: {
    fontSize: '14px',
  },
  spinner: {
    marginLeft: theme.spacing(0.5),
    display: 'flex',
  },
}));

export default function DynaEnableSSO({resourceId, isSSOEnabled, handleEnableSSO}) {
  const classes = useStyles();
  const isEnableSSOSwitchInProgress = useSelector(state => selectors.commStatusPerPath(state, `/ssoclients/${resourceId}`, 'PATCH') === 'loading');

  return (
    <div className={classes.ssoSwitch}>
      <Typography variant="body2" className={classes.content}> Enable OIDC-based SSO </Typography>
      <Help title="Enable OIDC-based SSO" helpKey="enableSSO" className={classes.helpTextButton} />
      <CeligoSwitch
        onChange={handleEnableSSO}
        checked={isSSOEnabled} />
      {isEnableSSOSwitchInProgress && <Spinner size="small" className={classes.spinner} />}
    </div>
  );
}
