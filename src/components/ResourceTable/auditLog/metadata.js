import React from 'react';
import {
  AUDIT_LOG_SOURCE_LABELS,
  AUDIT_LOG_EVENT_LABELS,
} from '../../../constants/auditLog';
import { RESOURCE_TYPE_SINGULAR_TO_LABEL } from '../../../constants/resource';
import DateTimeDisplay from '../../DateTimeDisplay';
import OldValue from './cells/OldValue';
import NewValue from './cells/NewValue';
import NameCell from '../commonCells/Name';
import { useGetTableContext } from '../../CeligoTable/TableContext';

export default {
  useColumns: () => [
    {
      key: 'time',
      heading: 'Time',
      Value: ({rowData: al}) => <DateTimeDisplay dateTime={al.time} />,
      width: '10%',
    },
    {
      key: 'source',
      heading: 'Source',
      Value: ({rowData: al}) => AUDIT_LOG_SOURCE_LABELS[al.source] || al.source,
      width: '11%',
    },
    {
      key: 'user',
      heading: 'User',
      Value: ({rowData: al}) => al.byUser && (al.byUser.name || al.byUser.email),
      width: '12%',
    },
    {
      key: 'resource',
      heading: 'Resource',
      Value: ({rowData: al}) => RESOURCE_TYPE_SINGULAR_TO_LABEL[al.resourceType],
      width: '10%',
    },
    {
      key: 'nameId',
      heading: 'Name/ID',
      Value: ({rowData: al}) => {
        const tableContext = useGetTableContext();

        return <NameCell al={al} actionProps={tableContext} />;
      },
      width: '10%',
    },
    {
      key: 'action',
      heading: 'Action',
      Value: ({rowData: al}) => AUDIT_LOG_EVENT_LABELS[al.event] || al.event,
      width: '8%',
    },
    {
      key: 'field',
      heading: 'Field',
      Value: ({rowData: al}) => al.fieldChange && al.fieldChange.fieldPath,
      width: '13%',
    },
    {
      key: 'oldValue',
      heading: 'Old value',
      Value: ({rowData: al}) => (
        <OldValue
          auditLog={al}
          oldValue={al.fieldChange.oldValue}
          newValue={al.fieldChange.newValue}
        />
      ),
      width: '13%',
    },
    {
      key: 'newValue',
      heading: 'New value',
      Value: ({rowData: al}) => (
        <NewValue
          oldValue={al.fieldChange.oldValue}
          newValue={al.fieldChange.newValue}
        />
      ),
      width: '13%',
    },
  ],
};
