import { makeStyles } from '@material-ui/styles';
import JobDashboard from '../../../../../components/JobDashboard';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
  },
}));

export default function RunDashboardPanel({ flow }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {flow._integrationId && (
        <JobDashboard
          integrationId={flow._integrationId || 'none'}
          flowId={flow._id}
        />
      )}
    </div>
  );
}
