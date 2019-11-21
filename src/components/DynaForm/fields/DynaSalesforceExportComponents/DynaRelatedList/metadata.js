import DeleteIcon from '../../../../icons/TrashIcon';
import EditIcon from '../../../../icons/EditIcon';

const Delete = {
  label: 'Delete',
  component({ handleDeleteItem, childSObject, parentField }) {
    return (
      <DeleteIcon
        onClick={() => {
          handleDeleteItem(childSObject, parentField);
        }}
      />
    );
  },
};
const Edit = {
  label: 'Edit',
  component({ handleEditItem, childSObject, parentField }) {
    return (
      <EditIcon
        onClick={() => {
          handleEditItem(childSObject, parentField);
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
      value: r => r && r.childSObject,
      orderBy: 'lastModified',
    },
    {
      heading: 'Referenced Fields',
      value(r) {
        return r && r.filter;
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
