import { Fragment, useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useConfirmDialog from '../../../ConfirmDialog';
import TrashIcon from '../../../icons/TrashIcon';
import actions from '../../../../actions';
import * as selectors from '../../../../reducers';
import { MODEL_PLURAL_TO_LABEL } from '../../../../utils/resource';
import ResourceReferences from '../../../ResourceReferences';

export default {
  title: 'Delete',
  icon: TrashIcon,
  component: function DeleteResource({ resourceType, resource = {} }) {
    const { _id: resourceId } = resource;
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
    const deleteResouce = useCallback(() => {
      const type =
        resourceType && resourceType.indexOf('/licenses') >= 0
          ? 'license'
          : MODEL_PLURAL_TO_LABEL[resourceType];

      confirmDialog({
        title: 'Confirm',
        message: `Are you sure you want to delete this ${type}?`,
        buttons: [
          {
            label: 'Cancel',
          },
          {
            label: 'Yes',
            onClick: deleteResource,
          },
        ],
      });
    }, [confirmDialog, deleteResource, resourceType]);
    const handleResourceReferenceClose = useCallback(() => {
      setShowRef(false);
    }, []);

    useEffect(() => {
      deleteResouce();
    }, [deleteResouce]);

    return (
      <Fragment>
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
      </Fragment>
    );
  },
};
