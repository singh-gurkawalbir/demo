import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Box } from '@mui/material';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import PanelHeader from '../../../../../components/PanelHeader';
import LoadResources from '../../../../../components/LoadResources';
import ChartsDrawer from '../../../../../components/LineGraph/Dashboard';
import { message } from '../../../../../utils/messageStore';

export default function AnalyticsPanel({ integrationId, childId }) {
  const dispatch = useDispatch();
  const filterChildId = useSelector(
    state => selectors.filter(state, 'jobs').childId
  );

  const infoTextDashboard = message.ERROR_MANAGEMENT_2.ERROR_MANAGEMENT_DASHBOARD_INFO;

  // We may not have an IA that supports children, but those who do,
  // we want to reset the jobs filter any time the child changes.
  useEffect(() => {
    if (childId !== filterChildId) {
      dispatch(
        actions.patchFilter('jobs', {
          childId,
          flowId: '',
          currentPage: 0,
        })
      );
    }
  }, [dispatch, filterChildId, childId]);

  return (
    <Box
      sx={{
        backgroundColor: theme => theme.palette.background.paper,
        overflow: 'auto',
        border: '1px solid',
        borderColor: theme => theme.palette.secondary.lightest,
      }}>
      <LoadResources required integrationId={integrationId} resources="flows">
        <PanelHeader title="Analytics" infoText={infoTextDashboard} />
        <ChartsDrawer integrationId={integrationId} childId={childId} />
      </LoadResources>
    </Box>
  );
}
