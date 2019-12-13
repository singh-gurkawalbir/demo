import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Icon from '../../../../components/icons/HookIcon';
import actions from '../../../../actions';
import * as selectors from '../../../../reducers';
import JavaScriptEditorDialog from '../../../../components/AFE/JavaScriptEditor/Dialog';
import helpTextMap from '../../../../components/Help/helpTextMap';

function As2RoutingDialog({ isViewMode, resource, open, onClose }) {
  const dispatch = useDispatch();
  const connectionId = resource._connectionId;
  const connection = useSelector(state =>
    selectors.resource(state, 'connections', connectionId)
  );
  const handleClose = useCallback(
    (shouldCommit, editor) => {
      if (!shouldCommit) return onClose();

      const patchSet = [
        {
          op: 'replace',
          path: '/as2/contentBasedFlowRouter',
          value: { _scriptId: editor.scriptId, function: editor.entryFunction },
        },
      ];

      dispatch(actions.resource.patchStaged(connectionId, patchSet, 'value'));
      dispatch(
        actions.resource.commitStaged('connections', connectionId, 'value')
      );
      onClose();
    },
    [dispatch, onClose, connectionId]
  );
  const value =
    connection && connection.as2 && connection.as2.contentBasedFlowRouter
      ? connection.as2.contentBasedFlowRouter
      : {};

  return (
    <JavaScriptEditorDialog
      open={open}
      title="AS2 routing rules"
      id="as2routing"
      data={JSON.stringify({ data: 'coming soon' }, null, 2)}
      scriptId={value._scriptId}
      entryFunction={value.function || 'main'}
      onClose={handleClose}
      onCancel={onClose}
      disabled={isViewMode}
    />
  );
}

function As2Routing(props) {
  if (!props.open) return null;

  return <As2RoutingDialog {...props} />;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'as2Routing',
  position: 'left',
  Icon,
  helpText: helpTextMap['fb.pg.exports.as2routing'],
  Component: As2Routing,
};
