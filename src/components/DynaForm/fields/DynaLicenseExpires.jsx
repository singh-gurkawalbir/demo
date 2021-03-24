import React from 'react';
import { useSelector } from 'react-redux';
import DynaDateSelecor from './DynaDateSelector';
import { selectors } from '../../../reducers';

export default function DynaLicenseExpires(props) {
  const { connectorId, id, trialLicenseTemplate } = props;

  const trialEnabled = useSelector(state => selectors.resource(state, 'connectors', connectorId)?.trialEnabled);
  //   If the “Enable trials” flag is set on the IA listing, following changes are also implemented in the Integration App author’s IO account:
  // On the Home -> Resources -> Integration Apps -> [Integration App] -> Licenses -> Create/Edit license page, a new field “Trial expires” is displayed (this field already exists on IO license schema)
  // ‘Expires” field becomes non-mandatory if Trials enabled ”Enable trials” flag is true. To save a license, one of expires/trial expires must be populated.

  if ((!trialEnabled && id === 'trialEndDate') || trialLicenseTemplate) {
    return null;
  }

  return <DynaDateSelecor {...props} required={!trialEnabled && id === 'expires'} />;
}
