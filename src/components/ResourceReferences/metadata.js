import React from 'react';
import ResourceLink from './ResourceLink';

export default {
  columns: [
    {
      heading: 'Name',
      value: (r, { onClose }) =>
        <ResourceLink name={r.name} resourceType={r.resourceType} id={r.id} onClick={onClose} />,
    },
    {
      heading: 'Type',
      value: r => r.resourceType,
    },
  ],
};
