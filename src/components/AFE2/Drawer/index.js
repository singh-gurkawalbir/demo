import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { selectors } from '../../../reducers';
import RightDrawer from '../../drawer/Right';
import DrawerHeader from '../../drawer/Right/DrawerHeader';
import DrawerContent from '../../drawer/Right/DrawerContent';
import DrawerFooter from '../../drawer/Right/DrawerFooter';
import Editor from '../Editor';
import editorMetadata from '../metadata';
import PreviewButtonGroup from '../PreviewButtonGroup';
import SaveButtonGroup from '../SaveButtonGroup';
import HelpIconButton from './actions/HelpIconButton';
import useConfirmDialog from '../../ConfirmDialog';

const useStyles = makeStyles({
  spaceBetween: { flexGrow: 100 },
});

// Note that props contain the forwarded 'fullPath' and 'onClose' handlers
// proxied from the right drawer.
// hideSave: This is currently only used for the playground where we do not
// want the user to have any options to save the editor.
function RouterWrappedContent({ hideSave, onClose, fullPath}) {
  const classes = useStyles();
  const { editorId } = useParams();
  const { confirmDialog } = useConfirmDialog();
  // TODO: @Ashu, processor and type are not the same. type is used to differentiate
  // between editors that share the same processor. We then can have metadata specific
  // to each editor variant. If you have a better idea, pls share. Also maybe "type"
  // could be renamed.
  const type = useSelector(state => selectors._editor(state, editorId).processor);
  const editorTitle = useSelector(state => selectors._editor(state, editorId).editorTitle);
  const isEditorDirty = useSelector(state =>
    selectors._isEditorDirty(state, editorId)
  );

  const handleCancelClick = useCallback(() => {
    if (!isEditorDirty) {
      return onClose();
    }

    confirmDialog({
      title: 'Confirm cancel',
      message: 'Are you sure you want to cancel? You have unsaved changes that will be lost if you proceed.',
      buttons: [
        {
          label: 'Yes, cancel',
          onClick: onClose,
        },
        {
          label: 'No, go back',
          color: 'secondary',
        },
      ],
    });
    // todo @dave, when isEditorDirty changes, this component gets re-rendered
    // and the typing cursor goes away and user has to click in the panel again to type
  }, [confirmDialog, isEditorDirty, onClose]);

  // console.log('drawer editor', editorId, editor);
  const { label, drawer = {} } = editorMetadata[type] || {};
  const { actions } = drawer;

  return (
    <>
      <DrawerHeader title={editorTitle || label} onClose={handleCancelClick} fullPath={fullPath}>
        { // eslint-disable-next-line react/no-array-index-key
          actions && actions.map((Action, i) => <Action key={i} editorId={editorId} />)
        }
        <HelpIconButton editorId={editorId} />
      </DrawerHeader>

      <DrawerContent>
        <Editor editorId={editorId} />
      </DrawerContent>

      <DrawerFooter>
        {!hideSave && (
          <SaveButtonGroup editorId={editorId} onClose={handleCancelClick} />
        )}
        <div className={classes.spaceBetween} />
        <PreviewButtonGroup editorId={editorId} />
      </DrawerFooter>
    </>
  );
}

export default function EditorDrawer({ hideSave }) {
  return (
    <RightDrawer
      path="editor/:editorId"
      variant="temporary"
      height="tall"
      width="large">
      <RouterWrappedContent hideSave={hideSave} />
    </RightDrawer>
  );
}
