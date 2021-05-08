import {
  RESOURCE_TYPE_SINGULAR_TO_LABEL,
  RESOURCE_TYPE_PLURAL_TO_SINGULAR,
} from '../../../../constants/resource';

export default {
  useColumns: () => [
    {
      key: 'type',
      heading: 'Type',
      Value: ({rowData: r}) =>
        RESOURCE_TYPE_SINGULAR_TO_LABEL[
          RESOURCE_TYPE_PLURAL_TO_SINGULAR[r.type]
        ],

      orderBy: 'name',
    },
    {
      key: 'name',
      heading: 'Name',
      Value: ({rowData: r}) => r.name || r._id,
    },
  ],
};
