import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, MenuItem, Select } from '@material-ui/core';
// TODO: @Azhar, can you fix this to use our own icon?
import ViewRowIcon from '@material-ui/icons/HorizontalSplit';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import ViewColumnIcon from '../../../icons/LayoutTriVerticalIcon';
import ViewCompactIcon from '../../../icons/LayoutLgLeftSmrightIcon';
import CeligoDivider from '../../../CeligoDivider';

const useStyles = makeStyles(theme => ({
  togglelLayoutSelect: {
    '& > div': {
      paddingBottom: 0,
      paddingTop: 4,
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

export default function ToggleLayout({ editorId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const layout = useSelector(state => selectors._editor(state, editorId).layout);

  const handleToggle2 = event => {
    dispatch(actions._editor.changeLayout(editorId, event.target.value));
  };

  return (
    <>
      <CeligoDivider position="left" />

      <>
        <Select
          labelId="toggle-layout-label"
          id="toggle-layout"
          value={layout}
          className={classes.togglelLayoutSelect}
          onChange={handleToggle2}
      >
          <MenuItem className={classes.item} value="column"><ViewColumnIcon /></MenuItem>
          <MenuItem className={classes.item} value="compact"><ViewCompactIcon /></MenuItem>
          <MenuItem className={classes.item} value="row"> <ViewRowIcon /></MenuItem>
        </Select>
      </>
    </>
  );
}
