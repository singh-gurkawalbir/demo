import moment from 'moment';
import {
  AUDIT_LOG_SOURCE_LABELS,
  AUDIT_LOG_EVENT_LABELS,
  getOldValue,
  getNewValue,
  getResourceLink,
} from './util';
import { RESOURCE_TYPE_SINGULAR_TO_LABEL } from '../../constants/resource';

export default {
  columns: [
    {
      heading: 'Time',
      value: (al, actionProps) =>
        `${moment(al.time).format(
          (actionProps.preferences || {}).dateFormat
        )} ${moment(al.time).format(
          (actionProps.preferences || {}).timeFormat
        )}`,
    },
    {
      heading: 'Source',
      value: al => AUDIT_LOG_SOURCE_LABELS[al.source] || al.source,
    },
    {
      heading: 'User',
      value: al => al.byUser && (al.byUser.name || al.byUser.email),
    },
    {
      heading: 'Resource',
      value: al => RESOURCE_TYPE_SINGULAR_TO_LABEL[al.resourceType],
    },
    {
      heading: 'Name/Id',
      value: (al, actionProps) => getResourceLink(al, actionProps),
    },
    {
      heading: 'Action',
      value: al => AUDIT_LOG_EVENT_LABELS[al.event] || al.event,
    },
    {
      heading: 'Field',
      value: al => al.fieldChange && al.fieldChange.fieldPath,
    },
    {
      heading: 'Old Value',
      value: al => getOldValue(al),
    },
    {
      heading: 'New Value',
      value: al => getNewValue(al),
    },
  ],
};
