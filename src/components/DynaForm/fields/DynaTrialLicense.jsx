import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DynaSelectResource from './DynaSelectResource';
import actions from '../../../actions';
import { selectors } from '../../../reducers';

export default function DynaTrialLicense(props) {
  const dispatch = useDispatch();
  const { connectorId } = props;
  const preferences = useSelector(state =>
    selectors.userProfilePreferencesProps(state)
  );
  const filter = { 'user.email': preferences?.email };

  useEffect(() => {
    dispatch(
      actions.resource.requestCollection(`connectors/${connectorId}/licenses`)
    );

    return () =>
      dispatch(actions.resource.clearCollection('connectorLicenses'));
  }, [connectorId, dispatch]);

  return <DynaSelectResource {...props} filter={filter} />;
}
