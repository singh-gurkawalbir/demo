import React, { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import clsx from 'clsx';
import { useParams, useRouteMatch, useHistory } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
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
import TitleHelp from './TitleHelp';
import EditorBanner from '../Editor/EditorBanner';
import { drawerPaths } from '../../../utils/rightDrawer';
import UserIdleTracker from './UserIdleTracker';

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
function RouterWrappedContent({ hideSave }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const { editorId } = useParams();
  const { onClose } = useDrawerContext();
  const {editorType, editorTitle, initStatus} = useSelector(state => {
    const e = selectors.editor(state, editorId);

    return {
      editorType: e.editorType,
      editorTitle: e.editorTitle,
      initStatus: e.initStatus,
    };
  }, shallowEqual);

  useEffect(() => {
    // we want to redirect to parent url only if the editor init is not in progress

    // this works for 'mappings' editor for now as there is another RightDrawer to render mappings path which does the editor init
    // but 'responseMappings' is now completely an editor so it lands here directly on page reload and editor init does not happen,
    // hence it gets redirected to parent url
    // if we decide to support page reload for mappings, we somehow need to do editor init here for such use case
    if (initStatus !== 'inProgress' && !editorType) {
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
  const CloseButton = <CloseIconButton editorId={editorId} onClose={handleClose} hideSave={hideSave} />;
  const drawerTitle = editorTitle || label;

  return (
    <>
      <DrawerHeader title={drawerTitle} CloseButton={CloseButton} className={clsx(classes.drawerHeader, {[classes.headerLongTitle]: drawerTitle?.length > 45 })}>
        <TitleHelp editorId={editorId} label={drawerTitle} />
        <ActionsRibbon editorId={editorId} className={classes.drawerHeaderRibbon} />
      </DrawerHeader>

      <DrawerContent>
        {/* Although this doesnt render anything, Using it as a component instead of hook to avoid re-renders */}
        <UserIdleTracker />
        <EditorBanner editorId={editorId} />
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
      path={drawerPaths.EDITOR}
      height="tall"
      width={width}>
      <RouterWrappedContent hideSave={hideSave} hidePreview={hidePreview} />
    </RightDrawer>
  );
}
