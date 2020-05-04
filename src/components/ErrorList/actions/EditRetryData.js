import { Fragment, useCallback } from 'react';

export default {
  label: 'Resolve',
  component: function Resolve() {
    const handleClick = useCallback(() => {}, []);

    return (
      <Fragment>
        <div data-test="editRetryData" onClick={handleClick}>
          Edit retry data
        </div>
      </Fragment>
    );
  },
};
