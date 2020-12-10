import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouteMatch, Redirect } from 'react-router-dom';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/TransformIcon';

function TxLauncher({ flowId, resourceType, resourceId, onClose, open }) {
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const editorId = `tx-${resourceId}`;

  useEffect(() => {
    if (!open) return;

    // All this does is tell the parent component to shrink the set of processor icon buttons.
    // The original idea is tht they would all stay open until the action was completed, but i
    // think it doesn't matter that they shrink. Most times the drawer would overlay the FB and
    // the other processor buttons would not even be visible.
    onClose();

    dispatch(actions._editor.init(editorId, 'transform', {
      rule: resourceId.transformation || [],
      // formKey is only for editors launch by a form. Is this correct?
      // formKey,
      flowId,
      resourceId,
      resourceType,
      // i don't think we need this? Is this used along with the formKey?
      // fieldId: 'export.transform,
      stage: 'transform',

      // We could also use the onSave callback to call the proxied onClose
      // from the parent component.
      // onSave: onClose,
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return open
    ? <Redirect push to={`${match.url}/editor/${editorId}`} />
    : null;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'exportTransformation',
  position: 'right',
  Icon,
  helpKey: 'fb.pg.exports.transform',
  Component: TxLauncher,
};
