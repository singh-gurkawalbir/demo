import {
  RESOURCE_TYPE_SINGULAR_TO_LABEL,
  RESOURCE_TYPE_PLURAL_TO_SINGULAR,
} from '../../../../constants/resource';

export default {
  columns: () => {
    const columns = [
      {
        heading: 'Type',
        value: r =>
          RESOURCE_TYPE_SINGULAR_TO_LABEL[
            RESOURCE_TYPE_PLURAL_TO_SINGULAR[r.type]
          ],

        orderBy: 'name',
      },
      {
        heading: 'Name',
        value: r => r.name || r._id,
      },
    ];

    return columns;
  },
};
