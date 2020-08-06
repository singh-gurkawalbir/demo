import React from 'react';
import { useSelector } from 'react-redux';
import * as selectors from '../../../reducers';
import DIY from './DIY';
import Integrator from './Integrator';
import Endpoint from './Endpoint';

export default function Subscription() {
  const license = useSelector(state =>
    selectors.platformLicense(state)
  );

  return (
    <>
      {license?.type === 'diy' && (<DIY />
      )}
      {license?.type === 'integrator' && (
        <Integrator />
      )}
      {license?.type === 'endpoint' && (
        <Endpoint />
      )}
    </>
  );
}
