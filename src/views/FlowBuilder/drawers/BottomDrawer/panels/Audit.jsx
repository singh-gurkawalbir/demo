import { makeStyles } from '@material-ui/styles';
import AuditLog from '../../../../../components/AuditLog';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
  },
}));

export default function AuditPanel({ flow }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AuditLog resourceType="flows" resourceId={flow._id} />
    </div>
  );
}
