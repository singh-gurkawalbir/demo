import { makeStyles } from '@material-ui/styles';
import JobDashboard from '../../../../components/JobDashboard';
import PanelHeader from '../PanelHeader';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    overflow: 'auto',
  },
}));

export default function DashboardPanel({ integrationId }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <PanelHeader title="Dashboard" />

      <JobDashboard integrationId={integrationId} />
    </div>
  );
}
