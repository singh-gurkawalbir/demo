import React from 'react';
import {useSelector, shallowEqual } from 'react-redux';
import { selectors } from '../../../../../reducers';
import FieldMessage from '../../../../DynaForm/fields/FieldMessage';

// todo: ashu css

export default function TypeCell({ tile }) {
  const {listViewLicenseMesssage} = useSelector(state =>
    selectors.tileLicenseDetails(state, tile), shallowEqual
  );

  const numFlowsText = `${tile.numFlows} Flow${tile.numFlows === 1 ? '' : 's'}`;

  if (tile._connectorId) {
    return `Integration app ${listViewLicenseMesssage}`;
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
