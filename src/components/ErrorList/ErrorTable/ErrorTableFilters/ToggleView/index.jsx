import React from 'react';
import { MenuItem, Select } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ViewWithRowsIcon from '../../../../icons/ViewWithRows';
import ViewWithRowsPanelIcon from '../../../../icons/ViewWithRowsPanel';
import { OPEN_ERRORS_VIEW_TYPES } from '../../../../../constants';

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
    { value: OPEN_ERRORS_VIEW_TYPES.SPLIT, Icon: <ViewWithRowsPanelIcon data-test="viewWithRowsPanelIcon" /> },
    { value: OPEN_ERRORS_VIEW_TYPES.LIST, Icon: <ViewWithRowsIcon data-test="viewWithRowsIcon" /> },
  ]};

export default function ToggleViewSelect({
  variant,
  defaultView = OPEN_ERRORS_VIEW_TYPES.SPLIT,
  handleToggleChange,
  viewType,
}) {
  const classes = useStyles();

  return (
    <Select
      variant="standard"
      labelId="toggle-view-label"
      id="toggle-view"
      value={viewType || defaultView}
      className={classes.toggleViewSelect}
      onChange={handleToggleChange}>
      {toggleOptions[variant]?.map(item => (
        <MenuItem key={item.value} className={classes.item} value={item.value}>{item.Icon}</MenuItem>
      ))}
    </Select>
  );
}

