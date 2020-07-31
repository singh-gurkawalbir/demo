import React from 'react';
import { GetResourceReferenceLink } from '../CeligoTable/util';

export default {
  columns: [
    {
      heading: 'Name',
      // eslint-disable-next-line react/display-name
      value: (r, { onClose }) => <GetResourceReferenceLink r={r} onClick={onClose} />,
    },
    {
      heading: 'Type',
      value: r => r.resourceType,
    },
  ],
};
