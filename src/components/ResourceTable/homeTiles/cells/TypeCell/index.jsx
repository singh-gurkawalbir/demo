import React from 'react';
import {useSelector, shallowEqual } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { selectors } from '../../../../../reducers';
import FieldMessage from '../../../../DynaForm/fields/FieldMessage';
import { displayValue } from '../../../../../utils/string';

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

  const numFlowsText = displayValue('Flow', tile.numFlows || 0);

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

  return (
    <>
      Custom
      <FieldMessage
        isValid
        description={numFlowsText}
           />
    </>
  );
}
