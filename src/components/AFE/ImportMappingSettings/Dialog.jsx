import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import DynaForm from '../../DynaForm';
import DynaSubmit from '../../DynaForm/DynaSubmit';
import dateTimezones from '../../../utils/dateTimezones';
import fieldExpressions from '../../../utils/fieldExpressions';
import utilityFunctions from '../../../utils/utilityFunctions';

const optionsHandler = (fieldId, fields) => {
  if (fieldId === 'expression') {
    const functionsField = fields.find(field => field.id === 'functions');
    const expressionField = fields.find(field => field.id === 'expression');
    let x = '';

    if (expressionField.value) x = expressionField.value;

    if (functionsField.value)
      return (
        x + utilityFunctions.getHandlebarHelperFormat(functionsField.value)
      );
  }

  return null;
};

export default function ImportMappingSettingsDialog(props) {
  const { value, onClose } = props;
  const { extractFields = ['billing_address', 'name', 'age'] } = props;
  const getDataType = () => {
    if (
      value.extractDateFormat ||
      value.extractDateTimezone ||
      value.generateDateFormat ||
      value.generateDateTimezone
    ) {
      return 'date';
    }

    return value.dataType;
  };

  const getFieldMappingType = () => {
    if (value.lookupName) {
      return 'lookup';
    } else if ('hardCodedValue' in value) {
      return 'hardCoded';
    } else if (value.extract && value.extract.indexOf('{{') !== -1) {
      return 'multifield';
    }

    return 'standard';
  };

  const getDefaultExpression = () => {
    if (value.extract && value.extract.indexOf('{{') !== -1) {
      return value.extract;
    }
  };

  const getDefaultValue = () => {
    if ('default' in value) {
      switch (value.default) {
        case '':
          return 'useEmptyString';
        case null:
          return 'useNull';
        default:
          return 'default';
      }
    }
  };

  const fieldMeta = {
    fields: [
      {
        id: 'dataType',
        name: 'dataType',
        type: 'select',
        label: 'Data Type:',
        defaultValue: getDataType(),
        options: [
          {
            items: [
              { label: 'String', value: 'string' },
              { label: 'Number', value: 'number' },
              { label: 'Boolean', value: 'boolean' },
              { label: 'Date', value: 'date' },
              { label: 'Number Array', value: 'numberarray' },
              { label: 'String Array', value: 'stringarray' },
            ],
          },
        ],
      },
      {
        id: 'discardIfEmpty',
        name: 'discardIfEmpty',
        type: 'checkbox',
        defaultValue: value.discardIfEmpty || false,
        label: 'Discard If Empty:',
      },
      {
        id: 'immutable',
        name: 'immutable',
        type: 'checkbox',
        defaultValue: value.immutable || false,
        label: 'Immutable (Advanced):',
      },
      {
        id: 'restImportFieldMappingSettings',
        name: 'restImportFieldMappingSettings',
        type: 'radiogroup',
        label: 'Field Mapping Type:',
        defaultValue: getFieldMappingType(),
        showOptionsHorizontally: true,
        fullWidth: true,
        options: [
          {
            items: [
              { label: 'Standard', value: 'standard' },
              { label: 'Hard-Coded', value: 'hardCoded' },
              // the feature is to be enabled later
              // { label: 'Static-Lookup', value: 'lookup' },
              { label: 'Multi-Field', value: 'multifield' },
            ],
          },
        ],
      },
      {
        id: 'lookups',
        name: 'lookups',
        type: 'staticMap',
        keyName: 'export',
        keyLabel: 'Export Field',
        valueName: 'import',
        valueLabel: 'Import Field',
        visibleWhen: [
          {
            field: 'restImportFieldMappingSettings',
            is: ['lookup'],
          },
        ],
      },
      {
        id: 'functions',
        name: 'functions',
        type: 'select',
        label: 'Function:',
        options: [
          {
            items:
              (fieldExpressions &&
                fieldExpressions.map(field => ({
                  label: field[1],
                  value: field[0],
                }))) ||
              [],
          },
        ],
        visibleWhen: [
          {
            field: 'restImportFieldMappingSettings',
            is: ['multifield'],
          },
        ],
      },
      {
        id: 'field',
        name: 'field',
        type: 'select',
        label: 'Field:',
        options: [
          {
            items:
              (extractFields &&
                extractFields.map(field => ({ label: field, value: field }))) ||
              [],
          },
        ],
        visibleWhen: [
          {
            field: 'restImportFieldMappingSettings',
            is: ['multifield'],
          },
        ],
      },
      {
        id: 'expression',
        name: 'expression',
        refreshOptionsOnChangesTo: ['functions'],
        type: 'text',
        label: 'Expression:',
        defaultValue: getDefaultExpression(),
        visibleWhen: [
          {
            field: 'restImportFieldMappingSettings',
            is: ['multifield'],
          },
        ],
      },
      {
        id: 'failRecord',
        name: 'failRecord',
        type: 'radiogroup',
        defaultValue: getDefaultValue(),
        label: 'Action to take if unique match not found:',
        options: [
          {
            items: [
              {
                label: `Use Empty String as Default Value`,
                value: 'useEmptyString',
              },
              {
                label: 'Use Null as Default Value',
                value: 'useNull',
              },
              {
                label: 'Use Custom Default Value',
                value: 'default',
              },
            ],
          },
        ],
      },
      {
        id: 'default',
        name: 'default',
        type: 'text',
        label: 'Enter Default Value:',
        placeholder: 'Enter Default Value',
        defaultValue: value.default,
        visibleWhen: [
          {
            field: 'failRecord',
            is: ['default'],
          },
        ],
      },
      {
        id: 'exportDateFormat',
        name: 'exportDateFormat',
        type: 'text',
        label: 'Export Date Format',
        placeholder: '',
        visibleWhen: [
          {
            field: 'dataType',
            is: ['date'],
          },
        ],
      },
      {
        id: 'exportDateTimeZone',
        name: 'exportDateTimeZone',
        type: 'select',
        label: 'Export Date TimeZone:',
        options: [
          {
            items:
              (dateTimezones &&
                dateTimezones.map(date => ({
                  label: date.label,
                  value: date.value,
                }))) ||
              [],
          },
        ],
        visibleWhen: [
          {
            field: 'dataType',
            is: ['date'],
          },
        ],
      },
      {
        id: 'importDateFormat',
        name: 'importDateFormat',
        type: 'text',
        label: 'Import Date Format',
        placeholder: '',
        visibleWhen: [
          {
            field: 'dataType',
            is: ['date'],
          },
        ],
      },
      {
        id: 'importDateTimeZone',
        name: 'importDateTimeZone',
        type: 'select',
        label: 'Import Date TimeZone:',
        options: [
          {
            items:
              (dateTimezones &&
                dateTimezones.map(date => ({
                  label: date.label,
                  value: date.value,
                }))) ||
              [],
          },
        ],
        visibleWhen: [
          {
            field: 'dataType',
            is: ['date'],
          },
        ],
      },
    ],
  };
  const save = formVal => {
    const mappingSettingsTmp = { ...formVal };

    mappingSettingsTmp.generate = value.generate;
    mappingSettingsTmp.extract = value.extract;

    if (mappingSettingsTmp.dataType !== 'date') {
      delete mappingSettingsTmp.exportDateTimeZone;
      delete mappingSettingsTmp.exportDateFormat;
      delete mappingSettingsTmp.importDateFormat;
      delete mappingSettingsTmp.importDateTimeZone;
    } else {
      mappingSettingsTmp.dataType = 'string';
    }

    if (mappingSettingsTmp.restImportFieldMappingSettings === 'hardCoded') {
      switch (mappingSettingsTmp.failRecord) {
        case 'useEmptyString':
          mappingSettingsTmp.hardCodedValue = '';
          break;
        case 'useNull':
          mappingSettingsTmp.hardCodedValue = null;
          break;
        case 'default':
          mappingSettingsTmp.hardCodedValue = mappingSettingsTmp.default;
          break;
        default:
          delete mappingSettingsTmp.hardCodedValue;
      }

      delete mappingSettingsTmp.extract;
    } else {
      switch (mappingSettingsTmp.failRecord) {
        case 'useEmptyString':
          mappingSettingsTmp.default = '';
          break;
        case 'useNull':
          mappingSettingsTmp.default = null;
          break;
        case 'default':
          mappingSettingsTmp.default = mappingSettingsTmp.default;
          break;
        default:
          delete mappingSettingsTmp.default;
      }
    }

    if (mappingSettingsTmp.restImportFieldMappingSettings === 'multifield') {
      mappingSettingsTmp.extract = mappingSettingsTmp.expression;
    }

    if (!mappingSettingsTmp.dataType) {
      delete mappingSettingsTmp.dataType;
    }

    const lookups = {};

    if (mappingSettingsTmp.restImportFieldMappingSettings === 'lookup') {
      mappingSettingsTmp.lookups.forEach(obj => {
        lookups[obj.export] = obj.import;
      });
    }

    delete mappingSettingsTmp.restImportFieldMappingSettings;
    delete mappingSettingsTmp.lookups;
    delete mappingSettingsTmp.failRecord;
    delete mappingSettingsTmp.field;
    delete mappingSettingsTmp.functions;
    delete mappingSettingsTmp.expression;

    onClose(true, mappingSettingsTmp);
  };

  return (
    <Dialog open maxWidth={false}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent style={{ width: '70vw' }}>
        <DynaForm fieldMeta={fieldMeta} optionsHandler={optionsHandler}>
          <Button
            onClick={() => {
              onClose(false);
            }}>
            Cancel
          </Button>
          <DynaSubmit onClick={save}>Save</DynaSubmit>
        </DynaForm>
      </DialogContent>
    </Dialog>
  );
}
