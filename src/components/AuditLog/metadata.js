import {
  AUDIT_LOG_SOURCE_LABELS,
  AUDIT_LOG_EVENT_LABELS,
  getOldValue,
  getNewValue,
  getResourceLink,
} from './util';
import { RESOURCE_TYPE_SINGULAR_TO_LABEL } from '../../constants/resource';
import DateTimeDisplay from '../DateTimeDisplay';

export default {
  columns: [
    {
      heading: 'Time',
      // eslint-disable-next-line react/display-name
      value: al => <DateTimeDisplay dateTime={al.time} />,
      width: '10%',
    },
    {
      heading: 'Source',
      value: al => AUDIT_LOG_SOURCE_LABELS[al.source] || al.source,
      width: '11%',
    },
    {
      heading: 'User',
      value: al => al.byUser && (al.byUser.name || al.byUser.email),
      width: '12%',
    },
    {
      heading: 'Resource',
      value: al => RESOURCE_TYPE_SINGULAR_TO_LABEL[al.resourceType],
      width: '10%',
    },
    {
      heading: 'Name/ID',
      value: (al, actionProps) => getResourceLink(al, actionProps),
      width: '10%',
    },
    {
      heading: 'Action',
      value: al => AUDIT_LOG_EVENT_LABELS[al.event] || al.event,
      width: '8%',
    },
    {
      heading: 'Field',
      value: al => al.fieldChange && al.fieldChange.fieldPath,
      width: '13%',
    },
    {
      heading: 'Old value',
      value: al => getOldValue(al),
      width: '13%',
    },
    {
      heading: 'New value',
      value: al => getNewValue(al),
      width: '13%',
    },
  ],
};
