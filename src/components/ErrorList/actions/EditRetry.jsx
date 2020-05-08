import { Fragment, useCallback, useState } from 'react';
import { IconButton } from '@material-ui/core';
import ErrorDetailsDrawer from '../drawers/ErrorDetailsDrawer';
import Icon from '../../icons/EditIcon';

export default {
  label: 'Edit retry ',
  component: function EditRetry({ resource, flowId, resourceId }) {
    const { errorId } = resource;
    const [showDrawer, setShowDrawer] = useState(false);
    const handleClick = useCallback(() => setShowDrawer(true), []);
    const handleClose = useCallback(() => setShowDrawer(false), []);

    return (
      <Fragment>
        <IconButton data-test="editRetry" size="small" onClick={handleClick}>
          <Icon />
        </IconButton>
        <ErrorDetailsDrawer
          open={showDrawer}
          flowId={flowId}
          resourceId={resourceId}
          errorId={errorId}
          mode="edit"
          onClose={handleClose}
        />
      </Fragment>
    );
  },
};
