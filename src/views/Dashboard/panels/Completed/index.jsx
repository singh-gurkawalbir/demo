import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import {useRouteMatch} from 'react-router-dom';
import CompletedFlows from '../../../../components/JobDashboard/AccountDashboard/CompletedFlows';
import actions from '../../../../actions';
import {FILTER_KEYS_AD, DEFAULTS_COMPLETED_JOBS_FILTER, getDashboardIntegrationId} from '../../../../utils/accountDashboard';

export default function CompletedFlowsPanel() {
  const dispatch = useDispatch();
  const match = useRouteMatch();
  let { integrationId } = match.params;
  const { childId } = match.params;

  integrationId = getDashboardIntegrationId(integrationId, childId);
  useEffect(() => {
    dispatch(actions.patchFilter(`${integrationId || ''}${FILTER_KEYS_AD.COMPLETED}`, {...DEFAULTS_COMPLETED_JOBS_FILTER }));
  }, [dispatch, integrationId]);

  return <CompletedFlows />;
}
