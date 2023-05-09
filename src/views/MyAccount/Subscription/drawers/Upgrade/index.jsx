import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Typography } from '@mui/material';
import { FilledButton } from '@celigo/fuse-ui';
import actions from '../../../../../actions';
import { drawerPaths } from '../../../../../utils/rightDrawer';
import RightDrawer from '../../../../../components/drawer/Right';
import DrawerContent from '../../../../../components/drawer/Right/DrawerContent';
import DrawerHeader from '../../../../../components/drawer/Right/DrawerHeader';
import { message } from '../../../../../utils/messageStore';

export default function UpgradeDrawer() {
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
          sx={{
            display: 'block',
            margin: '24px 0px',
          }}
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
