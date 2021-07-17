import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import Icon from '../../../../components/icons/RoutingIcon';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import ModalDialog from '../../../../components/ModalDialog';
import DynaForm from '../../../../components/DynaForm';
import LoadResources from '../../../../components/LoadResources';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import SaveAndCloseButtonGroupForm from '../../../../components/SaveAndCloseButtonGroup/SaveAndCloseButtonGroupForm';
import useFormOnCancelContext from '../../../../components/FormOnCancelContext';

const getFieldMeta = defaultValue => ({
  fieldMap: {
    'as2.contentBasedFlowRouter': {
      id: 'as2.contentBasedFlowRouter',
      name: 'contentBasedFlowRouter',
      type: 'hook',
      editorResultMode: 'text',
      label:
        'Choose a script and function name to use for determining AS2 message routing',
      hookType: 'script',
      hookStage: 'contentBasedFlowRouter',
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
const formKey = 'as2Routing';

function As2RoutingDialog({ isViewMode, resource, open, onClose }) {
  const dispatch = useDispatch();
  const connectionId = resource._connectionId;
  const connection = useSelector(state =>
    selectors.resource(state, 'connections', connectionId)
  );

  const formValues = useSelector(state => selectors.formValueTrimmed(state, formKey), shallowEqual);

  const handleSubmit = useCallback(
    () => {
      const patchSet = [
        {
          op: 'replace',
          path: '/as2/contentBasedFlowRouter/_scriptId',
          value: formValues.contentBasedFlowRouter._scriptId,
        },
        {
          op: 'replace',
          path: '/as2/contentBasedFlowRouter/function',
          value: formValues.contentBasedFlowRouter.function,
        },
      ];

      // using PATCH call here as other fields on the connection doc are not impacted
      dispatch(
        actions.resource.patch('connections', connectionId, patchSet, formKey)
      );
    },
    [formValues.contentBasedFlowRouter._scriptId, formValues.contentBasedFlowRouter.function, dispatch, connectionId]
  );
  const value =
    connection && connection.as2 && connection.as2.contentBasedFlowRouter
      ? connection.as2.contentBasedFlowRouter
      : {};
  const fieldMeta = getFieldMeta(value);

  const [count, setCount] = useState(0);

  const remountAfterSaveFn = useCallback(() => {
    setCount(count => count + 1);
  }, []);

  useFormInitWithPermissions({
    fieldMeta,
    disabled: isViewMode,
    formKey,
    remount: count,
  });

  const {setCancelTriggered, disabled} = useFormOnCancelContext(formKey);

  return (
    <ModalDialog show={open} onClose={setCancelTriggered} disableClose={disabled}>
      <div>AS2 connection routing rules</div>
      <LoadResources required resources="scripts">
        <DynaForm formKey={formKey} />
        <SaveAndCloseButtonGroupForm
          disabled={isViewMode}
          formKey={formKey}
          onClose={onClose}
          onSave={handleSubmit}
          remountAfterSaveFn={remountAfterSaveFn}
         />
      </LoadResources>
    </ModalDialog>
  );
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'as2Routing',
  position: 'left',
  Icon,
  helpKey: 'fb.pg.exports.as2routing',
  Component: As2RoutingDialog,
};
