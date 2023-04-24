import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useConfirmDialog from '../../../ConfirmDialog';
import TrashIcon from '../../../icons/TrashIcon';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import { MODEL_PLURAL_TO_LABEL } from '../../../../utils/resource';
import ResourceReferences from '../../../ResourceReferences';
import { useGetTableContext } from '../../../CeligoTable/TableContext';

export default {
  key: 'delete',
  mode: 'delete',
  useLabel: rowData => {
    const tableContext = useGetTableContext();

    if (tableContext.resourceType === 'iClients') {
      return 'Delete iClient';
    }
    if (['accesstokens', 'apis', 'connectors'].includes(tableContext.resourceType)) {
      return `Delete ${MODEL_PLURAL_TO_LABEL[tableContext?.resourceType]}`;
    }
    if (tableContext?.resourceType?.includes('/licenses')) {
      if (rowData.type === 'integrationAppChild') {
        return 'Delete child license';
      }

      return 'Delete license';
    }

    return `Delete ${MODEL_PLURAL_TO_LABEL[tableContext?.resourceType]?.toLowerCase()}`;
  },
  icon: TrashIcon,
  useHasAccess: rowData => {
    const {resourceType} = useGetTableContext();

    const { _integrationId, _connectorId } = rowData;
    const canDelete = useSelector(state => selectors.resourcePermissions(
      state,
      'integrations',
      _integrationId,
      'flows'
    ))?.delete;
    const isTrialLicense = useSelector(state =>
      selectors.resource(state, 'connectors', _connectorId)?._trialLicenseId === rowData?._id
    );

    if (isTrialLicense) {
      return false;
    }
    // only check permissions for integration flows as only those can be shared
    if (resourceType !== 'flows' || !_integrationId) { return true; }

    return canDelete;
  },
  useDisabledActionText: rowData => {
    const {resourceType} = useGetTableContext();

    if (resourceType === 'accesstokens' && !rowData.revoked) {
      return 'To delete this API token you need to revoke it first.';
    }
  },
  Component: ({rowData}) => {
    const {resourceType} = useGetTableContext();

    const { _id: resourceId } = rowData;
    const dispatch = useDispatch();
    const [showRef, setShowRef] = useState(true);
    const resourceReferences = useSelector(state =>
      selectors.resourceReferences(state)
    );
    const { confirmDialog } = useConfirmDialog();
    const deleteResource = useCallback(() => {
      dispatch(actions.resource.delete(resourceType, resourceId));
      setShowRef(true);
    }, [dispatch, resourceId, resourceType]);
    const handleDelete = useCallback(() => {
      let type;

      if (['accesstokens', 'apis', 'connectors'].includes(resourceType)) {
        type = MODEL_PLURAL_TO_LABEL[resourceType];
      } else {
        type =
        resourceType && resourceType.indexOf('/licenses') >= 0
          ? 'license'
          : MODEL_PLURAL_TO_LABEL[resourceType].toLowerCase();
      }

      const disclaimer = resourceType === 'flows' && 'Are you sure you want to delete this flow? Deleting a flow will cancel the run that is currently running.';
      const checkType = type === 'iclient' ? 'iClient' : type;

      confirmDialog({
        title: 'Confirm delete',
        message: disclaimer || `Are you sure you want to delete this ${checkType}?`,
        buttons: [
          {
            label: 'Delete',
            error: true,
            onClick: deleteResource,
          },
          {
            label: 'Cancel',
            variant: 'text',
          },
        ],
      });
    }, [confirmDialog, deleteResource, resourceType]);
    const handleResourceReferenceClose = useCallback(() => {
      setShowRef(false);
    }, []);

    useEffect(() => {
      handleDelete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <>
        {showRef && resourceReferences && resourceReferences.length > 0 && (
          <ResourceReferences
            // TODO: this is a horrible pattern.
            // How would anyone know that `title` prop controls if a delete message
            // is displayed in the references component? A quick change to make this
            // a little better would be to rename the 'title' prop to 'variant' and set the
            // value to 'delete'. Best still is to refactor to have a delete failure dialog.
            // Also, this component is a Dialog... all our dialog components are
            // suffixed with "Dialog". Why not this one?
            title
            resourceType={resourceType}
            resourceId={resourceId}
            onClose={handleResourceReferenceClose}
          />
        )}
      </>
    );
  },
};
