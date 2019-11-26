import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import * as selectors from '../../../../../reducers';
import actions from '../../../../../actions';
import JobDashboard from '../../../../../components/JobDashboard';
import PanelHeader from '../../../common/PanelHeader';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    overflow: 'auto',
  },
}));

export default function DashboardPanel({ integrationId, storeId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { storeId: filterStoreId } = useSelector(state =>
    selectors.filter(state, 'jobs')
  );

  useEffect(() => {
    if (storeId !== filterStoreId) {
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
      <PanelHeader title="Dashboard" />

      <JobDashboard integrationId={integrationId} />
    </div>
  );
}
