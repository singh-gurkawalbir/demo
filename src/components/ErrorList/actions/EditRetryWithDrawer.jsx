import { Fragment, useCallback, useState } from 'react';
import ErrorDetailsDrawer from '../drawers/ErrorDetailsDrawer';

export default {
  label: 'Edit retry ',
  component: function EditRetry({ resource, flowId, resourceId }) {
    const { errorId } = resource;
    const [showDrawer, setShowDrawer] = useState(false);
    const handleClick = useCallback(() => setShowDrawer(true), []);
    const handleClose = useCallback(() => setShowDrawer(false), []);

    return (
      <Fragment>
        <div data-test="editRetryData" onClick={handleClick}>
          Edit retry data
        </div>
        {showDrawer ? (
          <ErrorDetailsDrawer
            flowId={flowId}
            resourceId={resourceId}
            errorId={errorId}
            mode="edit"
            onClose={handleClose}
          />
        ) : null}
      </Fragment>
    );
  },
};
