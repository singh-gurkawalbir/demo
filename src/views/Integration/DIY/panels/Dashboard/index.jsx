import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import JobDashboard from '../../../../../components/JobDashboard';
import PanelHeader from '../../../../../components/PanelHeader';
import ChartsDrawer from '../../../../../components/LineGraph/Dashboard';
import LoadResources from '../../../../../components/LoadResources';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    overflow: 'auto',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
}));

export default function DashboardPanel({ integrationId, childId }) {
  const classes = useStyles();
  // const isUserInErrMgtTwoDotZero = useSelector(state =>
  //   selectors.isOwnerUserInErrMgtTwoDotZero(state)
  // );
  // TODO: @Sravan use above selector once dashboard linegraphs is completed
  const isUserInErrMgtTwoDotZero = false;
  const infoTextDashboard =
    'You can view the flows that have run or are currently running for each flow in your integration, as well as how many pages of data were sent, how long it took and when each job completed. If there are child jobs within a parent job, you can expand the parent to view the children. If there are errors, click the number of errors in the Error column to retry and resolve errors. You can cancel jobs that are in progress, edit jobs, and resolve errors directly from this view.';

  return (
    <div className={classes.root}>
      <LoadResources required resources="flows">
        <PanelHeader title="Dashboard" infoText={infoTextDashboard} />

        {isUserInErrMgtTwoDotZero
          ? <ChartsDrawer integrationId={childId || integrationId} />
          : <JobDashboard integrationId={childId || integrationId} />}
      </LoadResources>
    </div>
  );
}
