import React, { useEffect, useMemo } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import Spinner from '../../../Spinner';
import DynaSelect from '../DynaSelect';

export default function DynaIntegrationCloneSelect(props) {
  const { integrationId } = props;
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

  const options = useMemo(() => [{
    items: (cloneList || []).map(clone => ({ label: clone.name, value: clone._id })),
  }], [cloneList]);

  if (isLoadingCloneFamily) {
    return <Spinner />;
  }

  return <DynaSelect {...props} options={options} />;
}

