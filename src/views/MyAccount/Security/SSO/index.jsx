import React from 'react';
import { useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { selectors } from '../../../../reducers';
import PanelHeader from '../../../../components/PanelHeader';
import SSOUserSettings from './SSOUserSettings';
import SSOAccountSettings from './SSOAccountSettings';
import infoText from '../../../../components/Help/infoText';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    overflowX: 'auto',
    minHeight: 124,
  },
}));

export default function Security() {
  const classes = useStyles();
  const isAccountOwner = useSelector(state => selectors.isAccountOwner(state));
  const isAccountOwnerOrAdmin = useSelector(state => selectors.isAccountOwnerOrAdmin(state));

  return (
    <div className={classes.root}>
      <PanelHeader title="Single sign-on (SSO)" infoText={isAccountOwnerOrAdmin ? infoText.OwnerAdminSSO : infoText.AccountUserSSO} />
      {!isAccountOwner && <SSOUserSettings />}
      {isAccountOwnerOrAdmin && <SSOAccountSettings />}
    </div>
  );
}

