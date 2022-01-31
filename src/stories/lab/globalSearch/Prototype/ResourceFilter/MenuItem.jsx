
import clsx from 'clsx';
import React from 'react';
import { makeStyles,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';

import { useGlobalSearchState } from '../hooks/useGlobalSearchState';

const useStyles = makeStyles(theme => ({
  itemRoot: {
    '&:focus': {
      backgroundColor: theme.palette.background.paper2,
      cursor: 'pointer',
      outline: 'unset',
    },
  },
  allItemChecked: {
    color: `${theme.palette.text.disabled}!important`,
    cursor: 'not-allowed',
  },
}));

function MenuItem({ type, label }) {
  const classes = useStyles();
  const isChecked = useGlobalSearchState(state => state.filters.includes(type) || (type === 'all' && !state.filters?.length));
  const setFilters = useGlobalSearchState(state => state.changeFilters);

  const handleMenuItemClick = type => () => {
    setFilters(type);
  };

  return (
    <div>
      <FormControlLabel
        tabIndex={0}
        classes={{root: classes.itemRoot}}
        control={(
          <Checkbox
            tabIndex={-1}
            checked={isChecked}
            onClick={handleMenuItemClick(type)}
            name={type}
            className={clsx({[classes.allItemChecked]: isChecked && type === 'all' })}
            color="primary" />
          )}
        label={label} />
    </div>
  );
}

export default React.memo(MenuItem);
