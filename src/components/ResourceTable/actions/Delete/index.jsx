import { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton } from '@material-ui/core';
import { confirmDialog } from '../../../ConfirmDialog';
import Icon from '../../../icons/CloseIcon';
import actions from '../../../../actions';
import * as selectors from '../../../../reducers';
import { MODEL_PLURAL_TO_LABEL } from '../../../../utils/resource';
import ResourceReferences from '../../../ResourceReferences';
import { RESOURCE_TYPE_PLURAL_TO_SINGULAR } from '../../../../constants/resource';

export default {
  label: 'Delete',
  component: function Delete({ resourceType, resource }) {
    const dispatch = useDispatch();
    const [showRef, setShowRef] = useState(false);
    const resourceReferences = useSelector(state =>
      selectors.resourceReferences(state)
    );
    const handleClick = () => {
      confirmDialog({
        title: 'Confirm',
        message: `Are you sure you want to delete this ${MODEL_PLURAL_TO_LABEL[resourceType]}?`,
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
        <IconButton size="small" onClick={handleClick}>
          <Icon />
        </IconButton>
        {showRef && resourceReferences && resourceReferences.length > 0 && (
          <ResourceReferences
            title={`Unable to delete ${RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType]} as`}
            type={resourceType}
            id={resource._id}
            onClose={() => setShowRef(false)}
          />
        )}
      </Fragment>
    );
  },
};
