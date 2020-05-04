import { Fragment, useCallback } from 'react';

export default {
  label: 'Retry',
  component: function Retry() {
    const handleClick = useCallback(() => {}, []);

    return (
      <Fragment>
        <div data-test="retryError" onClick={handleClick}>
          Retry
        </div>
      </Fragment>
    );
  },
};
