import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  makeStyles,
  Typography,
} from '@material-ui/core';
import DynaForm from '../../DynaForm';
import DynaSubmit from '../../DynaForm/DynaSubmit';

const useStyles = makeStyles(() => ({
  modalContent: {
    width: '70vw',
  },
}));

export default function OperandSettingsDialog({ ruleData, onClose, onSubmit }) {
  const classes = useStyles();
  const transformations = {
    number: [
      { value: 'ceiling', label: 'Ceiling' },
      { value: 'floor', label: 'Floor' },
    ],
    string: [
      { value: 'lowercase', label: 'Lowercase' },
      { value: 'uppercase', label: 'Uppercase' },
    ],
  };
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
      dataType: {
        id: 'dataType',
        name: 'dataType',
        type: 'select',
        label: 'Data Type',
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
        label: 'Apply Functions',
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
    optionsHandler: (fieldId, fields) => {
      if (fieldId === 'transformations') {
        const dataTypeField = fields.find(field => field.id === 'dataType');

        return [
          {
            items: transformations[dataTypeField.value] || [],
          },
        ];
      }

      return null;
    },
  };
  const handleSubmit = formValues => {
    const updatedFormValues = {
      type: formValues.type,
      dataType: formValues.type === 'expression' ? '' : formValues.dataType,
      transformations: formValues.transformations,
    };

    onSubmit(updatedFormValues);
  };

  return (
    <Dialog open maxWidth={false}>
      <DialogTitle disableTypography>
        <Typography variant="h6">Operand Settings</Typography>
      </DialogTitle>
      <DialogContent className={classes.modalContent}>
        <DynaForm
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
      </DialogContent>
    </Dialog>
  );
}
