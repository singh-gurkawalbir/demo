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
      <PanelHeader title="Dashboard" />

      <JobDashboard integrationId={integrationId} />
    </div>
  );
}
