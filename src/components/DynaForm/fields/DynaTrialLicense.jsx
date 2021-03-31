import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import DynaSelectResource from './DynaSelectResource';
import actions from '../../../actions';

export default function DynaTrialLicense(props) {
  const dispatch = useDispatch();
  const { connectorId } = props;

  useEffect(() => {
    dispatch(
      actions.resource.requestCollection(`connectors/${connectorId}/licenses`)
    );

    return () =>
      dispatch(actions.resource.clearCollection('connectorLicenses'));
  }, [connectorId, dispatch]);

  return <DynaSelectResource {...props} />;
}
