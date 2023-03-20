import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import actions from '../../../../../actions';
import { drawerPaths } from '../../../../../utils/rightDrawer';
import RightDrawer from '../../../../../components/drawer/Right';
import DrawerContent from '../../../../../components/drawer/Right/DrawerContent';
import DrawerHeader from '../../../../../components/drawer/Right/DrawerHeader';
import FilledButton from '../../../../../components/Buttons/FilledButton';
import { message } from '../../../../../utils/messageStore';

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
    dispatch(actions.license.requestTrialLicense());

    history.goBack();
  };

  return (
    <RightDrawer height="tall" width="medium" path={drawerPaths.ACCOUNT.UPGRADE}>
      <DrawerHeader title="Upgrade your subscription" />
      <DrawerContent>
        <Typography>
          {message.SUBSCRIPTION.UPGRADE_YOUR_SUBSCRIPTION}
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
            {message.INTEGRATION.LEARN_PREMIUM}
          </Typography>
        </a>
      </DrawerContent>
    </RightDrawer>
  );
}
