import { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton } from '@material-ui/core';
import { confirmDialog } from '../../../ConfirmDialog';
import Icon from '../../../icons/TrashIcon';
import actions from '../../../../actions';
import * as selectors from '../../../../reducers';
import { MODEL_PLURAL_TO_LABEL } from '../../../../utils/resource';
import ResourceReferences from '../../../ResourceReferences';

export default {
  label: 'Delete',
  component: function Delete({ resourceType, resource }) {
    const dispatch = useDispatch();
    const [showRef, setShowRef] = useState(false);
    const resourceReferences = useSelector(state =>
      selectors.resourceReferences(state)
    );
    const type =
      resourceType && resourceType.indexOf('/licenses') >= 0
        ? 'license'
        : MODEL_PLURAL_TO_LABEL[resourceType];
    const handleClick = () => {
      confirmDialog({
        title: 'Confirm',
        message: `Are you sure you want to delete this ${type}?`,
        buttons: [
          {
            label: 'Cancel',
          },
          {
            label: 'Yes',
            onClick: () => {
              dispatch(actions.resource.delete(resourceType, resource._id));
              setShowRef(true);
            },
          },
        ],
      });
    };

    return (
      <Fragment>
        <IconButton
          data-test="deleteResource"
          size="small"
          onClick={handleClick}>
          <Icon />
        </IconButton>
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
            resourceId={resource._id}
            onClose={() => setShowRef(false)}
          />
        )}
      </Fragment>
    );
  },
};
