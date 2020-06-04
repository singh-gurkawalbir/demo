import { useEffect } from 'react';
import DeleteIcon from '../../../../icons/TrashIcon';
import EditIcon from '../../../../icons/EditIcon';

const Delete = {
  label: 'Delete',
  icon: DeleteIcon,
  component: function Delete ({ handleDeleteItem, rowData }) {
    useEffect(() => {
      handleDeleteItem(rowData.index);
    },[handleDeleteItem, rowData.index])
    
    return null;
  },
};
const Edit = {
  label: 'Edit',
  icon: EditIcon,
  component: function Edit({ handleEditItem, rowData }) {
    useEffect(() => {
      handleEditItem(rowData.index);
    },[handleEditItem, rowData.index])

    return null;
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
