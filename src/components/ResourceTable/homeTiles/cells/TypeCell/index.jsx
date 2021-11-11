import React from 'react';
import {useSelector, shallowEqual } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { selectors } from '../../../../../reducers';
import FieldMessage from '../../../../DynaForm/fields/FieldMessage';

const useStyles = makeStyles({
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
});

export default function TypeCell({ tile }) {
  const classes = useStyles();
  const {listViewLicenseMesssage, expired, trialExpired} = useSelector(state =>
    selectors.tileLicenseDetails(state, tile), shallowEqual
  );

  const numFlowsText = `${tile.numFlows} Flow${tile.numFlows === 1 ? '' : 's'}`;

  if (tile._connectorId) {
    return (
      <div className={classes.contentWrapper}>
        Integration app
        {listViewLicenseMesssage && (
          (expired || trialExpired)
            ? <FieldMessage errorMessages={listViewLicenseMesssage} /> : <FieldMessage warningMessages={listViewLicenseMesssage} />
        )}
      </div>
    );
  }

  return tile.ssLinkedConnectionId ? 'Custom'
    : (
      <>
        Custom
        <FieldMessage
          isValid
          description={numFlowsText}
           />
      </>
    );
}
