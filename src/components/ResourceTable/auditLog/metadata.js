import React from 'react';
import {
  AUDIT_LOG_SOURCE_LABELS,
  AUDIT_LOG_EVENT_LABELS,
} from '../../../constants/auditLog';
import { RESOURCE_TYPE_SINGULAR_TO_LABEL } from '../../../constants/resource';
import DateTimeDisplay from '../../DateTimeDisplay';
import OldValue from './cells/OldValue';
import NewValue from './cells/NewValue';
import NameCell from './cells/Name';
import { useGetTableContext } from '../../CeligoTable/TableContext';

export default {
  columns: [
    {
      heading: 'Time',
      Value: ({rowData: al}) => <DateTimeDisplay dateTime={al.time} />,
      width: '10%',
    },
    {
      heading: 'Source',
      Value: ({rowData: al}) => AUDIT_LOG_SOURCE_LABELS[al.source] || al.source,
      width: '11%',
    },
    {
      heading: 'User',
      Value: ({rowData: al}) => al.byUser && (al.byUser.name || al.byUser.email),
      width: '12%',
    },
    {
      heading: 'Resource',
      Value: ({rowData: al}) => RESOURCE_TYPE_SINGULAR_TO_LABEL[al.resourceType],
      width: '10%',
    },
    {
      heading: 'Name/ID',
      Value: ({rowData: al}) => {
        const tableContext = useGetTableContext();

        return <NameCell al={al} actionProps={tableContext} />;
      },
      width: '10%',
    },
    {
      heading: 'Action',
      Value: ({rowData: al}) => AUDIT_LOG_EVENT_LABELS[al.event] || al.event,
      width: '8%',
    },
    {
      heading: 'Field',
      Value: ({rowData: al}) => al.fieldChange && al.fieldChange.fieldPath,
      width: '13%',
    },
    {
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
