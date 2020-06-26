import React from 'react';
import Button from '@material-ui/core/Button';
import DynaForm from '../..';
import DynaSubmit from '../../DynaSubmit';
import { getCreateScriptMetadata } from './utils';
import ModalDialog from '../../../ModalDialog';
import useSaveStatusIndicator from '../../../../hooks/useSaveStatusIndicator';

export default function CreateScriptDialog({ onClose, onSave, scriptId }) {
  const { optionsHandler, ...rest } = getCreateScriptMetadata(scriptId);
  const handleSubmit = values => onSave(values);
  const { submitHandler, disableSave, saveInProgress} = useSaveStatusIndicator(
    {
      path: '/scripts',
      method: 'post',
      onSave: handleSubmit,
      onClose,
    }
  );
  return (
    <ModalDialog show onClose={onClose}>
      <div>Create Script</div>
      <div>
        <DynaForm fieldMeta={rest} optionsHandler={optionsHandler}>
          <DynaSubmit data-test="saveScript" onClick={submitHandler(true)} disabled={disableSave}>
            {saveInProgress ? 'Saving' : 'Save'}
          </DynaSubmit>
          <Button data-test="cancelScript" onClick={onClose}>
            Cancel
          </Button>
        </DynaForm>
      </div>
    </ModalDialog>
  );
}
