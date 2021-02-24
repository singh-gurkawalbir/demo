import clsx from 'clsx';
import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { selectors } from '../../../../reducers';
import editorMetadata from '../../metadata';
import PreviewButtonGroup from '../actions/PreviewButtonGroup';
import HelpIconButton from '../actions/HelpIconButton';
import ToggleLayout from '../actions/ToggleLayout';
import ActionGroup from '../../../ActionGroup';

const useStyles = makeStyles({
  ribbon: {
    display: 'flex',
    width: '100%',
  },
});

export default function ActionsRibbon({ editorId, className, hidePreview }) {
  const classes = useStyles();
  const editorType = useSelector(state => selectors._editor(state, editorId).editorType);

  // console.log('drawer editor', editorId, editor);
  const { drawer = {} } = editorMetadata[editorType] || {};
  const { showLayoutToggle, actions: drawerActions = [] } = drawer;
  const leftActions = drawerActions.filter(a => a.position === 'left');
  // Note: we default to right. currently only the afe1/2 data toggle is left aligned.
  const rightActions = drawerActions.filter(a => a.position !== 'left');

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

        <HelpIconButton editorId={editorId} />
      </ActionGroup>
    </div>
  );
}
