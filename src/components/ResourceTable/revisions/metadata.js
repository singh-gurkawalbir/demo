import React from 'react';
import UserName from '../commonCells/UserName';
import DateTimeDisplay from '../../DateTimeDisplay';
import { REVISION_STATUS_LABELS, REVISION_TYPE_LABELS } from '../../../utils/revisions';
import { REVISION_STATUS, REVISION_TYPES } from '../../../utils/constants';
import CreatePull from './actions/CreatePull';
import CancelRevision from './actions/CancelRevision';
import ViewDetails from './actions/ViewDetails';
import ViewResourceChanges from './actions/ViewResourceChanges';
import ResumeRevision from './actions/ResumeRevision';
import RevertToAfterRevision from './actions/RevertToAfterRevision';
import RevertToBeforeRevision from './actions/RevertToBeforeRevision';
import RevertToRevision from './actions/RevertToRevision';

export default {
  useColumns: () => {
    const columns = [{
      key: 'description',
      heading: 'Description',
      Value: ({rowData: r}) => r.description,
    }, {
      key: 'createdAt',
      heading: 'Date created',
      Value: ({ rowData: r }) => <DateTimeDisplay dateTime={r.createdAt} />,
      orderBy: 'createdAt',
    }, {
      key: 'type',
      heading: 'Type',
      Value: ({ rowData: r }) => REVISION_TYPE_LABELS[r.type],
    }, {
      key: 'status',
      heading: 'Status',
      Value: ({ rowData: r }) => REVISION_STATUS_LABELS[r.status],
    }, {
      key: 'user',
      heading: 'User',
      Value: ({ rowData: r }) => <UserName userId={r._byUserId} />,
    }];

    return columns;
  },
  useRowActions: revision => {
    const { type, status } = revision;

    if (status === REVISION_STATUS.CANCELED) {
      return [ViewDetails];
    }
    if (status === REVISION_STATUS.FAILED) {
      return [CreatePull, ViewDetails];
    }
    if (status === REVISION_STATUS.IN_PROGRESS) {
      return [ResumeRevision, CancelRevision, ViewDetails];
    }
    if (status === REVISION_STATUS.COMPLETED) {
      if (type === REVISION_TYPES.SNAPSHOT) {
        return [RevertToRevision, ViewDetails];
      }

      return [
        RevertToAfterRevision,
        RevertToBeforeRevision,
        ViewResourceChanges,
        ViewDetails,
      ];
    }
  },
};
