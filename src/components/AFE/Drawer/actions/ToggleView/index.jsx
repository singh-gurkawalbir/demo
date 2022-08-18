import React from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { makeStyles, MenuItem, Select } from '@material-ui/core';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import ViewRowIcon from '../../../../icons/VerticalLayoutIcon';
import ViewAssistantRightIcon from '../../../../icons/LayoutAssistantRightIcon';

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
    { value: 'split', Icon: <ViewAssistantRightIcon /> },
    { value: 'drawer', Icon: <ViewRowIcon /> },
  ]};

export default function ToggleViewSelect({ variant, filterKey, defaultView = '' }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const view = useSelector(state => {
    const e = selectors.filter(state, filterKey);

    return e.view || defaultView;
  }, shallowEqual);

  const handleToggle = event => {
    dispatch(actions.patchFilter(filterKey, {
      view: event.target.value,
    }));
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

