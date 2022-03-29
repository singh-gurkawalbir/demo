import React, { useCallback, useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import { ALIAS_FORM_KEY } from '../../../../../utils/constants';
import { getResourceFromAlias } from '../../../../../utils/resource';
import { useGetTableContext } from '../../../../CeligoTable/TableContext';
import useConfirmDialog from '../../../../ConfirmDialog';
import TrashIcon from '../../../../icons/TrashIcon';
import ResourceReferences from '../../../../ResourceReferences';

export default {
  key: 'deleteAlias',
  useLabel: () => 'Delete alias',
  icon: TrashIcon,
  Component: ({rowData}) => {
    const {resourceId: parentResourceId, resourceType: parentResourceType} = useGetTableContext();
    const { id, resourceType } = getResourceFromAlias(rowData);
    const dispatch = useDispatch();
    const [showRef, setShowRef] = useState(false);
    const resourceReferences = useSelector(state =>
      selectors.resourceReferences(state)
    );
    const { confirmDialog } = useConfirmDialog();

    const deleteResource = useCallback(() => {
      dispatch(actions.resource.aliases.delete(parentResourceId, parentResourceType, rowData.alias, ALIAS_FORM_KEY));
      setShowRef(true);
    }, [dispatch, parentResourceId, parentResourceType, rowData]);

    const handleDelete = useCallback(() => {
      confirmDialog({
        title: 'Delete alias?',
        message: 'Are you sure you want to delete your alias? If you delete it, then any resources that reference the alias will now reference the ID. You’ll need to update the resource with a new or existing alias if you want to reference a different alias.',
        buttons: [
          {
            label: 'Delete alias',
            onClick: deleteResource,
          },
          {
            label: 'Cancel',
            variant: 'text',
          },
        ],
      });
    }, [confirmDialog, deleteResource]);

    const handleResourceReferenceClose = useCallback(() => {
      setShowRef(false);
    }, []);

    useEffect(() => {
      handleDelete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <>
        {showRef && resourceReferences && resourceReferences.length && (
          <ResourceReferences
            title
            resourceType={resourceType}
            resourceId={id}
            onClose={handleResourceReferenceClose}
          />
        )}
      </>
    );
  },
};
