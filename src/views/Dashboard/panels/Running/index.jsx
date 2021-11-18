import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RunningFlows from '../../../../components/JobDashboard/AccountDashboard/RunningFlows';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import {FILTER_KEYS_AD, DEFAULTS_RUNNING_JOBS_FILTER} from '../../../../utils/accountDashboard';

export default function RunningFlowsPanel() {
  const dispatch = useDispatch();
  const filters = useSelector(state => selectors.filter(state, FILTER_KEYS_AD.COMPLETED));
  const { integrationId } = filters;

  useEffect(() => {
    dispatch(actions.patchFilter(`${integrationId || ''}${FILTER_KEYS_AD.RUNNING}`, {...DEFAULTS_RUNNING_JOBS_FILTER }));
  }, [dispatch, integrationId]);

  return <RunningFlows />;
}
