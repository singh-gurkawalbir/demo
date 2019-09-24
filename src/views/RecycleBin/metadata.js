// import {
//   getResourceLink,
//   formatLastModified,
// } from '../../components/CeligoTable/util';

export default {
  columns: [
    {
      heading: 'Name',
      value: r => r.name,
    },
    { heading: 'Identifier', value: r => r._id },
  ],
};
