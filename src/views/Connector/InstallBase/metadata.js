import {
  getResourceLink,
  formatLastModified,
} from '../../../components/CeligoTable/util';

export default {
  columns: [
    {
      heading: 'Name',
      value: r => getResourceLink('installBase', r),
      orderBy: 'name',
    },
    {
      heading: 'Email',
      value: r => r.name,
    },
    {
      heading: 'Integration ID',
      value: r => r._integrationId,
    },
    {
      heading: 'Expiration Date',
      value: r => formatLastModified(r.expires),
    },
    {
      heading: 'Environment',
      value: r => (r.sandbox ? 'Sandbox' : 'Production'),
    },
    {
      heading: 'Version',
      value: r => r.version,
    },
  ],
};
