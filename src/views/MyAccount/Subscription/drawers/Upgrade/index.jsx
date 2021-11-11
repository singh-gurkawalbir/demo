import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles, Typography } from '@material-ui/core';
import actions from '../../../../../actions';
import RightDrawer from '../../../../../components/drawer/Right';
import DrawerContent from '../../../../../components/drawer/Right/DrawerContent';
import DrawerHeader from '../../../../../components/drawer/Right/DrawerHeader';
import FilledButton from '../../../../../components/Buttons/FilledButton';

const useStyles = makeStyles(theme => ({
  button: {
    display: 'block',
    margin: theme.spacing(3, 0),
  },
}));

export default function UpgradeDrawer() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const onStartFreeTrialInterestedClick = () => {
    dispatch(actions.analytics.gainsight.trackEvent('GO_UNLIMITED_BUTTON_CLICKED'));
    dispatch(actions.user.org.accounts.requestTrialLicense());

    history.goBack();
  };

  return (
    <RightDrawer height="tall" width="medium" path="upgrade" variant="temporary">
      <DrawerHeader title="Upgrade your subscription" />
      <DrawerContent>
        <Typography>
          You are currently on the Free Edition of integrator.io, which gives
          you one active flow at any given time. Upgrade to one of our paid
          subscriptions and unlock multiple flow activation to fulfill all
          your integration needs.
        </Typography>

        <FilledButton
          className={classes.button}
          onClick={onStartFreeTrialInterestedClick}>
          Yes, I&apos;m interested
        </FilledButton>
        <a
          target="_blank"
          rel="noopener noreferrer"
          data-test="learnmore-link"
          href="https://www.celigo.com/ipaas-integration-platform/#Pricing">
          <Typography variant="h5" color="primary">
            Learn more about integrator.io premium packages
          </Typography>
        </a>
      </DrawerContent>
    </RightDrawer>
  );
}
