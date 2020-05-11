import { GetResourceReferenceLink } from '../CeligoTable/util';

export default {
  columns: [
    {
      heading: 'Name',
      // eslint-disable-next-line react/display-name
      value: r => <GetResourceReferenceLink r={r} />,
    },
    {
      heading: 'Type',
      value: r => r.resourceType,
    },
  ],
};
