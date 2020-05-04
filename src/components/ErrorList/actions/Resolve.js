import { Fragment, useCallback } from 'react';

export default {
  label: 'Resolve',
  component: function Resolve() {
    const handleClick = useCallback(() => {}, []);

    return (
      <Fragment>
        <div data-test="resolveError" onClick={handleClick}>
          Resolve
        </div>
      </Fragment>
    );
  },
};
