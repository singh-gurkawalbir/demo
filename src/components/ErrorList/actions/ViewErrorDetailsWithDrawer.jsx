import { Fragment, useCallback, useState } from 'react';
import ErrorDetailsDrawer from '../drawers/ErrorDetailsDrawer';

export default {
  label: 'View Error Details',
  component: function ViewErrorDetails({ resource, flowId, resourceId }) {
    const { errorId } = resource;
    const [showDrawer, setShowDrawer] = useState(false);
    const handleClick = useCallback(() => setShowDrawer(true), []);
    const handleClose = useCallback(() => setShowDrawer(false), []);

    return (
      <Fragment>
        <div data-test="viewErrorDetails" onClick={handleClick}>
          View error details
        </div>
        {showDrawer ? (
          <ErrorDetailsDrawer
            flowId={flowId}
            resourceId={resourceId}
            errorId={errorId}
            mode="view"
            onClose={handleClose}
          />
        ) : null}
      </Fragment>
    );
  },
};
