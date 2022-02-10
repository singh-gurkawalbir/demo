import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {useRouteMatch} from 'react-router-dom';
import CompletedFlows from '../../../../components/JobDashboard/AccountDashboard/CompletedFlows';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import {FILTER_KEYS_AD, DEFAULTS_COMPLETED_JOBS_FILTER, getDashboardIntegrationId} from '../../../../utils/accountDashboard';

export default function CompletedFlowsPanel() {
  const dispatch = useDispatch();
  const match = useRouteMatch();
  let { integrationId } = match.params;
  const { childId } = match.params;
  const isIntegrationAppV1 = useSelector(state => selectors.isIntegrationAppV1(state, integrationId));

  integrationId = getDashboardIntegrationId(integrationId, childId, isIntegrationAppV1);
  useEffect(() => {
    dispatch(actions.patchFilter(`${integrationId || ''}${FILTER_KEYS_AD.COMPLETED}`, {...DEFAULTS_COMPLETED_JOBS_FILTER }));
  }, [dispatch, integrationId]);

  return <CompletedFlows />;
}
