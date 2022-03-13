import React, { useCallback, useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../../actions';
import { useSelectorMemo } from '../../../../../hooks';
import { selectors } from '../../../../../reducers';
import { getResourceFromAlias } from '../../../../../utils/resource';
import { useGetTableContext } from '../../../../CeligoTable/TableContext';
import useConfirmDialog from '../../../../ConfirmDialog';
import TrashIcon from '../../../../icons/TrashIcon';
import ResourceReferences from '../../../../ResourceReferences';

const ALIAS_FORM_KEY = 'resource-alias';

export default {
  key: 'deleteAlias',
  useLabel: () => 'Delete alias',
  icon: TrashIcon,
  Component: ({rowData}) => {
    const {resourceId: parentResourceId, resourceType: parentResourceType} = useGetTableContext();
    const { id, resourceType } = getResourceFromAlias(rowData);
    const dispatch = useDispatch();
    const [showRef, setShowRef] = useState(true);
    const [referencesRequested, setReferencesRequested] = useState(false);
    const resourceReferences = useSelector(state =>
      selectors.resourceReferences(state)
    );
    const resourceAliases = useSelectorMemo(selectors.makeOwnAliases, parentResourceType, parentResourceId);
    const { confirmDialog } = useConfirmDialog();

    const deleteResource = useCallback(() => {
      setShowRef(true);

      if (resourceReferences) return;

      const patchSet = [
        {
          op: 'replace',
          path: '/aliases',
          value: resourceAliases.filter(aliasData => aliasData.alias !== rowData.alias),
        },
      ];

      dispatch(actions.resource.patch(parentResourceType, parentResourceId, patchSet, ALIAS_FORM_KEY));
    }, [dispatch, resourceReferences, parentResourceId, parentResourceType, resourceAliases, rowData]);

    const handleDelete = useCallback(() => {
      confirmDialog({
        title: 'Delete alias?',
        message: 'Are you sure you want to delete your alias? If you delete it, then any resources that reference the alias will now reference the ID. You’ll need to update the resource with a new or existingh alias if you want to reference a different alias.',
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

    useEffect(() => () => dispatch(actions.resource.clearReferences()), [
      dispatch,
    ]);

    useEffect(() => {
      if (!referencesRequested) {
        dispatch(
          actions.resource.requestReferences(resourceType, id, {
            ignoreError: true,
          })
        );
        setReferencesRequested(true);
      }
    }, [dispatch, referencesRequested, id, resourceType]);

    useEffect(() => {
      handleDelete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <>
        {showRef && resourceReferences && resourceReferences.length > 0 && (
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
