import { getResourceReferenceLink } from '../CeligoTable/util';

export default {
  columns: [
    {
      heading: 'Name',
      value: r => getResourceReferenceLink(r),
    },
    {
      heading: 'Type',
      value: r => r.resourceType,
    },
  ],
};
