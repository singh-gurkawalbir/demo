import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouteMatch, Redirect } from 'react-router-dom';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/OutputFilterIcon';

function ExportFilterLauncher({ flowId, resourceType, resourceId, onClose, open }) {
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const editorId = `eFilter-${resourceId}`;

  useEffect(() => {
    if (!open) return;

    // All this does is tell the parent component to shrink the set of processor icon buttons.
    onClose();

    dispatch(actions._editor.init(editorId, 'exportFilter', {
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
  name: 'exportFilter',
  position: 'right',
  Icon,
  helpKey: 'fb.pg.exports.filter',
  Component: ExportFilterLauncher,
};
