import { Fragment, useCallback } from 'react';

export default {
  label: 'View Error Details',
  component: function ViewErrorDetails() {
    const handleClick = useCallback(() => {}, []);

    return (
      <Fragment>
        <div data-test="viewErrorDetails" onClick={handleClick}>
          View error details
        </div>
      </Fragment>
    );
  },
};
