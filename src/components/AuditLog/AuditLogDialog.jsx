import React from 'react';
import { useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import AuditLog from './index';
import ModalDialog from '../ModalDialog';
import { selectors } from '../../reducers';

const useStyles = makeStyles(() => ({
  auditLogModalContainer: {
    padding: 0,
  },
}));
export default function AuditLogDialog({ resourceType, resourceId, onClose }) {
  const classes = useStyles();
  const resource = useSelector(state =>
    selectors.resource(state, resourceType, resourceId)
  );
  const name = resource ? `: ${resource.name}` : '';

  return (
    <ModalDialog onClose={onClose} show maxWidth="xl" className={classes.auditLogModalContainer}>
      <div>Audit log{name}</div>
      <AuditLog
        onClick={onClose}
        resourceType={resourceType}
        resourceId={resourceId}
        />
    </ModalDialog>
  );
}
