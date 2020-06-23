
import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DynaCheckbox from './DynaCheckbox';
import * as selectors from '../../../../reducers';
import useEnqueueSnackbar from '../../../../hooks/enqueueSnackbar';
import { COMM_STATES } from '../../../../reducers/comms/networkComms';
import actions from '../../../../actions';
import Spinner from '../../../Spinner';


export default function DynaFeatureCheck(props) {
  const dispatch = useDispatch();
  const { ssLinkedConnectionId, _integrationId: integrationId, featureName, onFieldChange: fieldChange, id, value} = props;
  const {status, message} = useSelector(state => selectors.suiteScriptFeatureCheckState(state, { ssLinkedConnectionId, integrationId, featureName}));
  const [enquesnackbar] = useEnqueueSnackbar();

  useEffect(() => () => {
    dispatch(actions.suiteScript.featureCheck.clear(ssLinkedConnectionId, integrationId, featureName));
  }, [dispatch, featureName, integrationId, ssLinkedConnectionId]);

  useEffect(() => {
    if (status === COMM_STATES.ERROR && !!value) {
      enquesnackbar({
        message,
        variant: 'error',
      });
      fieldChange(id, false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enquesnackbar, message, status, id, value]);

  const onFieldChange = useCallback((id, value) => {
    fieldChange(id, value);
    if (value) { dispatch(actions.suiteScript.featureCheck.request(ssLinkedConnectionId, integrationId, featureName)); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, featureName, integrationId, ssLinkedConnectionId]);

  if (status === 'requesting') { return <Spinner />; }
  return (
    <DynaCheckbox {...props} onFieldChange={onFieldChange} />
  );
}
