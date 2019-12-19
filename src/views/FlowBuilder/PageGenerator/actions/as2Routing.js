import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import Icon from '../../../../components/icons/RoutingIcon';
import actions from '../../../../actions';
import * as selectors from '../../../../reducers';
import helpTextMap from '../../../../components/Help/helpTextMap';
import ModalDialog from '../../../../components/ModalDialog';
import DynaForm from '../../../../components/DynaForm';
import DynaSubmit from '../../../../components/DynaForm/DynaSubmit';
import LoadResources from '../../../../components/LoadResources';

const getFieldMeta = defaultValue => ({
  fieldMap: {
    'as2.contentBasedFlowRouter': {
      id: 'as2.contentBasedFlowRouter',
      name: 'contentBasedFlowRouter',
      type: 'hook',
      label:
        'Choose a script and function name to use for determining AS2 message routing',
      hookType: 'script',
      // we can "fake" sample data by piggy backing off the default hook and simply
      // override the sample data below.
      preHookData: {
        httpHeaders: {
          'as2-from': 'OpenAS2_appA',
          'as2-to': 'OpenAS2_appB',
        },
        mimeHeaders: {
          'content-type': 'application/edi-x12',
          'content-disposition': 'Attachment; filename=rfc1767.dat',
        },
        rawMessageBody: 'sample message',
      },
      defaultValue,
    },
  },
  layout: {
    fields: ['as2.contentBasedFlowRouter'],
  },
});

function As2RoutingDialog({ isViewMode, resource, open, onClose }) {
  const dispatch = useDispatch();
  const connectionId = resource._connectionId;
  const connection = useSelector(state =>
    selectors.resource(state, 'connections', connectionId)
  );
  const handleSubmit = useCallback(
    value => {
      const patchSet = [
        {
          op: 'replace',
          path: '/as2/contentBasedFlowRouter',
          value: value.contentBasedFlowRouter,
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
  const fieldMeta = getFieldMeta(value);

  return (
    <ModalDialog show={open} onClose={onClose} disabled={isViewMode}>
      <div>AS2 connection routing rules</div>
      <LoadResources required resources="scripts">
        <DynaForm fieldMeta={fieldMeta} disabled={isViewMode}>
          <DynaSubmit
            disabled={isViewMode}
            data-test={`as2routing-${connectionId}`}
            onClick={handleSubmit}>
            Save
          </DynaSubmit>
          <Button
            data-test={`cancelAs2routing-${connectionId}`}
            onClick={onClose}>
            Cancel
          </Button>
        </DynaForm>
      </LoadResources>
    </ModalDialog>
  );
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'as2Routing',
  position: 'left',
  Icon,
  helpText: helpTextMap['fb.pg.exports.as2routing'],
  Component: As2RoutingDialog,
};
