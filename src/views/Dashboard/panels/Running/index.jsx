import React, {useEffect} from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import { useDispatch } from 'react-redux';
import JobDashboard from '../../../../components/JobDashboard/AccountDashboard/RunningFlows';
import LoadResources from '../../../../components/LoadResources';
import actions from '../../../../actions';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    overflow: 'auto',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
}));
const defaultFilter = {
  sort: { order: 'desc', orderBy: 'createdAt' },
  paging: {
    rowsPerPage: 50,
    currPage: 0,
  },
};

export default function DashboardPanel() {
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.patchFilter('runningFlows', {...defaultFilter }));
  }, [dispatch]);

  return (
    <div className={classes.root}>
      <LoadResources required resources="flows">

        <JobDashboard integrationId="59670d677ba2c865d9fced57" />
      </LoadResources>
    </div>
  );
}
