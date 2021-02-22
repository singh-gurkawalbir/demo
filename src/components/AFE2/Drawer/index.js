import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouteMatch, Redirect } from 'react-router-dom';
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

// Note that props contain the forwarded 'fullPath' and 'onClose' handlers
// proxied from the right drawer.
// hideSave: This is currently only used for the playground where we do not
// want the user to have any options to save the editor.
// eslint-disable-next-line no-unused-vars
function RouterWrappedContent({ hideSave, onClose, fullPath}) {
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const { editorId } = useParams();
  const editorType = useSelector(state => selectors._editor(state, editorId).editorType);
  const editorTitle = useSelector(state => selectors._editor(state, editorId).editorTitle);

  if (!editorType) {
    // redirect to parent url
    const urlFields = match.url.split('/');

    // strip the '/editor...' suffix from the url
    const redirectToParentRoute = urlFields.slice(0, urlFields.indexOf('editor')).join('/');

    return <Redirect to={redirectToParentRoute} />;
  }

  const { label } = editorMetadata[editorType] || {};

  const handleClose = () => {
    dispatch(actions._editor.clear(editorId));
    onClose();
  };

  const CloseButton = <CloseIconButton onClose={handleClose} editorId={editorId} />;

  return (
    <>
      <DrawerHeader title={editorTitle || label} CloseButton={CloseButton} fullPath={fullPath}>
        <ActionsRibbon editorId={editorId} />
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
