import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import Icon from '../../../../components/icons/RoutingIcon';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import ModalDialog from '../../../../components/ModalDialog';
import DynaForm from '../../../../components/DynaForm';
import DynaSubmit from '../../../../components/DynaForm/DynaSubmit';
import LoadResources from '../../../../components/LoadResources';
import ButtonGroup from '../../../../components/ButtonGroup';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import useSaveStatusIndicator from '../../../../hooks/useSaveStatusIndicator';

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
          path: '/as2/contentBasedFlowRouter/_scriptId',
          value: value.contentBasedFlowRouter._scriptId,
        },
        {
          op: 'replace',
          path: '/as2/contentBasedFlowRouter/function',
          value: value.contentBasedFlowRouter.function,
        },
      ];

      // using PATCH call here as other fields on the connection doc are not impacted
      dispatch(
        actions.resource.patch('connections', connectionId, patchSet)
      );
    },
    [dispatch, connectionId]
  );
  const value =
    connection && connection.as2 && connection.as2.contentBasedFlowRouter
      ? connection.as2.contentBasedFlowRouter
      : {};
  const fieldMeta = getFieldMeta(value);
  const formKey = useFormInitWithPermissions({
    fieldMeta,
    disabled: isViewMode,
  });

  const { submitHandler, disableSave, defaultLabels} = useSaveStatusIndicator(
    {
      path: `/connections/${connectionId}`,
      method: 'PATCH',
      disabled: isViewMode,
      onSave: handleSubmit,
      onClose,
    }
  );

  return (
    <ModalDialog show={open} onClose={onClose} disabled={isViewMode}>
      <div>AS2 connection routing rules</div>
      <LoadResources required resources="scripts">
        <DynaForm formKey={formKey} fieldMeta={fieldMeta} />
        <ButtonGroup>
          <DynaSubmit
            formKey={formKey}
            disabled={disableSave}
            data-test={`as2routing-${connectionId}`}
            onClick={submitHandler()}>
            {defaultLabels.saveLabel}
          </DynaSubmit>
          <DynaSubmit
            formKey={formKey}
            disabled={disableSave}
            color="secondary"
            data-test={`as2routingsaveclose-${connectionId}`}
            onClick={submitHandler(true)}>
            {defaultLabels.saveAndCloseLabel}
          </DynaSubmit>
          <Button
            data-test={`cancelAs2routing-${connectionId}`}
            onClick={onClose}>
            Cancel
          </Button>
        </ButtonGroup>
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
