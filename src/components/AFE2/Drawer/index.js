import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouteMatch, Redirect } from 'react-router-dom';
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
import { useDrawerContext } from '../../drawer/Right/DrawerContext';

const useStyles = makeStyles({
  afe2DrawerHeader: {
    '& > h4': {
      minWidth: '19%',
    },
  },

});

// hideSave: This is currently only used for the playground where we do not
// want the user to have any options to save the editor.
function RouterWrappedContent({ hideSave }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const { editorId } = useParams();
  const { onClose } = useDrawerContext();
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
      <DrawerHeader title={editorTitle || label} CloseButton={CloseButton} className={classes.afe2DrawerHeader}>
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
