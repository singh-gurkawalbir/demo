import React from 'react';
import moment from 'moment';
import ConnectionResourceDrawerLink from '../../ResourceDrawerLink/connection';
import CeligoTimeAgo from '../../CeligoTimeAgo';
import ConnectorName from '../commonCells/ConnectorName';
import OnlineStatus from '../commonCells/OnlineStatus';
import AuditLogs from '../commonActions/AuditLogs';
import Delete from '../commonActions/Delete';
import References from '../commonActions/References';
import Edit from '../commonActions/Edit';
import ConfigureDebugger from './actions/ConfigDebugger';
import OpenDebugger from './actions/OpenDebugger';
import Deregister from './actions/Deregister';
import DownloadDebugLogs from './actions/DownloadDebugLogs';
import RefreshMetadata from './actions/RefreshMetadata';
import TradingPartner from './actions/TradingPartner';
import Revoke from './actions/Revoke';

export default {
  columns: (r, actionProps) => {
    const columns = [
      {
        heading: 'Name',
        value: r => (
          <ConnectionResourceDrawerLink
            resource={r}
            integrationId={actionProps.integrationId}
            />
        ),
        orderBy: 'name',
      },
      {
        heading: 'Status',
        value: r => <OnlineStatus offline={r.offline} />,
      },
      {
        heading: 'Type',
        value: r => <ConnectorName r={r} />,
      },
      {
        heading: 'API',
        value: r => {
          if (r.type === 'rest') return r && r.rest && r.rest.baseURI;

          if (r.type === 'http') return r && r.http && r.http.baseURI;

          return null;
        },
      },
      {
        heading: 'Last updated',
        value: r => <CeligoTimeAgo date={r.lastModified} />,
        orderBy: 'lastModified',
        width: 160,
      },
      {
        heading: 'Queue size',
        // align: 'right',
        value: r => r.queueSize || 0,
        width: 120,
      },
    ];

    return columns;
  },
  rowActions: (r, actionProps) => {
    let actionsToReturn = [];

    if (r.debugDate && moment().isBefore(moment(r.debugDate))) {
      if (actionProps.type === 'flowBuilder') {
        actionsToReturn = [OpenDebugger];
      } else {
        actionsToReturn = [DownloadDebugLogs];
      }
    }
    actionsToReturn = [ConfigureDebugger, ...actionsToReturn, AuditLogs, References];
    if (actionProps.integrationId && !r._connectorId && actionProps.type !== 'flowBuilder') {
      actionsToReturn = [...actionsToReturn, Deregister];
    }
    if (r.type === 'netsuite' || r.type === 'salesforce') {
      actionsToReturn = [...actionsToReturn, RefreshMetadata];
    }

    if (
      r.type === 'http' &&
      !!((((r.http || {}).auth || {}).token || {}).revoke || {}).uri
    ) {
      actionsToReturn = [...actionsToReturn, Revoke];
    }
    actionsToReturn = [Edit, ...actionsToReturn];
    if (r.type === 'ftp' && !r._connectorId && actionProps?.showTradingPartner) {
      actionsToReturn = [...actionsToReturn, TradingPartner];
    }
    if (!actionProps.integrationId && !r._connectorId && actionProps.type !== 'flowBuilder') {
      actionsToReturn = [...actionsToReturn, Delete];
    }

    return actionsToReturn;
  },
};
