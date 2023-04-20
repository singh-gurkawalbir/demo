import React from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { TimeAgo } from '@celigo/fuse-ui';
import ConnectionResourceDrawerLink from '../../ResourceDrawerLink/connection';
import ConnectorName from '../commonCells/ConnectorName';
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
import { useGetTableContext } from '../../CeligoTable/TableContext';
import OnlineStatus from '../../OnlineStatus';
import { selectors } from '../../../reducers';
import { getConnectionApi } from '../../../utils/connections';

export default {
  key: 'connections',
  useColumns: () => {
    const tableContext = useGetTableContext();
    const columns = [
      {
        key: 'name',
        heading: 'Name',
        // it is loggable because it is not connectorLicenses resource type
        isLoggable: true,
        Value: ({rowData: r}) => (
          <ConnectionResourceDrawerLink
            resource={r}
            integrationId={tableContext.integrationId}
            />
        ),
        orderBy: 'name',
      },
      {
        key: 'status',
        heading: 'Status',
        isLoggable: true,
        Value: ({rowData: r}) => <OnlineStatus offline={r.offline} />,
      },
      {
        key: 'type',
        heading: 'Type',
        isLoggable: true,
        Value: ({rowData: r}) => <ConnectorName resource={r} />,
      },
      {
        key: 'api',
        heading: 'API',
        // check
        isLoggable: true,
        Value: ({rowData: r}) => getConnectionApi({...r}),
      },
      {
        key: 'lastUpdated',
        heading: 'Last updated',
        isLoggable: true,
        Value: ({rowData: r}) => <TimeAgo date={r.lastModified} />,
        orderBy: 'lastModified',
        width: 160,
      },
      {
        key: 'queueSize',
        isLoggable: true,
        heading: 'Queue size',
        Value: ({rowData: r}) => r.queueSize || 0,
        width: 120,
      },
    ];

    return columns;
  },

  onRowOver: (r, dispatch) => dispatch(actions.connection.setActive(r._id)),
  onRowOut: (r, dispatch) => dispatch(actions.connection.setActive()),

  useRowActions: r => {
    const tableContext = useGetTableContext();

    const actions = [Edit];

    if (tableContext.type === 'flowBuilder') {
      actions.push(OpenDebugger);
    } else {
      actions.push(ConfigureDebugger);
      if (r.debugDate && moment().isBefore(moment(r.debugDate))) {
        actions.push(DownloadDebugLogs);
      }
    }
    actions.push(AuditLogs);
    actions.push(References);

    if (tableContext.integrationId && !r._connectorId && tableContext.type !== 'flowBuilder') {
      actions.push(Deregister);
    }

    if (r.type === 'netsuite' || r.type === 'salesforce') {
      actions.push(RefreshMetadata);
    }

    const iClientResource = useSelector(state => selectors.resource(state, 'iClients', r.http?._iClientId));

    if (r.type === 'http' && (!!r.http?.auth?.token?.revoke?.uri || !!iClientResource?.oauth2?.revoke?.uri)) {
      actions.push(Revoke);
    }
    if (r.type === 'ftp' && !r._connectorId && tableContext?.showTradingPartner) {
      actions.push(TradingPartner);
    }
    if (tableContext.type === 'flowBuilder') {
      actions.push(ReplaceConnection);
    }
    if (!tableContext.integrationId && !r._connectorId && tableContext.type !== 'flowBuilder') {
      actions.push(Delete);
    }

    return actions;
  },
};
