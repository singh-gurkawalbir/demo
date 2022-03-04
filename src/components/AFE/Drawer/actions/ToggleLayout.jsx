import React from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { makeStyles, MenuItem, Select } from '@material-ui/core';
import ViewRowIcon from '../../../icons/VerticalLayoutIcon';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import ViewColumnIcon from '../../../icons/LayoutTriVerticalIcon';
import ViewCompactIcon from '../../../icons/LayoutLgLeftSmrightIcon';
import ViewCompactRowIcon from '../../../icons/LayoutLgTopSmBottomIcon';
import ViewAssistantRightIcon from '../../../icons/LayoutAssistantRightIcon';
import ViewAssistantTopRightIcon from '../../../icons/LayoutAssistantTopRightIcon';
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
  const {layout, mappingPreviewType, isMappingsEditor} = useSelector(state => {
    const e = selectors.editor(state, editorId);

    return {
      mappingPreviewType: e.mappingPreviewType,
      isMappingsEditor: e.editorType === 'mappings' || e.editorType === 'responseMappings',
      layout: e.layout,
    };
  }, shallowEqual);

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
          {!!mappingPreviewType && <MenuItem className={classes.item} value="assistantRight"> <ViewAssistantRightIcon /></MenuItem> }
          {!!mappingPreviewType && <MenuItem className={classes.item} value="assistantTopRight"> <ViewAssistantTopRightIcon /></MenuItem> }
        </Select>
      </>
    </>
  );
}
