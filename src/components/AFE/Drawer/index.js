import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { useParams, useRouteMatch, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { useIdleTimer } from 'react-idle-timer';
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

const DEBOUNCE_DURATION = 1000 * 1;

const SESSION_DURATION_BEFORE_ALERT = Number(process.env.SESSION_EXPIRATION_INTERVAL) -
Number(process.env.SESSION_WARNING_INTERVAL_PRIOR_TO_EXPIRATION) -
// To prevent a race condition with the isSessionExpiredOrInWarning lets set the timeout 5 seconds prior to the alert
 1000 * 5;

const getTimeElapsedDuringSession = sessionValidTimestamp => Date.now() - sessionValidTimestamp;

const useKeepUserSessionAlive = () => {
  const sessionValidTimestamp = useSelector(state => selectors.sessionValidTimestamp(state));
  const isSessionExpiredOrInWarning = useSelector(state => !!selectors.showSessionStatus(state));
  const dispatch = useDispatch();
  const [timeoutValue, setTimeoutValue] = useState(SESSION_DURATION_BEFORE_ALERT);

  const onActive = useCallback(() => {
    if (isSessionExpiredOrInWarning) {
      return;
    }

    const timeSessionElapsed = getTimeElapsedDuringSession(sessionValidTimestamp);

    // set the time out for the remaining session duration
    setTimeoutValue(SESSION_DURATION_BEFORE_ALERT - timeSessionElapsed);
  }, [isSessionExpiredOrInWarning, sessionValidTimestamp]);
  const onIdle = useCallback(() => {
    if (isSessionExpiredOrInWarning) {
      return;
    }

    dispatch(actions.user.profile.request('Refreshing session'));
    // reset the timeout for the full session duration

    setTimeoutValue(SESSION_DURATION_BEFORE_ALERT);
  }, [dispatch, isSessionExpiredOrInWarning]);

  const {reset} = useIdleTimer({
    timeout: timeoutValue,
    throttle: DEBOUNCE_DURATION,
    onIdle,
    onAction: onActive,
  });

  useEffect(() => {
    reset();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionValidTimestamp, timeoutValue]);
};

// hideSave: This is currently only used for the playground where we do not
// want the user to have any options to save the editor.
function RouterWrappedContent({ hideSave }) {
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
  useKeepUserSessionAlive();

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
