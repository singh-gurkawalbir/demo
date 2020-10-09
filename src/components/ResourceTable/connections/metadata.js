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
import actions from '../../../actions';
import ReplaceConnection from './actions/ReplaceConnection';

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
        value: r => <ConnectorName resource={r} />,
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

  onRowOver: (r, dispatch) => dispatch(actions.connection.setActive(r._id)),
  onRowOut: (r, dispatch) => dispatch(actions.connection.setActive()),

  rowActions: (r, actionProps) => {
    const actions = [Edit, ConfigureDebugger];

    if (r.debugDate && moment().isBefore(moment(r.debugDate))) {
      if (actionProps.type === 'flowBuilder') {
        actions.push(OpenDebugger);
      } else {
        actions.push(DownloadDebugLogs);
      }
    }

    actions.push(AuditLogs);
    actions.push(References);

    if (actionProps.integrationId && !r._connectorId && actionProps.type !== 'flowBuilder') {
      actions.push(Deregister);
    }

    if (r.type === 'netsuite' || r.type === 'salesforce') {
      actions.push(RefreshMetadata);
    }

    if (r.type === 'http' && !!r.http?.auth?.token?.revoke?.uri) {
      actions.push(Revoke);
    }
    if (r.type === 'ftp' && !r._connectorId && actionProps?.showTradingPartner) {
      actions.push(TradingPartner);
    }
    if (actionProps.type === 'flowBuilder') {
      actions.push(ReplaceConnection);
    }
    if (!actionProps.integrationId && !r._connectorId && actionProps.type !== 'flowBuilder') {
      actions.push(Delete);
    }

    return actions;
  },
};
