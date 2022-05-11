import clsx from 'clsx';
import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { selectors } from '../../../../reducers';
import editorMetadata from '../../metadata';
import PreviewButtonGroup from '../actions/PreviewButtonGroup';
import ToggleLayout from '../actions/ToggleLayout';
import ActionGroup from '../../../ActionGroup';
import CeligoDivider from '../../../CeligoDivider';

const useStyles = makeStyles({
  ribbon: {
    display: 'flex',
    width: '100%',
  },
  menuIcon: {
    marginRight: '4px !important',
  },
});

export default function ActionsRibbon({ editorId, className }) {
  const classes = useStyles();
  const editorType = useSelector(state => selectors.editor(state, editorId).editorType);
  const hidePreview = useSelector(state => selectors.editor(state, editorId).hidePreview);

  // console.log('drawer editor', editorId, editor);
  const { drawer = {} } = editorMetadata[editorType] || {};
  const { showLayoutToggle, actions: drawerActions = [] } = drawer;
  const leftActions = drawerActions.filter(a => a.position === 'left');
  // Note: we default to right. currently only the afe1/2 data toggle is left aligned.
  const rightActions = drawerActions.filter(a => a.position === 'right');
  const menuActions = drawerActions.filter(a => a.position === 'menu');

  if (menuActions.length > 1) {
    throw new Error(`Only 1 menu action is allowed. Found ${menuActions.length}`);
  }

  const MenuAction = menuActions.length ? menuActions[0].component : null;

  return (
    <div className={clsx(classes.ribbon, className)}>
      <ActionGroup>
        { // eslint-disable-next-line react/no-array-index-key
          leftActions.map((a, i) => <a.component key={i} editorId={editorId} />)
        }
      </ActionGroup>

      <ActionGroup position="right">
        { // eslint-disable-next-line react/no-array-index-key
          rightActions.map((a, i) => <a.component key={i} editorId={editorId} />)
        }
        {!hidePreview &&
        <PreviewButtonGroup editorId={editorId} />}

        { showLayoutToggle && <ToggleLayout editorId={editorId} /> }

        { MenuAction && (
          <>
            <CeligoDivider position="left" />

            <div className={classes.menuIcon}>
              <MenuAction editorId={editorId} />
            </div>

            <CeligoDivider position="left" />
          </>
        ) }
      </ActionGroup>
    </div>
  );
}
