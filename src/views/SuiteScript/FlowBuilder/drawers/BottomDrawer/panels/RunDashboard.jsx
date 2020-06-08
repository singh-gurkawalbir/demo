import { makeStyles } from '@material-ui/styles';
import JobDashboard from '../../../../../../components/SuiteScript/JobDashboard';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0),
  },
}));

export default function RunDashboardPanel({ ssLinkedConnectionId, flow }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <JobDashboard
        ssLinkedConnectionId={ssLinkedConnectionId}
        integrationId={flow._integrationId}
        flowId={flow._flowId}
        isFlowBuilderView
      />
    </div>
  );
}
