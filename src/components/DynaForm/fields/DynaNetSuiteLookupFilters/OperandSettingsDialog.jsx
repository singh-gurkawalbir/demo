import { Fragment, useCallback } from 'react';
import { Button } from '@material-ui/core';
import ModalDialog from '../../../ModalDialog';
import DynaForm from '../..';
import DynaSubmit from '../../DynaSubmit';

export default function OperandSettingsDialog({
  ruleData,
  onClose,
  onSubmit,
  disabled,
}) {
  const fieldMeta = {
    fieldMap: {
      operandType: {
        id: 'type',
        name: 'type',
        type: 'radiogroup',
        label: 'Operand Type',
        showOptionsHorizontally: true,
        fullWidth: true,
        options: [
          {
            items: [
              { label: 'Field', value: 'field' },
              { label: 'Value', value: 'value' },
              { label: 'Expression', value: 'expression' },
            ],
          },
        ],
        defaultValue: ruleData.type || 'field',
      },
    },
    layout: {
      fields: ['operandType'],
    },
  };
  const handleSubmit = useCallback(
    formValues => {
      const updatedFormValues = {
        type: formValues.type,
      };

      onSubmit(updatedFormValues);
    },
    [onSubmit]
  );

  return (
    <ModalDialog show>
      <span>Operand Settings</span>
      <Fragment>
        <DynaForm disabled={disabled} fieldMeta={fieldMeta}>
          <DynaSubmit data-test="saveOperandSettings" onClick={handleSubmit}>
            Save
          </DynaSubmit>
          <Button
            data-test="cancelOperandSettings"
            variant="text"
            color="primary"
            onClick={onClose}>
            Cancel
          </Button>
        </DynaForm>
      </Fragment>
    </ModalDialog>
  );
}
