import { Fragment } from 'react';
import { Button } from '@material-ui/core';
import ModalDialog from '../../../ModalDialog';
import DynaForm from '../../../DynaForm';
import DynaSubmit from '../../../DynaForm/DynaSubmit';

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
  const handleSubmit = formValues => {
    const updatedFormValues = {
      type: formValues.type,
    };

    onSubmit(updatedFormValues);
  };

  return (
    <ModalDialog show>
      <span>Operand Settings</span>
      <Fragment>
        <DynaForm
          disabled={disabled}
          fieldMeta={fieldMeta}
          optionsHandler={fieldMeta.optionsHandler}>
          <Button
            data-test="cancelOperandSettings"
            onClick={() => {
              onClose();
            }}>
            Cancel
          </Button>
          <DynaSubmit data-test="saveOperandSettings" onClick={handleSubmit}>
            Save
          </DynaSubmit>
        </DynaForm>
      </Fragment>
    </ModalDialog>
  );
}
