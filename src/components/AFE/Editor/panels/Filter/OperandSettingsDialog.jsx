import React, { useMemo, useCallback } from 'react';
import ModalDialog from '../../../../ModalDialog';
import DynaForm from '../../../../DynaForm';
import DynaSubmit from '../../../../DynaForm/DynaSubmit';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import { TextButton } from '../../../../Buttons';

const transformations = {
  number: [
    { value: 'ceiling', label: 'Ceiling' },
    { value: 'floor', label: 'Floor' },
    { value: 'abs', label: 'Absolute' },
  ],
  string: [
    { value: 'lowercase', label: 'Lowercase' },
    { value: 'uppercase', label: 'Uppercase' },
  ],
};
const optionsHandler = (fieldId, fields) => {
  if (fieldId === 'transformations') {
    const dataTypeField = fields.find(field => field.id === 'dataType');

    return [
      {
        items: transformations[dataTypeField.value] || [],
      },
    ];
  }

  return null;
};

export default function OperandSettingsDialog({
  ruleData,
  onClose,
  onSubmit,
  disabled,
}) {
  const fieldMeta = useMemo(
    () => ({
      fieldMap: {
        operandType: {
          id: 'type',
          name: 'type',
          type: 'radiogroup',
          label: 'Operand type',
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
        dataType: {
          id: 'dataType',
          name: 'dataType',
          type: 'select',
          label: 'Data type',
          options: [
            {
              items: [
                { label: 'Boolean', value: 'boolean' },
                { label: 'Date Time', value: 'epochtime' },
                { label: 'Number', value: 'number' },
                { label: 'String', value: 'string' },
              ],
            },
          ],
          defaultValue: ruleData.dataType || 'string',
          visibleWhen: [
            {
              field: 'type',
              is: ['field'],
            },
            {
              field: 'type',
              is: ['value'],
            },
          ],
        },
        transformations: {
          id: 'transformations',
          name: 'transformations',
          type: 'multiselect',
          label: 'Apply functions',
          refreshOptionsOnChangesTo: ['dataType'],
          options: [
            {
              items: transformations[ruleData.dataType] || [],
            },
          ],
          defaultValue: ruleData.transformations || [],
          visibleWhenAll: [
            {
              field: 'type',
              is: ['field'],
            },
            {
              field: 'dataType',
              is: ['string', 'number'],
            },
          ],
        },
      },
      layout: {
        fields: ['operandType', 'dataType', 'transformations'],
      },
    }),
    [ruleData.dataType, ruleData.transformations, ruleData.type]
  );
  const handleSubmit = useCallback(
    formValues => {
      const updatedFormValues = {
        type: formValues.type,
        dataType: formValues.type === 'expression' ? '' : formValues.dataType,
        transformations: formValues.transformations,
      };

      onSubmit(updatedFormValues);
    },
    [onSubmit]
  );
  const formKey = useFormInitWithPermissions({
    fieldMeta,
    disabled,
    optionsHandler,
  });

  return (
    <ModalDialog show>
      <span>Operand settings</span>
      <>
        <DynaForm
          formKey={formKey} />
        <DynaSubmit
          formKey={formKey}
          data-test="saveOperandSettings"
          onClick={handleSubmit}>
          Save
        </DynaSubmit>
        <TextButton
          data-test="cancelOperandSettings"
          onClick={onClose}>
          Cancel
        </TextButton>
      </>
    </ModalDialog>
  );
}
