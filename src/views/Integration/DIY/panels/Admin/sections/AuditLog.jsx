import { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AuditLog from '../../../../../../components/AuditLog';
import PanelHeader from '../../../../../../components/PanelHeader';

const useStyles = makeStyles(theme => ({
  AuditLogWrapper: {
    minWidth: theme.spacing(100),
  },
}));

export default function AuditLogSection({ integrationId }) {
  const classes = useStyles();

  return (
    <Fragment>
      <PanelHeader title="Audit log" />
      <div className={classes.AuditLogWrapper}>
        <AuditLog resourceType="integrations" resourceId={integrationId} />
      </div>
    </Fragment>
  );
}
