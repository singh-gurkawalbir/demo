import DeleteIcon from '../../../../icons/TrashIcon';
import EditIcon from '../../../../icons/EditIcon';

const Delete = {
  label: 'Delete',
  component({ handleDeleteItem, resource }) {
    return (
      <DeleteIcon
        onClick={() => {
          handleDeleteItem(resource.index);
        }}
      />
    );
  },
};
const Edit = {
  label: 'Edit',
  component({ handleEditItem, resource }) {
    return (
      <EditIcon
        onClick={() => {
          handleEditItem(resource.index);
        }}
      />
    );
  },
};

export default {
  columns: [
    {
      heading: 'Relationship',
      value: r => r && r.relationshipName,
    },

    {
      heading: 'Child SObject',
      value: r => r && r.sObjectType,
    },
    {
      heading: 'Referenced Fields',
      value(r) {
        return r && r.referencedFields;
      },
    },
    {
      heading: 'Filter',
      value(r) {
        return r && r.filter;
      },
    },
    {
      heading: 'Order By',
      value(r) {
        return r && r.orderBy;
      },
    },
  ],
  rowActions: [Delete, Edit],
};
