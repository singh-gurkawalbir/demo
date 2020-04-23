import { Fragment, useCallback } from 'react';
import { IconButton } from '@material-ui/core';
import Icon from '../../icons/TrashIcon';

export default {
  label: 'Retry',
  component: function Retry() {
    const handleClick = useCallback(() => {}, []);

    return (
      <Fragment>
        <IconButton data-test="retryError" size="small" onClick={handleClick}>
          <Icon />
        </IconButton>
      </Fragment>
    );
  },
};
