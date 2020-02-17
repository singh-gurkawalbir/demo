import { makeStyles } from '@material-ui/styles';
import AuditLog from '../../../../../components/AuditLog';

const useStyles = makeStyles(theme => ({
  auditLog: {
    '& > div': {
      '&:first-child': {
        padding: theme.spacing(2),
      },
    },
  },
}));

export default function AuditPanel({ flow }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AuditLog
        resourceType="flows"
        resourceId={flow._id}
        className={classes.auditLog}
      />
    </div>
  );
}
