import React from 'react';
import NameCell from './cells/NameCell';
import StatusCell from './cells/StatusCell';
import TypeCell from './cells/TypeCell';
import CeligoTimeAgo from '../../CeligoTimeAgo';
import MultiSelectColumnFilter from '../commonCells/MultiSelectColumnFilter';
import {FILTER_KEY, HOME_ALL_APPLICATIONS} from '../../../utils/home';
import DIYClone from './actions/diy/Clone';
import DIYDelete from './actions/diy/Delete';
import DIYDownload from './actions/diy/Download';
import IAClone from './actions/integrationApp/Clone';
import IAUninstall from './actions/integrationApp/Uninstall';
import IARenew from './actions/integrationApp/Renew';
import IAReactivate from './actions/integrationApp/Reactivate';
import LogoStrip from '../../LogoStrip';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../reducers';

export default {
  rowKey: '_integrationId',
  useColumns: () => [
    {
      key: 'name',
      heading: 'Name',
      orderBy: 'name',
      Value: ({rowData: r}) => (
        <NameCell tile={r} />
      ),
    },
    {
      key: 'applications',
      HeaderValue: () => (
        <MultiSelectColumnFilter
          title="Applications"
          filterBy="applications"
          filterKey={FILTER_KEY}
          options={HOME_ALL_APPLICATIONS()}
            />
      ),
      Value: ({rowData: r}) => {
        const applications = useSelectorMemo(selectors.mkTileApplications, r);

        return (
          <LogoStrip applications={applications} />
        );
      },
    },
    {
      key: 'status',
      orderBy: 'totalErrorCount',
      heading: 'Status',
      Value: ({rowData: r}) => (
        <StatusCell tile={r} />
      ),
    },
    {
      key: 'lastErrorAt',
      orderBy: 'lastErrorAt',
      heading: 'Last open error',
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.lastErrorAt} />,
    },
    {
      key: 'lastModified',
      orderBy: 'lastModified',
      heading: 'Last updated',
      Value: ({rowData: r}) => <CeligoTimeAgo date={new Date(r.lastModified)} />,
    },
    {
      key: 'type',
      heading: 'Type',
      orderBy: 'sortablePropType',
      Value: ({rowData: r}) => (
        <TypeCell tile={r} />
      ),
    },
  ],
  useRowActions: ({_connectorId, ssLinkedConnectionId }) => {
    if (ssLinkedConnectionId) return [];
    if (_connectorId) {
      return [IARenew, IAReactivate, IAClone, IAUninstall];
    }

    return [DIYClone, DIYDownload, DIYDelete];
  },
};
