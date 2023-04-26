import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { TimeAgo } from '@celigo/fuse-ui';
import UserName from '../commonCells/IntegrationUserName';
import { REVISION_STATUS_LABELS, REVISION_TYPE_LABELS } from '../../../utils/revisions';
import { REVISION_STATUS, REVISION_TYPES } from '../../../constants';
import CreatePull from './actions/CreatePull';
import CancelRevision from './actions/CancelRevision';
import ViewDetails from './actions/ViewDetails';
import ViewResourceChanges from './actions/ViewResourceChanges';
import ResumeRevision from './actions/ResumeRevision';
import RevertToAfterRevision from './actions/RevertToAfterRevision';
import RevertToBeforeRevision from './actions/RevertToBeforeRevision';
import RevertToRevision from './actions/RevertToRevision';
import { selectors } from '../../../reducers';

export default {
  useColumns: () => {
    const { integrationId } = useParams();
    const columns = [{
      key: 'description',
      heading: 'Description',
      Value: ({rowData: r}) => r.description,
      width: '40%',
    }, {
      key: 'createdAt',
      heading: 'Date created',
      Value: ({ rowData: r }) => <TimeAgo date={r.createdAt} />,
      orderBy: 'createdAt',
      width: 200,
    }, {
      key: 'type',
      heading: 'Type',
      Value: ({ rowData: r }) => REVISION_TYPE_LABELS[r.type],
      width: 100,
    }, {
      key: 'status',
      heading: 'Status',
      Value: ({ rowData: r }) => REVISION_STATUS_LABELS[r.status],
      width: 150,
    }, {
      key: 'user',
      heading: 'User',
      Value: ({ rowData: r }) => <UserName userId={r._createdByUserId} integrationId={integrationId} />,
    }];

    return columns;
  },
  useRowActions: revision => {
    const { integrationId } = useParams();
    const hasMonitorLevelAccess = useSelector(state => selectors.isFormAMonitorLevelAccess(state, integrationId));
    const { type, status } = revision;

    if (hasMonitorLevelAccess) {
      // for monitor user, view changes & view details are the only actions accessible
      if (status === REVISION_STATUS.COMPLETED && type !== REVISION_TYPES.SNAPSHOT) {
        return [
          ViewResourceChanges,
          ViewDetails,
        ];
      }

      return [ViewDetails];
    }
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
