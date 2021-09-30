import React, { useCallback, useMemo } from 'react';
import { Button } from '@material-ui/core';
import ModalDialog from '../../../../ModalDialog';
import DynaForm from '../../../../DynaForm';
import DynaSubmit from '../../../../DynaForm/DynaSubmit';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';

export default function OperandSettingsDialog({
  ruleData,
  onClose,
  onSubmit,
  disabled,
}) {
  const fieldMeta = useMemo(() => ({
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
  }), [ruleData.type]);

  const handleSubmit = useCallback(
    formValues => {
      const updatedFormValues = {
        type: formValues.type,
      };

      onSubmit(updatedFormValues);
    },
    [onSubmit]
  );
  const formKey = useFormInitWithPermissions({
    fieldMeta,
    disabled,
  });

  return (
    <ModalDialog show>
      <span>Operand settings</span>
      <>
        <DynaForm formKey={formKey} />
        <DynaSubmit formKey={formKey} data-test="saveOperandSettings" onClick={handleSubmit}>
          Save
        </DynaSubmit>
        <Button
          data-test="cancelOperandSettings"
          variant="text"
          color="primary"
          onClick={onClose}>
          Cancel
        </Button>
      </>
    </ModalDialog>
  );
}
