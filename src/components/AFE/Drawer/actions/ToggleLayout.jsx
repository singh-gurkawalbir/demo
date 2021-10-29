import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, MenuItem, Select } from '@material-ui/core';
// TODO: @Azhar, can you fix this to use our own icon?
import ViewRowIcon from '@material-ui/icons/HorizontalSplit';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import ViewColumnIcon from '../../../icons/LayoutTriVerticalIcon';
import ViewCompactIcon from '../../../icons/LayoutLgLeftSmrightIcon';
import ViewCompactRowIcon from '../../../icons/LayoutLgTopSmBottomIcon';
import CeligoDivider from '../../../CeligoDivider';

const useStyles = makeStyles(theme => ({
  toggleLayoutSelect: {
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

export default function ToggleLayout({ editorId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const layout = useSelector(state => selectors.editor(state, editorId).layout);
  const editorType = useSelector(state => selectors.editor(state, editorId).editorType);
  const isMappingsEditor = editorType === 'mappings' || editorType === 'responseMappings';

  const handleToggle = event => {
    dispatch(actions.editor.changeLayout(editorId, event.target.value));
  };

  return (
    <>
      <CeligoDivider position="left" />
      <>
        <Select
          labelId="toggle-layout-label"
          id="toggle-layout"
          value={layout}
          className={classes.toggleLayoutSelect}
          onChange={handleToggle} >
          {!isMappingsEditor && <MenuItem className={classes.item} value="column"><ViewColumnIcon /></MenuItem> }
          <MenuItem className={classes.item} value="compact"><ViewCompactIcon /></MenuItem>
          {!isMappingsEditor && <MenuItem className={classes.item} value="row"> <ViewRowIcon /></MenuItem> }
          {isMappingsEditor && <MenuItem className={classes.item} value="compactRow"> <ViewCompactRowIcon /></MenuItem> }
        </Select>
      </>
    </>
  );
}
