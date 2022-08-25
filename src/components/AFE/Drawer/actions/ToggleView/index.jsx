import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { makeStyles, MenuItem, Select } from '@material-ui/core';
import { selectors } from '../../../../../reducers';
import ViewWithRowsIcon from '../../../../icons/ViewWithRows';
import ViewWithRowsPanelIcon from '../../../../icons/ViewWithRowsPanel';

const useStyles = makeStyles(theme => ({
  toggleViewSelect: {
    '& > div': {
      paddingBottom: 0,
      paddingTop: theme.spacing(0.5),
      color: theme.palette.secondary.light,
    },
  },
  item: {
    color: theme.palette.secondary.light,
    '& > svg': {
      padding: 0,
    },
  },
}));

const toggleOptions = {
  openErrorViews: [
    { value: 'split', Icon: <ViewWithRowsPanelIcon /> },
    { value: 'drawer', Icon: <ViewWithRowsIcon /> },
  ]};

export default function ToggleViewSelect({ variant, filterKey, defaultView = '', handleToggleChange }) {
  const classes = useStyles();
  const view = useSelector(state => {
    const e = selectors.filter(state, filterKey);

    return e.view || defaultView;
  }, shallowEqual);

  const handleToggle = event => {
    if (handleToggleChange) {
      handleToggleChange(event);
    }
  };

  return (
    <>
      <Select
        labelId="toggle-view-label"
        id="toggle-view"
        value={view}
        className={classes.toggleViewSelect}
        onChange={handleToggle} >
        {toggleOptions[variant]?.map(item => (
          <MenuItem key={item.value} className={classes.item} value={item.value}>{item.Icon}</MenuItem>
        ))}
      </Select>
    </>
  );
}

