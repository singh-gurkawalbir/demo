import { useCallback } from 'react';
import DeleteIcon from '../../../../icons/TrashIcon';
import EditIcon from '../../../../icons/EditIcon';
import { useGetTableContext } from '../../../../CeligoTable/TableContext';

const Delete = {
  useLabel: () => 'Delete',
  key: 'delete',
  icon: DeleteIcon,
  useOnClick: rowData => {
    const {handleDeleteItem} = useGetTableContext();

    return useCallback(() => {
      handleDeleteItem(rowData.index);
    }, [handleDeleteItem, rowData.index]);
  },
};
const Edit = {
  useLabel: () => 'Edit',
  key: 'edit',
  icon: EditIcon,
  useOnClick: rowData => {
    const {handleEditItem} = useGetTableContext();

    return useCallback(() => {
      handleEditItem(rowData.index);
    }, [handleEditItem, rowData.index]);
  },
};

export default {
  useColumns: () => [
    {
      key: 'relationship',
      heading: 'Relationship',
      Value: ({rowData: r}) => r && r.relationshipName,
    },
    {
      key: 'childSObject',
      heading: 'Child sObject',
      Value: ({rowData: r}) => r && r.sObjectType,
    },
    {
      key: 'referencedFields',
      heading: 'Referenced Fields',
      Value: ({rowData: r}) => r && r.referencedFields,
    },
    {
      key: 'filter',
      Value: ({rowData: r}) => r && r.filter,
    },
    {
      key: 'orderBy',
      heading: 'Order By',
      Value: ({rowData: r}) => r && r.orderBy,
    },
  ],
  useRowActions: () => [Delete, Edit],
};
