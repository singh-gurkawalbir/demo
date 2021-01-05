import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { selectors } from '../../../reducers';
import RightDrawer from '../../drawer/Right';
import DrawerHeader from '../../drawer/Right/DrawerHeader';
import DrawerContent from '../../drawer/Right/DrawerContent';
import DrawerFooter from '../../drawer/Right/DrawerFooter';
import Editor from '../Editor';
import editorMetadata from '../metadata';
import PreviewButtonGroup from './actions/PreviewButtonGroup';
import SaveButtonGroup from '../SaveButtonGroup';
import HelpIconButton from './actions/HelpIconButton';
import CloseIconButton from './CloseIconButton';
import actions from '../../../actions';
import ToggleLayout from './actions/ToggleLayout';

const useStyles = makeStyles({
  spaceBetween: { flexGrow: 100 },
});

// Note that props contain the forwarded 'fullPath' and 'onClose' handlers
// proxied from the right drawer.
// hideSave: This is currently only used for the playground where we do not
// want the user to have any options to save the editor.
// eslint-disable-next-line no-unused-vars
function RouterWrappedContent({ hideSave, onClose, fullPath}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { editorId } = useParams();
  const editorType = useSelector(state => selectors._editor(state, editorId).editorType);
  const editorTitle = useSelector(state => selectors._editor(state, editorId).editorTitle);

  // console.log('drawer editor', editorId, editor);
  const { label, drawer = {} } = editorMetadata[editorType] || {};
  const { showLayoutToggle, actions: drawerActions = [] } = drawer;
  const leftActions = drawerActions.filter(a => a.position === 'left');
  // Note: we default to right. currently only the afe1/2 data toggle is left aligned.
  const rightActions = drawerActions.filter(a => a.position !== 'left');
  // is it safe to clear the state when the drawer is closed??
  const handleClose = () => {
    dispatch(actions._editor.clear(editorId));
    onClose();
  };

  const CloseButton = <CloseIconButton onClose={handleClose} editorId={editorId} />;

  return (
    <>
      <DrawerHeader title={editorTitle || label} CloseButton={CloseButton} fullPath={fullPath}>
        { // eslint-disable-next-line react/no-array-index-key
          leftActions.map((a, i) => <a.component key={i} editorId={editorId} />)
        }

        <div className={classes.spaceBetween} />

        { // eslint-disable-next-line react/no-array-index-key
          rightActions.map((a, i) => <a.component key={i} editorId={editorId} />)
        }

        <PreviewButtonGroup editorId={editorId} />

        {showLayoutToggle && <ToggleLayout editorId={editorId} />}
        <HelpIconButton editorId={editorId} />
      </DrawerHeader>

      <DrawerContent>
        <Editor editorId={editorId} />
      </DrawerContent>

      <DrawerFooter>
        {!hideSave && (
          <SaveButtonGroup editorId={editorId} onClose={handleClose} />
        )}
      </DrawerFooter>
    </>
  );
}

export default function EditorDrawer({ hideSave, width = 'full' }) {
  return (
    <RightDrawer
      path="editor/:editorId"
      variant="temporary"
      height="tall"
      width={width}>
      <RouterWrappedContent hideSave={hideSave} />
    </RightDrawer>
  );
}
