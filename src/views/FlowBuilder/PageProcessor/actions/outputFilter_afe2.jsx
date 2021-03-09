import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouteMatch, Redirect } from 'react-router-dom';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/OutputFilterIcon';

function OutputFilterLauncher({ flowId, resourceType, resourceId, onClose, open }) {
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const editorId = `oFilter-${resourceId}`;

  useEffect(() => {
    if (!open) return;

    // All this does is tell the parent component to shrink the set of processor icon buttons.
    onClose();

    dispatch(actions._editor.init(editorId, 'outputFilter', {
      flowId,
      resourceId,
      resourceType,
      stage: 'outputFilter',
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return open
    ? <Redirect push to={`${match.url}/editor/${editorId}`} />
    : null;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'outputFilter',
  position: 'middle',
  Icon,
  helpKey: 'fb.pp.exports.filter',
  Component: OutputFilterLauncher,
};
