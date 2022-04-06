import React, { useCallback, useMemo } from 'react';
import ModalDialog from '../../../../ModalDialog';
import DynaForm from '../../../../DynaForm';
import DynaSubmit from '../../../../DynaForm/DynaSubmit';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import { TextButton } from '../../../../Buttons';
import { emptyObject } from '../../../../../utils/constants';
import ActionGroup from '../../../../ActionGroup';

export default function OperandSettingsDialog({
  ruleData = emptyObject,
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
    <ModalDialog show onClose={onClose}>
      <>Operand settings</>
      <>
        <DynaForm formKey={formKey} />
      </>
      <ActionGroup>
        <DynaSubmit formKey={formKey} data-test="saveOperandSettings" onClick={handleSubmit}>
          Save
        </DynaSubmit>
        <TextButton
          data-test="cancelOperandSettings"
          onClick={onClose}>
          Cancel
        </TextButton>
      </ActionGroup>
    </ModalDialog>
  );
}
