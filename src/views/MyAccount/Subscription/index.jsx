import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import DIY from './DIY';
import Integrator from './Integrator';
import Endpoint from './Endpoint';


export default function Subscription() {
  const dispatch = useDispatch();
  const integratorLicense = useSelector(state =>
    selectors.integratorLicense(state)
  );
  const diyLicense = useSelector(state => selectors.diyLicense(state));
  const endpointLicense = useSelector(state => selectors.endpointLicense(state));
  const getNumEnabledFlows = useCallback(() => {
    dispatch(actions.user.org.accounts.requestNumEnabledFlows());
  }, [dispatch]);

  useEffect(() => {
    if (integratorLicense) {
      getNumEnabledFlows();
    }
  }, [getNumEnabledFlows, integratorLicense]);


  return (
    <>
      {diyLicense && (<DIY />
      )}
      {integratorLicense && (
        <Integrator />
      )}
      {endpointLicense && (
        <Endpoint />
      )}
    </>
  );
}
