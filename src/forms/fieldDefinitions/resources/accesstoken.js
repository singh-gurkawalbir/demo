// import moment from 'moment';
import { isNewId } from '../../../utils/resource';

// const getAutoPurgeDescription = (id, autoPurgeAt) => {
//   if (isNewId(id)) {
//     return '';
//   }
//   if (moment(autoPurgeAt, moment.ISO_8601).isValid()) {
//     const x = moment(autoPurgeAt);
//     const y = moment();
//     return `Auto purges in ${moment.duration(x.diff(y)).humanize()}`;
//   }
//   return undefined;
// };

export default {
  name: {
    type: 'text',
    label: 'Name',
    defaultValue: r => r.name || '',
    required: true,
  },
  description: {
    type: 'text',
    label: 'Description',
    defaultValue: r => r.description || '',
  },
  autoPurgeAt: {
    type: 'select',
    label: 'Auto purge token',
    required: r => isNewId(r?._id),
    // description: r => getAutoPurgeDescription(r?._id, r?.autoPurgeAt),
    defaultValue: r => (!isNewId(r?._id) && !r?.autoPurgeAt) ? 'never' : r?.autoPurgeAt,
    skipSort: true,
    // TODO dynamic options for connector tokens
    options: r => {
      const items = [
        {
          label: 'Never',
          value: 'never',
        },
        {
          label: '1 Hour',
          value: '3600000', // TODO need to move to usage of moment. Currently cant use modules here.
        },
        {
          label: '4 Hours',
          value: '14400000',
        },
        {
          label: '1 Day',
          value: '86400000',
        },
        {
          label: '4 Days',
          value: '345600000',
        },
        {
          label: '10 Days',
          value: '864000000',
        },
        {
          label: '30 Days',
          value: '2592000000',
        },
      ];

      if (r._connectorId) {
        items.shift();
      }

      return [{ items }];
    },
  },
  fullAccess: {
    type: 'radiogroup',
    label: 'Scope',
    defaultValue: r =>
      r.fullAccess ||
      (r._connectorId &&
        r.autoPurgeAt &&
        !r._connectionIds.length &&
        !r._exportIds.length &&
        !r._importIds.length)
        ? 'true'
        : 'false',
    options: [
      {
        items: [
          {
            label: 'Full access',
            value: 'true',
          },
          {
            label: 'Custom',
            value: 'false',
          },
        ],
      },
    ],
    required: true
  },
  _connectionIds: {
    type: 'selectresource',
    resourceType: 'connections',
    label: 'Connections',
    multiselect: true,
    allowEdit: false,
    allowNew: false,
    skipPingConnection: true,
    filter: r =>
      r._integrationId
        ? { _integrationId: r._integrationId }
        : { _integrationId: { $exists: false } },
    valueDelimiter: ',',
    visibleWhen: [
      {
        field: 'fullAccess',
        is: ['false'],
      },
    ],
    ignoreEnvironmentFilter: true,
  },
  _exportIds: {
    type: 'selectresource',
    resourceType: 'exports',
    label: 'Exports',
    multiselect: true,
    allowEdit: false,
    filter: r =>
      r._integrationId
        ? { _integrationId: r._integrationId }
        : { _integrationId: { $exists: false } },
    allowNew: false,
    valueDelimiter: ',',
    visibleWhen: [
      {
        field: 'fullAccess',
        is: ['false'],
      },
    ],
    ignoreEnvironmentFilter: true,
  },
  _importIds: {
    type: 'selectresource',
    resourceType: 'imports',
    label: 'Imports',
    multiselect: true,
    allowEdit: false,
    filter: r =>
      r._integrationId
        ? { _integrationId: r._integrationId }
        : { _integrationId: { $exists: false } },
    allowNew: false,
    valueDelimiter: ',',
    visibleWhen: [
      {
        field: 'fullAccess',
        is: ['false'],
      },
    ],
    ignoreEnvironmentFilter: true,
  },
  _apiIds: {
    type: 'selectresource',
    resourceType: 'apis',
    label: 'My APIs',
    multiselect: true,
    allowEdit: false,
    allowNew: false,
    valueDelimiter: ',',
    visibleWhen: [
      {
        field: 'fullAccess',
        is: ['false'],
      },
    ],
    ignoreEnvironmentFilter: true,
  },
};
