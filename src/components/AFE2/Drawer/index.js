import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { selectors } from '../../../reducers';
import RightDrawer from '../../drawer/Right';
import DrawerHeader from '../../drawer/Right/DrawerHeader';
import DrawerContent from '../../drawer/Right/DrawerContent';
import DrawerFooter from '../../drawer/Right/DrawerFooter';
import Editor from '../Editor';
import editorMetadata from '../metadata';
import SaveButtonGroup from '../SaveButtonGroup';
import CloseIconButton from './CloseIconButton';
import actions from '../../../actions';
import ActionsRibbon from './ActionsRibbon';

const useStyles = makeStyles({
  afe2DrawerHeader: {
    '& > h4': {
      minWidth: '19%',
    },
  },

});

// Note that props contain the forwarded 'fullPath' and 'onClose' handlers
// proxied from the right drawer.
// hideSave: This is currently only used for the playground where we do not
// want the user to have any options to save the editor.
// eslint-disable-next-line no-unused-vars
function RouterWrappedContent({ hideSave, hidePreview, onClose, fullPath}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { editorId } = useParams();
  const editorType = useSelector(state => selectors._editor(state, editorId).editorType);
  const editorTitle = useSelector(state => selectors._editor(state, editorId).editorTitle);

  // console.log('drawer editor', editorId, editor);
  const { label } = editorMetadata[editorType] || {};
  // is it safe to clear the state when the drawer is closed??
  const handleClose = () => {
    dispatch(actions._editor.clear(editorId));
    onClose();
  };

  const CloseButton = <CloseIconButton onClose={handleClose} editorId={editorId} />;

  return (
    <>
      <DrawerHeader title={editorTitle || label} CloseButton={CloseButton} fullPath={fullPath} className={classes.afe2DrawerHeader}>
        <ActionsRibbon editorId={editorId} hidePreview={hidePreview} />
      </DrawerHeader>

      <DrawerContent>
        <Editor editorId={editorId} />
      </DrawerContent>

      {!hideSave && (
      <DrawerFooter>
        <SaveButtonGroup editorId={editorId} onClose={handleClose} />
      </DrawerFooter>
      )}
    </>
  );
}

export default function EditorDrawer({ hideSave, hidePreview, width = 'full' }) {
  return (
    <RightDrawer
      path="editor/:editorId"
      variant="temporary"
      height="tall"
      width={width}>
      <RouterWrappedContent hideSave={hideSave} hidePreview={hidePreview} />
    </RightDrawer>
  );
}
