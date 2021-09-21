import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { useParams, useRouteMatch, useHistory } from 'react-router-dom';
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

const useStyles = makeStyles(theme => ({
  drawerHeader: {
    '& > h4': {
      whiteSpace: 'nowrap',
    },
  },
  headerLongTitle: {
    '& > h4': {
      whiteSpace: 'normal',
      wordBreak: 'break-word',
    },
  },
  drawerHeaderRibbon: {
    '& > * .MuiToggleButtonGroup-root': {
      marginRight: theme.spacing(0.5),
      '& > button': {
        minWidth: '70px',
      },
    },
  },

}));

// hideSave: This is currently only used for the playground where we do not
// want the user to have any options to save the editor.
function RouterWrappedContent({ hideSave, playGroundMode }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const { editorId } = useParams();
  const { onClose } = useDrawerContext();
  const editorType = useSelector(state => selectors.editor(state, editorId).editorType);
  const editorTitle = useSelector(state => selectors.editor(state, editorId).editorTitle);

  useEffect(() => {
    if (!editorType) {
      // redirect to parent url
      const urlFields = match.url.split('/');

      // strip the '/editor...' suffix from the url
      const redirectToParentRoute = urlFields.slice(0, urlFields.indexOf('editor')).join('/');

      history.replace(redirectToParentRoute);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!editorType) {
    return null;
  }

  const { label } = editorMetadata[editorType] || {};
  const handleClose = () => {
    dispatch(actions.editor.clear(editorId));
    onClose();
  };
  const CloseButton = !playGroundMode && <CloseIconButton editorId={editorId} />;
  const drawerTitle = editorTitle || label;

  return (
    <>
      <DrawerHeader title={drawerTitle} CloseButton={CloseButton} className={clsx(classes.drawerHeader, {[classes.headerLongTitle]: drawerTitle?.length > 45 })}>
        <ActionsRibbon editorId={editorId} className={classes.drawerHeaderRibbon} />
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

export default function EditorDrawer({ hideSave, hidePreview, playGroundMode, width = 'full' }) {
  return (
    <RightDrawer
      path="editor/:editorId"
      variant="temporary"
      height="tall"
      width={width}>
      <RouterWrappedContent hideSave={hideSave} hidePreview={hidePreview} playGroundMode={playGroundMode} />
    </RightDrawer>
  );
}
