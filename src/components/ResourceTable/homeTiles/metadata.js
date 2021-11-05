import React from 'react';
import NameCell from './cells/NameCell';
import StatusCell from './cells/StatusCell';
import TypeCell from './cells/TypeCell';
import ApplicationsCell from './cells/ApplicationsCell';
import CeligoTimeAgo from '../../CeligoTimeAgo';
import MultiSelectColumnFilter from '../commonCells/MultiSelectColumnFilter';
import {FILTER_KEY, HOME_ALL_APPLICATIONS} from '../../../utils/home';
import References from '../commonActions/References';

export default {
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
      Value: ({rowData: r}) => (
        <ApplicationsCell tile={r} />
      ),
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
  useRowActions: () => [References],
};
