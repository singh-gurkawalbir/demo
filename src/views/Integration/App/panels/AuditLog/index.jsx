import { makeStyles } from '@material-ui/core';
import AuditLog from '../../../../../components/AuditLog';
import PanelHeader from '../../../../../components/PanelHeader';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    overflow: 'auto',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    paddingBottom: theme.spacing(1),
  },
}));

export default function AuditLogSection({ integrationId, storeId }) {
  const classes = useStyles();
  const infoTextAuditLog =
    'Keep track of changes to your flow, enabling you to track down problems based on changes to your flows. Know exactly who made the change, what the change was, and when it happened.';

  return (
    <div className={classes.root}>
      <PanelHeader title="Audit log" infoText={infoTextAuditLog} />

      <AuditLog
        resourceType="integrations"
        resourceId={integrationId}
        storeId={storeId}
      />
    </div>
  );
}
