import React from 'react';
import { useSelector } from 'react-redux';
import DynaDateSelecor from './DynaDateSelector';
import { selectors } from '../../../reducers';

export default function DynaLicenseExpires(props) {
  const { connectorId, id, trialLicenseTemplate } = props;

  const trialEnabled = useSelector(state => selectors.resource(state, 'connectors', connectorId)?.trialEnabled);

  if ((!trialEnabled && id === 'trialEndDate') || trialLicenseTemplate) {
    return null;
  }

  return <DynaDateSelecor {...props} required={!trialEnabled && id === 'expires'} />;
}
