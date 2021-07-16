import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import CompletedFlows from '../../../../components/JobDashboard/AccountDashboard/CompletedFlows';
import LoadResources from '../../../../components/LoadResources';
import actions from '../../../../actions';
import {FILTER_KEYS_AD, DEFAULTS_COMPLETED_JOBS_FILTER} from '../../../../utils/accountDashboard';

export default function CompletedFlowsPanel() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.patchFilter(FILTER_KEYS_AD.COMPLETED, {...DEFAULTS_COMPLETED_JOBS_FILTER }));
  }, [dispatch]);

  return (
    <LoadResources required resources="flows,integrations">

      <CompletedFlows />
    </LoadResources>
  );
}
