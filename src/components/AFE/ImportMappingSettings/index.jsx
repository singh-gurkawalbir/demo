import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';
import DynaForm from '../../DynaForm';
import DynaSubmit from '../../DynaForm/DynaSubmit';
import dateTimezones from '../../../utils/dateTimezones';
import fieldExpressions from '../../../utils/fieldExpressions';
import utilityFunctions from '../../../utils/utilityFunctions';
import Lookup from './Lookup';

const useStyles = makeStyles(() => ({
  modalContent: {
    width: '70vw',
  },
}));
const optionsHandler = (fieldId, fields) => {
  if (fieldId === 'expression') {
    const functionsField = fields.find(field => field.id === 'functions');
    const extractField = fields.find(field => field.id === 'extract');
    const expressionField = fields.find(field => field.id === 'expression');
    let expressionValue = '';

    if (expressionField.value) expressionValue = expressionField.value;

    if (extractField.value) expressionValue += extractField.value;

    if (functionsField.value)
      expressionValue += utilityFunctions.getHandlebarHelperFormat(
        functionsField.value
      );

    return expressionValue;
  } else if (fieldId === 'standardAction') {
    const actionField = fields.find(
      field => field.id === 'restImportFieldMappingSettings'
    );

    switch (actionField.value) {
      case 'hardCoded':
        return [
          {
            items: [
              {
                label: `Use Empty String as hardcoded Value`,
                value: 'useEmptyString',
              },
              {
                label: 'Use Null as hardcoded Value',
                value: 'useNull',
              },
              {
                label: 'Use Custom Value',
                value: 'default',
              },
            ],
          },
        ];
      case 'lookup':
        return [
          {
            items: [
              {
                label: 'Fail Record',
                value: 'disallowFailure',
              },
              {
                label: `Use Empty String as hardcoded Value`,
                value: 'useEmptyString',
              },
              {
                label: 'Use Null as hardcoded Value',
                value: 'useNull',
              },
              {
                label: 'Use Custom Value',
                value: 'default',
              },
            ],
          },
        ];
      default:
        return [
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
        ];
    }
  }

  return null;
};

export default function ImportMappingSettings(props) {
  const {
    title,
    value,
    onClose,
    extractFields,
    lookup,
    updateLookup,
    application,
  } = props;
  const classes = useStyles();
  const getDefaultDataType = () => {
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
        defaultValue: getDefaultDataType(),
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
              { label: 'Lookup', value: 'lookup' },
              { label: 'Multi-Field', value: 'multifield' },
            ],
          },
        ],
      },
      {
        formId: 'lookup',
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
        id: 'extract',
        name: 'extract',
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
        refreshOptionsOnChangesTo: ['functions', 'extract'],
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
        id: 'standardAction',
        name: 'standardAction',
        type: 'radiogroup',
        defaultValue: getDefaultValue(),
        refreshOptionsOnChangesTo: ['restImportFieldMappingSettings'],
        label: 'Action to take if value not found:',
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
            field: 'standardAction',
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

  fieldMeta.fields = fieldMeta.fields.flatMap(field => {
    if (field.formId === 'lookup') {
      const lookupMeta = Lookup.getLookupMeta(lookup || {}, application, {
        field: 'restImportFieldMappingSettings',
        is: ['lookup'],
      });

      return lookupMeta.fields;
    }

    return field;
  });
  const handleSubmit = formVal => {
    const mappingSettingsTmp = {};

    mappingSettingsTmp.generate = value.generate;

    if (formVal.dataType === 'date') {
      mappingSettingsTmp.dataType = 'string';
      mappingSettingsTmp.exportDateTimeZone = formVal.exportDateTimeZone;
      mappingSettingsTmp.exportDateFormat = formVal.exportDateFormat;
      mappingSettingsTmp.importDateFormat = formVal.importDateFormat;
      mappingSettingsTmp.importDateTimeZone = formVal.importDateTimeZone;
    } else if (formVal.dataType) {
      mappingSettingsTmp.dataType = formVal.dataType;
    }

    if (formVal.restImportFieldMappingSettings === 'hardCoded') {
      // in case of hardcoded value, we dont save extract property
      switch (formVal.standardAction) {
        case 'useEmptyString':
          mappingSettingsTmp.hardCodedValue = '';
          break;
        case 'useNull':
          mappingSettingsTmp.hardCodedValue = null;
          break;
        case 'default':
          mappingSettingsTmp.hardCodedValue = formVal.default;
          break;
        default:
      }
    } else {
      if (formVal.restImportFieldMappingSettings === 'multifield') {
        mappingSettingsTmp.extract = formVal.expression;
      } else {
        mappingSettingsTmp.extract = value.extract;
      }

      switch (formVal.standardAction) {
        case 'useEmptyString':
          mappingSettingsTmp.default = '';
          break;
        case 'useNull':
          mappingSettingsTmp.default = null;
          break;
        case 'default':
          mappingSettingsTmp.default = formVal.default;
          break;
        default:
      }
    }

    if (formVal.restImportFieldMappingSettings === 'lookup') {
      const lookupTmp = {};

      if (lookup && lookup.name) {
        lookupTmp.name = lookup.name;
      } else {
        lookupTmp.name = utilityFunctions.getRandomName();
      }

      mappingSettingsTmp.lookupName = lookupTmp.name;

      if (formVal._mode === 'dynamic') {
        lookupTmp.method = formVal._method;
        lookupTmp.relativeURI = formVal._relativeURI;
        // lookup.allowFailures = false
        lookupTmp.extract = formVal._extract;
        lookupTmp.postBody = formVal._postBody;
      } else {
        lookupTmp.map = {};
        formVal._mapList.forEach(obj => {
          lookupTmp.map[obj.export] = obj.import;
        });
      }

      if (formVal.standardAction === 'disallowFailure')
        lookupTmp.allowFailures = false;
      else {
        lookupTmp.allowFailures = true;

        switch (formVal.standardAction) {
          case 'useEmptyString':
            lookupTmp.default = '';
            break;
          case 'useNull':
            lookupTmp.default = null;
            break;
          case 'default':
            lookupTmp.default = formVal.default;
            break;
          default:
        }
      }

      updateLookup(false, lookupTmp);
    } else if (lookup) {
      // delete the lookup . case where lookup was present before but its not a part of mapping anymore
      updateLookup(true, lookup);
    }

    onClose(true, mappingSettingsTmp);
  };

  return (
    <Dialog open maxWidth={false}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent className={classes.modalContent}>
        <DynaForm fieldMeta={fieldMeta} optionsHandler={optionsHandler}>
          <Button
            onClick={() => {
              onClose(false);
            }}>
            Cancel
          </Button>
          <DynaSubmit onClick={handleSubmit}>Save</DynaSubmit>
        </DynaForm>
      </DialogContent>
    </Dialog>
  );
}
