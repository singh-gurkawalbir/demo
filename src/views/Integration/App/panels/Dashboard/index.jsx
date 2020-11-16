import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import JobDashboard from '../../../../../components/JobDashboard';
import PanelHeader from '../../../../../components/PanelHeader';
import LoadResources from '../../../../../components/LoadResources';
import ChartsDrawer from '../../../../../components/LineGraph/Dashboard';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    overflow: 'auto',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
}));

export default function DashboardPanel({ integrationId, storeId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const filterStoreId = useSelector(
    state => selectors.filter(state, 'jobs').storeId
  );
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
  let infoTextDashboard;

  if (isUserInErrMgtTwoDotZero) {
    infoTextDashboard = 'Use this dashboard to visualize the stats of an integration flow – for example, how many successes vs. errors did my integration experience over the last 30 days? The dashboard shows graphs of total stats (success, error, ignore count) produced in the flow steps, helping you to see trends and identify performance issues or unexpected spikes in integration activity. Integration flow stats are available for up to one year.';
  }

  // We may not have an IA that supports children, but those who do,
  // we want to reset the jobs filter any time the store changes.
  useEffect(() => {
    if (storeId && storeId !== filterStoreId) {
      dispatch(
        actions.patchFilter('jobs', {
          storeId,
          flowId: '',
          currentPage: 0,
        })
      );
    }
  }, [dispatch, filterStoreId, storeId]);

  return (
    <div className={classes.root}>
      <LoadResources required resources="flows">
        <PanelHeader title="Dashboard" infoText={infoTextDashboard} />
        {isUserInErrMgtTwoDotZero
          ? <ChartsDrawer integrationId={integrationId} childId={storeId} />
          : <JobDashboard integrationId={integrationId} />}
      </LoadResources>
    </div>
  );
}
