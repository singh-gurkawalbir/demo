import CancelIcon from '../../../icons/CancelIcon';
import useCancelRevision from '../../../drawer/Revisions/hooks/useCancelRevision';

export default {
  key: 'cancelRevision',
  useLabel: () => 'Cancel revision',
  icon: CancelIcon,
  useOnClick: rowData => {
    const { _integrationId, _id: revisionId } = rowData;
    const handleCancel = useCancelRevision({ integrationId: _integrationId, revisionId });

    return handleCancel;
  },
};
