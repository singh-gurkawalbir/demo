import clsx from 'clsx';
import React from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useGlobalSearchState } from '../GlobalSearchContext/createGlobalSearchState';

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

function MenuItem({ type, label, resourceURL }) {
  const classes = useStyles();
  const isChecked = useGlobalSearchState(state => state.filters.includes(resourceURL) || (type === 'all' && !state.filters.length));
  const setFilters = useGlobalSearchState(state => state.changeFilters);
  const handleMenuItemClick = resourceURL => () => {
    setFilters(resourceURL);
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
            onClick={handleMenuItemClick(resourceURL)}
            name={type}
            className={clsx({[classes.allItemChecked]: isChecked && type === 'all' })}
            color="primary" />
          )}
        label={label} />
    </div>
  );
}

export default React.memo(MenuItem);
