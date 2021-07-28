import React, { useEffect } from 'react';
import shallowEqual, { useSelector } from 'react-redux';
import DynaForm from '../..';
import { getCreateScriptMetadata } from './utils';
import ModalDialog from '../../../ModalDialog';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import SaveAndCloseMiniResourceForm from '../../../SaveAndCloseButtonGroup/SaveAndCloseMiniResourceForm';
import { selectors } from '../../../../reducers';
import { FORM_SAVE_STATUS } from '../../../../utils/constants';
import { useFormOnCancel } from '../../../FormOnCancelContext';

const formKey = 'dynahookafecreatescriptdialog';

export default function CreateScriptDialog({ onClose, onSave, scriptId }) {
  const { optionsHandler, ...rest } = getCreateScriptMetadata(scriptId);
  const values = useSelector(state => selectors.formValueTrimmed(state, formKey), shallowEqual);
  const handleSubmit = () => onSave(values, formKey);

  useFormInitWithPermissions({
    fieldMeta: rest,
    optionsHandler,
    formKey,
  });
  const status = useSelector(state => selectors.asyncTaskStatus(state, formKey));

  useEffect(() => {
    if (status === FORM_SAVE_STATUS.COMPLETE) {
      onClose();
    }
  }, [status, onClose]);
  const {setCancelTriggered, disabled} = useFormOnCancel(formKey);

  return (
    <ModalDialog disableClose={disabled} show onClose={setCancelTriggered} minWidth="sm">
      <div>Create script</div>
      <div>
        <DynaForm
          formKey={formKey} />
      </div>
      <div>
        <SaveAndCloseMiniResourceForm
          formKey={formKey}
          formSaveStatus={status}
          handleSave={handleSubmit}
          handleCancel={onClose}
          />
      </div>
    </ModalDialog>
  );
}
