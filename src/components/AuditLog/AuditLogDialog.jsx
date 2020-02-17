import { useSelector } from 'react-redux';
import AuditLog from './index';
import ModalDialog from '../ModalDialog';
import * as selectors from '../../reducers';

export default function AuditLogDialog({ resourceType, resourceId, onClose }) {
  const resource = useSelector(state =>
    selectors.resource(state, resourceType, resourceId)
  );
  const name = resource ? `: ${resource.name}` : '';

  return (
    <ModalDialog onClose={onClose} show maxWidth="xl">
      <div>Audit Log{name}</div>
      <div>
        <AuditLog
          onClick={onClose}
          resourceType={resourceType}
          resourceId={resourceId}
        />
      </div>
    </ModalDialog>
  );
}
