import React, { useEffect} from 'react';
import {useSelector, useDispatch } from 'react-redux';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import Spinner from '../../../Spinner';

export default function DynaIntegrationCloneSelect({ integrationId }) {
  const dispatch = useDispatch();
  const {fetchStatus, isLoadingCloneFamily} = useSelector(state => {
    const fetchStatus = selectors.cloneFamilyFetchStatus(state, integrationId);

    return {
      fetchStatus,
      isLoadingCloneFamily: fetchStatus === 'requested',
    };
  }, shallowEqual);

  const cloneList = useSelector(state => selectors.cloneFamily(state, integrationId));

  useEffect(() => {
    if (!fetchStatus) {
      dispatch(actions.integrationLCM.cloneFamily.request(integrationId));
    }
  }, [dispatch, integrationId, fetchStatus]);

  if (isLoadingCloneFamily) {
    return <Spinner />;
  }

  return <div> test {JSON.stringify(cloneList)} </div>;
}
