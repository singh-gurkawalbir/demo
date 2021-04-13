import React, { useEffect } from 'react';
import { useRouteMatch, Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/TransformIcon';

function ResponseTransformationLauncher({ flowId, resourceType, resourceId, onClose, open }) {
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const editorId = `responseTransform-${resourceId}`;

  useEffect(() => {
    if (!open) return;

    // All this does is tell the parent component to shrink the set of processor icon buttons.
    onClose();

    dispatch(actions._editor.init(editorId, 'responseTransform', {
      flowId,
      resourceId,
      resourceType,
      stage: 'sampleResponse',
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return open
    ? <Redirect push to={`${match.url}/editor/${editorId}`} />
    : null;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'responseTransformation',
  position: 'middle',
  Icon,
  helpKey: 'fb.pp.imports.transform',
  Component: ResponseTransformationLauncher,
};
