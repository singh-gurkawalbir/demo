import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import PanelHeader from '../../../../components/PanelHeader';
import { selectors } from '../../../../reducers';
import MFASetup from './Setup';
import EditMFAConfiguration from './EditConfiguration';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    overflowX: 'auto',
    minHeight: 124,
  },
}));

export default function MFA() {
  const classes = useStyles();
  const userSettings = useSelector(state => selectors.mfaUserSettings(state));

  return (
    <div className={classes.root}>
      <PanelHeader title="MFA" />
      { !userSettings && <MFASetup /> }
      { userSettings && <EditMFAConfiguration /> }
    </div>
  );
}

