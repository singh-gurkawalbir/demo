import React from 'react';
import {useSelector, shallowEqual } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { selectors } from '../../../../../reducers';
import FieldMessage from '../../../../DynaForm/fields/FieldMessage';
import { getTextAfterCount } from '../../../../../utils/string';
import NotificationToaster from '../../../../NotificationToaster';

const useStyles = makeStyles({
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  tileNotification: {
    padding: '0 4px !important',
    minWidth: '145px !important',
    maxWidth: '165px !important',
  },
});

export default function TypeCell({ tile }) {
  const classes = useStyles();
  const {listViewLicenseMesssage, expired, trialExpired} = useSelector(state =>
    selectors.tileLicenseDetails(state, tile), shallowEqual
  );

  const numFlowsText = getTextAfterCount('Flow', tile.numFlows || 0);

  if (tile._connectorId) {
    return (
      <div className={classes.contentWrapper}>
        Integration app
        {listViewLicenseMesssage && (
          (expired || trialExpired)
            ? (
              <NotificationToaster variant="error" transparent className={classes.tileNotification}>
                {listViewLicenseMesssage}
              </NotificationToaster>
            ) : (
              <NotificationToaster variant="warning" transparent className={classes.tileNotification}>
                {listViewLicenseMesssage}
              </NotificationToaster>
            )
        )}
      </div>
    );
  }

  return (
    <>
      Custom <FieldMessage isValid description={numFlowsText} />
    </>
  );
}
