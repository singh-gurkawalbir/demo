import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import getRoutePath from '../../utils/routePaths';
import LoadResources from '../../components/LoadResources';
import * as selectors from '../../reducers';
import actions from '../../actions';
import JobDashboard from '../../components/JobDashboard';
import CeligoPageBar from '../../components/CeligoPageBar';
import IconTextButton from '../../components/IconTextButton';
import RefreshIcon from '../../components/icons/RefreshIcon';
import SettingsIcon from '../../components/icons/SettingsIcon';

const useStyles = makeStyles(theme => ({
  dashboardContainer: {
    padding: theme.spacing(0),
  },
}));

export default function IntegrationDashboard({ match }) {
  const { integrationId } = match.params;
  const classes = useStyles();
  const dispatch = useDispatch();
  const integration = useSelector(state =>
    integrationId === 'none'
      ? { name: 'Standalone Integrations' }
      : selectors.resource(state, 'integrations', integrationId)
  );
  const integrationSettingsURL = getRoutePath(
    integration && integration._connectorId
      ? `/connectors/${integrationId}/settings/flows`
      : `/integrations/${integrationId}/flows`
  );

  function handleRefresh() {
    dispatch(actions.job.clear());
    dispatch(actions.patchFilter('jobs', { currentPage: 0 }));
  }

  return (
    <LoadResources required resources="integrations">
      <CeligoPageBar title={integration && integration.name}>
        <IconTextButton
          data-test="refreshJobs"
          variant="text"
          color="primary"
          onClick={handleRefresh}>
          <RefreshIcon /> Refresh
        </IconTextButton>
        <IconTextButton
          component={Link}
          data-test="settings"
          to={integrationSettingsURL}
          variant="text"
          color="primary">
          <SettingsIcon /> Settings
        </IconTextButton>
      </CeligoPageBar>
      <div className={classes.dashboardContainer}>
        <JobDashboard integrationId={integrationId} />
      </div>
    </LoadResources>
  );
}
