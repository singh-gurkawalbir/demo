import React, { useCallback } from 'react';
import { Button } from '@material-ui/core';
import ModalDialog from '../../../../ModalDialog';
import DynaForm from '../..';
import DynaSubmit from '../../../DynaSubmit';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';

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
        label: 'Operand type',
        showOptionsHorizontally: true,
        fullWidth: true,
        options: [
          {
            items: [
              { label: 'Field', value: 'field' },
              { label: 'Value', value: 'value' },
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

  const formKey = useFormInitWithPermissions({disabled, fieldMeta});

  return (
    <ModalDialog show>
      <span>Operand settings</span>
      <>
        <DynaForm formKey={formKey} />
        <Button data-test="cancelOperandSettings" onClick={onClose}>
          Cancel
        </Button>
        <DynaSubmit formKey={formKey} data-test="saveOperandSettings" onClick={handleSubmit}>
          Save
        </DynaSubmit>
      </>
    </ModalDialog>
  );
}
