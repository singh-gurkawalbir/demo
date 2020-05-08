import { Fragment, useCallback, useState } from 'react';
import { IconButton } from '@material-ui/core';
import ErrorDetailsDrawer from '../drawers/ErrorDetailsDrawer';
import Icon from '../../icons/RevokeTokenIcon';

export default {
  label: 'View Error Details',
  component: function ViewErrorDetails({ resource, flowId, resourceId }) {
    const { errorId } = resource;
    const [showDrawer, setShowDrawer] = useState(false);
    const handleClick = useCallback(() => setShowDrawer(true), []);
    const handleClose = useCallback(() => setShowDrawer(false), []);

    return (
      <Fragment>
        <IconButton data-test="viewDetails" size="small" onClick={handleClick}>
          <Icon />
        </IconButton>
        <ErrorDetailsDrawer
          flowId={flowId}
          open={showDrawer}
          resourceId={resourceId}
          errorId={errorId}
          mode="view"
          onClose={handleClose}
        />
      </Fragment>
    );
  },
};
