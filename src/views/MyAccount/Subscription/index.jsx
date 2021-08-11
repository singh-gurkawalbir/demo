import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../reducers';
import DIY from './DIY';
import Integrator from './Integrator';
import Endpoint from './Endpoint';

export default function Subscription() {
  const licenseType = useSelector(state => selectors.platformLicense(state)?.type);

  switch (licenseType) {
    case 'diy':
      return <DIY />;
    case 'integrator':
      return <Integrator />;
    case 'endpoint':
      return <Endpoint />;
    default:
      return null;
  }
}
