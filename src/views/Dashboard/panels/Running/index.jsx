import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import RunningFlows from '../../../../components/JobDashboard/AccountDashboard/RunningFlows';
import LoadResources from '../../../../components/LoadResources';
import actions from '../../../../actions';
import {FILTER_KEYS_AD, DEFAULTS_RUNNING_JOBS_FILTER} from '../../../../utils/accountDashboard';

export default function RunningFlowsPanel() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.patchFilter(FILTER_KEYS_AD.RUNNING, {...DEFAULTS_RUNNING_JOBS_FILTER }));
  }, [dispatch]);

  return (
    <LoadResources required resources="flows,integrations">
      <RunningFlows />
    </LoadResources>
  );
}
