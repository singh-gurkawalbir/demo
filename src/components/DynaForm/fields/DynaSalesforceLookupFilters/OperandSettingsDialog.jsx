import { Fragment, useCallback } from 'react';
import { Button } from '@material-ui/core';
import ModalDialog from '../../../ModalDialog';
import DynaForm from '../..';
import DynaSubmit from '../../DynaSubmit';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';

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
  const formKey = useFormInitWithPermissions({
    fieldsMeta: fieldMeta,
    disabled,
  });

  return (
    <ModalDialog show>
      <span>Operand Settings</span>
      <Fragment>
        <DynaForm formKey={formKey} fieldMeta={fieldMeta} />
        <Button data-test="cancelOperandSettings" onClick={onClose}>
          Cancel
        </Button>
        <DynaSubmit
          formKey={formKey}
          data-test="saveOperandSettings"
          onClick={handleSubmit}>
          Save
        </DynaSubmit>
      </Fragment>
    </ModalDialog>
  );
}
