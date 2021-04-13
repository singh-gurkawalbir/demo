import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouteMatch, Redirect } from 'react-router-dom';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/HookIcon';

function PostResponseMapHook({ flowId, resourceType, resourceId, onClose, open, resourceIndex }) {
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const editorId = `postResponseMapHook-${resourceId}`;

  useEffect(() => {
    if (!open) return;

    // All this does is tell the parent component to shrink the set of processor icon buttons.
    onClose();

    dispatch(actions.editor.init(editorId, 'postResponseMapHook', {
      flowId,
      resourceId,
      resourceType,
      stage: 'postResponseMapHook',
      resourceIndex,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return open
    ? <Redirect push to={`${match.url}/editor/${editorId}`} />
    : null;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'postResponseMapHook',
  position: 'right',
  Icon,
  Component: PostResponseMapHook,
};
