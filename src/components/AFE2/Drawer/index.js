import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { selectors } from '../../../reducers';
import RightDrawer from '../../drawer/Right';
import DrawerHeader from '../../drawer/Right/DrawerHeader';
import DrawerContent from '../../drawer/Right/DrawerContent';
import DrawerFooter from '../../drawer/Right/DrawerFooter';
import Editor from '../Editor';
import editorMetadata from '../Editor/metadata';
import PreviewButtonGroup from '../PreviewButtonGroup';
import SaveButtonGroup from '../SaveButtonGroup';

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
  let editor = useSelector(state => selectors.editor(state, editorId));

  // hardcode editor for now until data layer is connected..
  editor = { type: 'formBuilder', mode: 'json' };

  const {type} = editor;
  const { label, drawerActions } = editorMetadata[type];

  return (
    <>
      <DrawerHeader title={label} onClose={onClose} fullPath={fullPath}>
        { // eslint-disable-next-line react/no-array-index-key
          drawerActions && drawerActions.map((Action, i) => <Action key={i} editorId={editorId} />)
        }
      </DrawerHeader>

      <DrawerContent>
        <Editor editorId={editorId} />
      </DrawerContent>

      <DrawerFooter>
        {!hideSave && (
          <SaveButtonGroup editorId={editorId} onClose={onClose} />
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
